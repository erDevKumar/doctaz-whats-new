#!/bin/bash
# Rebuild the NeuroGen deck from the shared pitch engine.
#
# One Vite build serves both decks: `pitch-src` emits into `pitch/`, and this copies that
# output to `pitch-neurogen/` with its own content.json. The bundle reads the deck directory
# from location.pathname (see edit.tsx DECK_DIR), so each deck edits and saves itself.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "building the engine…"
( cd pitch-src && npm run build >/dev/null )

echo "copying the build to pitch-neurogen/…"
rm -rf pitch-neurogen
cp -R pitch pitch-neurogen
cp neurogen/content.json pitch-neurogen/content.json

echo "patching the static head (runtime title comes from content.json settings.title)…"
python3 - <<'PY'
import re
p = 'pitch-neurogen/index.html'
s = open(p, encoding='utf-8').read()
TITLE = 'NeuroGen × Doctaz — Partnership Proposal'
DESC  = ('One digital pathway for every international patient — before travel, '
         'before going home, and after they are back in their own country.')
s = re.sub(r'<title>[^<]*</title>', f'<title>{TITLE}</title>', s)
for prop in ('og:title', 'twitter:title'):
    s = re.sub(rf'((?:property|name)="{prop}"[^>]*content=")[^"]*(")', rf'\g<1>{TITLE}\g<2>', s)
for prop in ('description', 'og:description', 'twitter:description'):
    s = re.sub(rf'((?:property|name)="{prop}"[^>]*content=")[^"]*(")', rf'\g<1>{DESC}\g<2>', s)
open(p, 'w', encoding='utf-8').write(s)
print('  title:', re.search(r'<title>([^<]*)</title>', s).group(1))
PY

echo "done. deck: pitch-neurogen/  edit: pitch-neurogen/?edit"
