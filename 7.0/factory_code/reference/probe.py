# GEADEV probe: retries until a clean NODE line for the visible tab page arrives.
import serial, time, re, sys
s=serial.serial_for_url('rfc2217://localhost:2217',do_not_open=True,baudrate=115200,timeout=0.2); s.dtr=False; s.rts=False; s.open()
def read(sec):
    t=time.time(); out=b''
    while time.time()-t<sec: out+=s.read(8192)
    return out.decode('utf8','replace')
def cmd(c,wait=2.5):
    s.reset_input_buffer(); s.write(('GEADEV '+c+'\n').encode()); return read(wait)
def page():
    for _ in range(20):
        for l in cmd("NODE tab-page",1.2).splitlines():
            m=re.search(r'class=tab-page id=\d+ parent=\d+ type=0 display=3 .*layout=(0,70,800,\d+) .*scroll=(\d+,\d+,\d+,\d+) font',l)
            if m: return m.groups()
    return None
