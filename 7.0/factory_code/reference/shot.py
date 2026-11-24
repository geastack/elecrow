# Grabs the board's screen over the RFC2217 bridge into app-<name>.png.
# The bridge drops bytes now and then, and the RLE text stream of a static
# screen is identical every time, so it captures until every line has
# arrived intact at least once and stitches those lines together.
#   shot.py name [reboot | tap x y | drag x1 y1 x2 y2 | wait s | once]...
# `once` keeps the first capture, for a screen that is up only briefly.
import base64, collections, difflib, re, serial, struct, sys, time, zlib

s = serial.serial_for_url('rfc2217://localhost:2217', do_not_open=True, baudrate=115200, timeout=0.2)
s.dtr = False; s.rts = False
for _ in range(5):
    try: s.open(); break
    except serial.SerialException: time.sleep(1)
else: sys.exit('bridge did not answer')


def drain():
    # The bridge's purge reply goes missing now and then; reading works.
    try: s.reset_input_buffer()
    except serial.SerialException: s.read(1 << 20)


time.sleep(0.3); drain()
args = sys.argv[2:]; once = 'once' in args; args = [a for a in args if a != 'once']; i = 0
while i < len(args):
    a = args[i]
    if a == 'tap': s.write(f'GEADEV TAP {args[i+1]} {args[i+2]}\n'.encode()); i += 3; time.sleep(1.5)
    elif a == 'drag': s.write(f'GEADEV DRAG {args[i+1]} {args[i+2]} {args[i+3]} {args[i+4]} 20 16\n'.encode()); i += 5; time.sleep(2)
    elif a == 'wait': time.sleep(float(args[i+1])); i += 2
    elif a == 'reboot': s.write(b'GEADEV REBOOT\n'); i += 1; time.sleep(0.5); s.read(1 << 20)

GOOD = re.compile(r'GEADEV:DATA ([A-Za-z0-9+/]+=*)$')
BAD = None  # placeholder for a line that arrived damaged


def capture():
    drain()
    s.write(b'GEADEV SCREENSHOT\n')
    buf = b''; t = time.time()
    while time.time() - t < 400 and b'GEADEV:SCREENSHOT END' not in buf: buf += s.read(65536)
    text = buf.decode('latin1')
    if 'SCREENSHOT BEGIN' not in text or 'SCREENSHOT END' not in text: return None
    head, body = text.split('SCREENSHOT BEGIN', 1)[1].split('\n', 1)
    size = (int(head.split('width=')[1].split()[0]), int(head.split('height=')[1].split()[0]))
    lines = [l for l in body.split('GEADEV:SCREENSHOT END')[0].replace('\r', '').split('\n') if l]
    full = collections.Counter(len(l) for l in lines).most_common(1)[0][0]
    out = []
    for n, l in enumerate(lines):
        m = GOOD.match(l)
        ok = m and (len(l) == full or n == len(lines) - 1) and len(m.group(1)) % 4 == 0
        # A damaged line that swallowed a newline stands for several lines.
        out += [m.group(1)] if ok else [BAD] * max(1, round(len(l) / full))
    return size, out


def decode(lines):
    p = b''.join(base64.b64decode(l) for l in lines)
    return sum(p[k] | p[k+1] << 8 for k in range(0, len(p) - 3, 4)), p


# Each capture is aligned to the merged one by content: a run of damaged
# lines is replaced by the matching run of intact lines from another capture.
merged = None; best = None; width = height = 0; lines = []; bad = 0
for attempt in range(1 if once else 16):
    got = capture()
    if not got: print('incomplete reply'); continue
    (width, height), lines = got
    if best is None or sum(l is BAD for l in lines) < sum(l is BAD for l in best): best = lines
    if merged is None: merged = lines
    else:
        keyed = lambda ls: [l if l is not BAD else f'#bad{id(ls)}{i}' for i, l in enumerate(ls)]
        sm = difflib.SequenceMatcher(None, keyed(merged), keyed(lines), autojunk=False)
        out = []
        for op, i1, i2, j1, j2 in sm.get_opcodes():
            mine, theirs = merged[i1:i2], lines[j1:j2]
            if op == 'equal': out += mine
            elif all(l is BAD for l in mine) and theirs and all(l is not BAD for l in theirs): out += theirs
            elif op != 'insert': out += mine
        merged = out
    bad = sum(l is BAD for l in merged)
    print(f'attempt {attempt}: {sum(l is BAD for l in lines)} damaged, {bad} still damaged after merge')
    if not bad:
        pixels, p = decode(merged)
        if pixels == width * height: break
        print(f'decoded {pixels} pixels, expected {width * height}; starting over'); merged = None
else:
    # The screen kept changing (an animation), so captures cannot be mixed:
    # past the first changed pixel their bytes fall on different run
    # boundaries. Take the least damaged single capture; each line's byte
    # offset is still known, so drop exactly the runs that touch a damaged
    # line and hand the missing pixels back there (magenta) to keep later
    # rows aligned.
    if not best: sys.exit('no capture arrived')
    merged = best
    print(f'screen is changing; {sum(l is BAD for l in merged)} lines patched in magenta')
    line_bytes = max(len(base64.b64decode(l)) for l in merged if l is not BAD)
    p = b''; holes = []
    for l in merged:
        if l is BAD: holes.append((len(p), len(p) + line_bytes)); p += bytes(line_bytes)
        else: p += base64.b64decode(l)
    runs = []; gaps = 0
    for k in range(0, len(p) - 3, 4):
        if any(s0 < k + 4 and k < s1 for s0, s1 in holes):
            if not runs or runs[-1] is not None: runs.append(None); gaps += 1
            continue
        runs.append((p[k] | p[k+1] << 8, p[k+2] | p[k+3] << 8))
    missing = width * height - sum(n for r in runs if r for n in [r[0]])
    share = max(0, missing) // max(1, gaps)
    p = b''.join(struct.pack('<HH', *r) if r else struct.pack('<HH', share, 0xF81F) for r in runs)
px = bytearray()
for k in range(0, len(p) - 3, 4):
    n = p[k] | p[k+1] << 8; v = p[k+2] | p[k+3] << 8
    r = (v >> 11) & 31; g = (v >> 5) & 63; b = v & 31
    px += bytes(((r << 3) | (r >> 2), (g << 2) | (g >> 4), (b << 3) | (b >> 2))) * n
px = (px + bytes(width * height * 3))[:width * height * 3] if len(px) != width * height * 3 and bad else px
if len(px) != width * height * 3: sys.exit(f'decoded {len(px) // 3} pixels, expected {width * height}')
raw = b''.join(b'\0' + bytes(px[y*width*3:(y+1)*width*3]) for y in range(height))
def ch(k, d): return struct.pack('>I', len(d)) + k + d + struct.pack('>I', zlib.crc32(k + d))
open(f'app-{sys.argv[1]}.png', 'wb').write(b'\x89PNG\r\n\x1a\n' + ch(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)) + ch(b'IDAT', zlib.compress(raw)) + ch(b'IEND', b''))
print('ok', sys.argv[1])
