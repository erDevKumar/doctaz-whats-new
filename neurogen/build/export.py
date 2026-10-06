#!/usr/bin/env python3
"""Export one board by name to a local PNG (export() is cached per shape+scale)."""
import json, subprocess, sys, base64, os
def run(code, timeout=180):
    r = subprocess.run(['curl','-s','-m',str(timeout),'-X','POST','http://127.0.0.1:4403/execute',
                        '-H','Content-Type: application/json','--data-binary','@-'],
                       input=json.dumps({'code':code}), capture_output=True, text=True)
    try: return json.loads(r.stdout)
    except Exception: return {'success':False,'raw':r.stdout[:300]}
name = sys.argv[1]; out = sys.argv[2]
code = """
const b = penpot.currentPage.findShapes().find(s => s.name === %s);
if (!b) return {err:'not found', page: penpot.currentPage.name};
const data = await b.export({ type:'png', scale: %s });
let s=''; const CH=0x8000;
for (let i=0;i<data.length;i+=CH) s += String.fromCharCode.apply(null, data.subarray(i,i+CH));
return { b64: btoa(s), w: b.width, h: b.height };
""" % (json.dumps(name), sys.argv[3] if len(sys.argv)>3 else '1')
d = run(code)
if not d.get('success') or 'b64' not in (d.get('result') or {}):
    print('EXPORT FAIL', json.dumps(d)[:300]); sys.exit(1)
open(out,'wb').write(base64.b64decode(d['result']['b64']))
print('wrote', out, os.path.getsize(out), 'bytes', d['result']['w'], 'x', d['result']['h'])
