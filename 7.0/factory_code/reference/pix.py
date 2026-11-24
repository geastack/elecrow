# Reads PNG pixels for comparing the Gea captures with LVGL's reference.
import struct, zlib
def load(p):
    d = open(p, 'rb').read(); i = 8; idat = b''
    while i < len(d):
        n = struct.unpack('>I', d[i:i+4])[0]; k = d[i+4:i+8]; c = d[i+8:i+8+n]
        if k == b'IHDR': w, h, bd, ct = struct.unpack('>IIBB', c[:10])
        if k == b'IDAT': idat += c
        i += 12 + n
    raw = zlib.decompress(idat); bpp = 3 if ct == 2 else 4; st = w * bpp
    rows = []; prev = bytearray(st)
    for y in range(h):
        f = raw[y*(st+1)]; line = bytearray(raw[y*(st+1)+1:(y+1)*(st+1)])
        for x in range(st):
            a = line[x-bpp] if x >= bpp else 0; b = prev[x]; c = prev[x-bpp] if x >= bpp else 0
            if f == 1: line[x] = (line[x] + a) & 255
            elif f == 2: line[x] = (line[x] + b) & 255
            elif f == 3: line[x] = (line[x] + (a + b) // 2) & 255
            elif f == 4:
                p = a + b - c; pa, pb, pc = abs(p-a), abs(p-b), abs(p-c)
                line[x] = (line[x] + (a if pa <= pb and pa <= pc else b if pb <= pc else c)) & 255
        rows.append(line); prev = line
    return lambda x, y: tuple(rows[y][x*bpp:x*bpp+3])
def darkest(px, x0, y0, x1, y1):
    return min((px(x, y) for y in range(y0, y1) for x in range(x0, x1)), key=sum)
