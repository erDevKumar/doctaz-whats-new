#!/usr/bin/env python3
"""Post a board script to the Penpot MCP REPL with the shared prelude prepended."""
import json, subprocess, sys, os
BASE = os.path.dirname(os.path.abspath(__file__))
PRELUDE = open(os.path.join(BASE, 'prelude.js')).read()
MEDIA = json.load(open('/tmp/ng_media.json'))

def run(js, media_keys=(), timeout=120):
    head = ''
    if media_keys:
        m = {k: MEDIA[k] for k in media_keys}
        head = 'const M = %s;\n' % json.dumps(m)
    code = PRELUDE + '\n' + head + js
    payload = json.dumps({'code': code})
    r = subprocess.run(['curl','-s','-m',str(timeout),'-X','POST',
                        'http://127.0.0.1:4403/execute',
                        '-H','Content-Type: application/json','--data-binary','@-'],
                       input=payload, capture_output=True, text=True)
    try:
        return json.loads(r.stdout)
    except Exception:
        return {'success': False, 'raw': r.stdout[:400]}

if __name__ == '__main__':
    f = sys.argv[1]
    keys = sys.argv[2].split(',') if len(sys.argv) > 2 and sys.argv[2] else []
    print(json.dumps(run(open(f).read(), keys))[:700])
