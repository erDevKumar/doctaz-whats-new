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
# Link previews (WhatsApp, Slack, iMessage) read the STATIC head, never the React runtime,
# so every share-card tag has to be rewritten here. The inherited head pointed og:image at
# the investor deck's /pitch/og.jpg, which is what WhatsApp was showing.
p = 'pitch-neurogen/index.html'
s = open(p, encoding='utf-8').read()
BASE  = 'https://erdevkumar.github.io/doctaz-whats-new/pitch-neurogen/'
TITLE = 'NeuroGen × Doctaz — Partnership Proposal'
DESC  = ('One digital pathway for every international patient — before travel, '
         'before going home, and after they are back in their own country.')
IMG   = BASE + 'og.jpg'

def put(src, attr, key, value):
    """Replace the tag's content if present, otherwise add it before </head>."""
    pat = rf'((?:{attr})="{re.escape(key)}"[^>]*content=")[^"]*(")'
    if re.search(pat, src):
        return re.sub(pat, lambda m: m.group(1) + value + m.group(2), src)
    tag = f'    <meta {attr}="{key}" content="{value}" />\n'
    return src.replace('</head>', tag + '  </head>')

s = re.sub(r'<title>[^<]*</title>', f'<title>{TITLE}</title>', s)
s = put(s, 'name',     'description',         DESC)
s = put(s, 'property', 'og:title',            TITLE)
s = put(s, 'property', 'og:description',      DESC)
s = put(s, 'property', 'og:image',            IMG)
s = put(s, 'property', 'og:image:width',      '1200')
s = put(s, 'property', 'og:image:height',     '630')
s = put(s, 'property', 'og:image:alt',        'NeuroGen × Doctaz partnership proposal')
s = put(s, 'property', 'og:url',              BASE)
s = put(s, 'property', 'og:site_name',        'Doctaz')
s = put(s, 'name',     'twitter:card',        'summary_large_image')
s = put(s, 'name',     'twitter:title',       TITLE)
s = put(s, 'name',     'twitter:description', DESC)
s = put(s, 'name',     'twitter:image',       IMG)
open(p, 'w', encoding='utf-8').write(s)
print('  title   :', re.search(r'<title>([^<]*)</title>', s).group(1))
print('  og:image:', re.search(r'og:image"[^>]*content="([^"]*)"', s).group(1))
PY

echo "done. deck: pitch-neurogen/  edit: pitch-neurogen/?edit"
