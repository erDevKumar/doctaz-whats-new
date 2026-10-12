#!/usr/bin/env python3
"""Render site/index.html from FEATURES. Images live in site/img/<folder>/<name>.jpg."""
import html, os

TITLE = "What's new in Doctaz"
SUB = "Android 2.5.3 → 2.5.5 · iPhone 2.5.3 → 2.5.5"
INTRO = ("Everything below is new since the versions you last received. Each feature shows the Android app "
         "and the iPhone app side by side, captured from demo accounts talking to each other "
         "(patients, nurses and doctors).")

# (title, what it means for users, [(sub-title, sentence, [android imgs], [ios imgs])], [improvements])
FEATURES = [
 ("Messages, rebuilt around your conversations",
  "MedTalk now opens straight onto your conversations instead of a set of tabs. Everything is one tap away: "
  "search at the top, filters underneath, and your chats below.",
  [("Your chats, with filters", "Open MedTalk and your conversations are already there. Filter to Unread, Providers or Patients, and each row shows the person's role and what the last message was — a photo, a document or a link.",
    ["medtalk/android-1-chats-home"], ["medtalk/ios-1-chats-home"]),
   ("Search people and chats together", "Type a name and results split into your existing chats and everyone else, with the matched part of the name highlighted. Filter by Doctors, Nurses or Patients.",
    ["search/android-2-search-results"], ["search/ios-2-search-results"]),
   ("Doctaz Support, always one tap away", "The headphones button at the top right of MedTalk opens a conversation with Doctaz Support from anywhere in your chats.",
    ["support/android-1-support-button"], ["support/ios-1-support-button"]),
   ("A clearer conversation", "Each chat now shows who you are talking to — their photo, name and role — at the top. The message bar has a camera button for sending a photo straight away.",
    ["thread/android-1-chat-header-composer"], ["thread/ios-1-chat-header-composer"]),
  ],
  ["The video-call button in a chat was white on a white background on Android, so it looked missing even though it worked. It is now clearly visible.",
   "Doctors and nurses can now find and message each other, not only patients.",
   "On iPhone, losing signal shows a notice that messages will send once you reconnect."]),

 ("See who you are talking to in a discussion",
  "Community discussions used to show only a role, like “Doctor” or “Member”. Every discussion now leads with "
  "the person — their photo, their name and their role — and you can tap through to their profile.",
  [("Who started each discussion", "The list shows the author's photo and name on every card, with the number of replies and views, and a button to start your own that stays put as you scroll.",
    ["discussions/android-1-discussions-list"], ["discussions/ios-1-discussions-list"]),
   ("Author shown on the discussion itself", "Opening a discussion shows who wrote it at the top, above the title.",
    ["discussions/android-2-discussion-detail"], []),
   ("Discussions with a chosen group", "You can start a discussion that only chosen people may reply to. The card shows it is members-only and how many have joined.",
    ["discussions/android-3-discussion-card-members"], ["discussions/ios-3-discussion-card-members"]),
   ("See everyone in the discussion", "Tap the members row to see everyone, each with their photo and role. As the person who started it, you also see who has accepted, who is still invited and who declined.",
    ["members/android-1-members-strip", "members/android-2-members-sheet"], ["members/ios-2-members-sheet"]),
  ],
  ["Invitations now say who invited you, with their photo and name, instead of only naming the discussion.",
   "Reply and view counts on a discussion card update as soon as you come back from reading it, instead of looking stale.",
   "Wording like “1 views” and “1 discussions” now reads correctly.",
   "On Android, the bottom bar no longer sits on top of the keyboard and hides what you are typing."]),

 ("“Solo” is now called “Virtual Care”",
  "The space you work in on your own — outside any hospital — is now called Virtual Care, which says what it is. "
  "Hospital environments are unchanged.",
  [("Pick where you are working", "After signing in, choose Virtual Care or a hospital you belong to. The new name appears here, in the app's title bar and anywhere access is requested.",
    ["virtualcare/android-1-environment-picker"], ["virtualcare/ios-1-environment-picker"]),
  ],
  ["Translated along with everything else, so it reads correctly in French, Spanish and Arabic."]),

 ("A tidier home screen",
  "The shortcuts at the top of the home screen — MedCue, MedTalk, MedMall and notifications — are now in the "
  "Doctaz brand colour and grouped neatly to the right, instead of grey and loosely spaced.",
  [("Shortcuts in the brand colour", "The same change on both phones, so the two apps look like one product.",
    ["homeheader/android-1-home-teal-icons"], ["homeheader/ios-1-home-teal-icons"]),
  ],
  []),

 ("Sharing into Doctaz from another app",
  "Sending a photo, document or link from another app into a Doctaz chat has been rebuilt on both phones: "
  "search and pick several people, see exactly what you are sending, and add a caption before it goes.",
  [],
  ["The people list no longer stops loading more results when you filter by role.",
   "On Android, sharing while signed out now keeps what you were sending and carries on after you sign in.",
   "Files that cannot be sent now say so clearly, instead of failing quietly.",
   "On iPhone, if your session has expired the share sheet now tells you to sign in rather than showing an error."]),

 ("Fully translated into French, Spanish and Arabic",
  "Large parts of the apps were still appearing in English for anyone using them in another language. "
  "Registration, your profile, the wallet, messages and the community are now fully translated on both phones.",
  [],
  ["Around 180 pieces of text on Android and over 1,100 on iPhone were translated.",
   "The search box text was shortened so it is no longer cut off."]),

 ("Stability",
  "Two crashes that interrupted everyday use are fixed.",
  [],
  ["Closing the “Coming Soon” notice no longer closes the app with it.",
   "The low-balance warning during a video call no longer closes the app.",
   "On Android, cropped videos in the community feed no longer spill over the post title and the buttons underneath.",
   "On iPhone, the menu button on your profile no longer looks like a back arrow."]),
]

COMING = []



def gallery(names, platform):
    if not names:
        return f'<p class="none">Same as {"iPhone" if platform == "Android" else "Android"}; see the other column.</p>'
    return "".join(
        f'<button class="shot" type="button" aria-label="{platform}: enlarge screenshot">'
        f'<img loading="lazy" src="img/{n}.jpg" alt="{platform} screenshot"></button>' for n in names)


def feature(i, f):
    title, desc, subs, imps = f
    fid = f"f{i}"
    out = [f'<section class="feature" id="{fid}"><h2><span class="num">{i:02d}</span>{html.escape(title)}</h2>',
           f'<p class="lede">{html.escape(desc)}</p>']
    for st, sd, a, ios in subs:
        out.append(f'<article class="sub"><h3>{html.escape(st)}</h3><p>{html.escape(sd)}</p><div class="cols">'
                   f'<div class="col"><h4><span class="dot android"></span>Android</h4><div class="strip">{gallery(a, "Android")}</div></div>'
                   f'<div class="col"><h4><span class="dot ios"></span>iPhone</h4><div class="strip">{gallery(ios, "iPhone")}</div></div>'
                   f'</div></article>')
    if imps:
        out.append('<div class="imps"><h3>Also improved</h3><ul>' + "".join(f"<li>{html.escape(x)}</li>" for x in imps) + "</ul></div>")
    out.append("</section>")
    return "".join(out)


def page():
    toc = "".join(f'<li><a href="#f{i}">{html.escape(f[0])}</a></li>' for i, f in enumerate(FEATURES, 1))
    body = "".join(feature(i, f) for i, f in enumerate(FEATURES, 1))
    coming = ('<section class="feature coming"><h2>Coming with the next server update</h2><ul>'
              + "".join(f"<li>{html.escape(x)}</li>" for x in COMING) + "</ul></section>") if COMING else ""
    return f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>{TITLE}</title>
<meta name="description" content="{html.escape(INTRO)}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>
:root{{--bg:#f6f8f8;--card:#fff;--ink:#14231f;--muted:#5b6b67;--line:#dde5e3;--brand:#0b7a6f;--brand-soft:#e3f3f1;--android:#3ddc84;--ios:#0a84ff}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--bg:#0f1514;--card:#17201e;--ink:#e6efed;--muted:#9fb1ad;--line:#26332f;--brand:#3cc2b3;--brand-soft:#16302c}}}}
:root[data-theme="dark"]{{--bg:#0f1514;--card:#17201e;--ink:#e6efed;--muted:#9fb1ad;--line:#26332f;--brand:#3cc2b3;--brand-soft:#16302c}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--bg);color:var(--ink);font:16px/1.55 Inter,system-ui,sans-serif}}
.wrap{{max-width:1120px;margin:0 auto;padding:0 16px}}
header{{background:linear-gradient(135deg,#0b7a6f,#0a5f86);color:#fff;padding:56px 0 40px}}
header h1{{margin:0 0 6px;font-size:clamp(28px,5vw,44px)}}header .v{{opacity:.85;font-weight:600}}header p{{max-width:720px;opacity:.95}}
nav.toc{{background:var(--card);border-bottom:1px solid var(--line);position:sticky;top:0;z-index:5}}
nav.toc ul{{display:flex;gap:6px;overflow-x:auto;list-style:none;margin:0;padding:10px 0;scrollbar-width:none}}
nav.toc a{{white-space:nowrap;display:block;padding:6px 12px;border-radius:999px;background:var(--brand-soft);color:var(--brand);text-decoration:none;font-weight:600;font-size:14px}}
.feature{{background:var(--card);border:1px solid var(--line);border-radius:16px;margin:28px 0;padding:24px}}
.feature h2{{margin:0 0 6px;font-size:26px;display:flex;align-items:center;gap:12px}}
.num{{font-size:13px;color:var(--brand);background:var(--brand-soft);border-radius:8px;padding:2px 8px}}
.lede{{color:var(--muted);margin:0 0 8px;max-width:760px}}
.sub{{border-top:1px solid var(--line);padding-top:18px;margin-top:18px}}.sub h3{{margin:0 0 4px;font-size:19px}}.sub>p{{margin:0 0 12px;color:var(--muted)}}
.cols{{display:grid;grid-template-columns:1fr 1fr;gap:16px}}@media (max-width:700px){{.cols{{grid-template-columns:1fr}}}}
.col{{min-width:0}}.col h4{{margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);display:flex;align-items:center;gap:6px}}
.dot{{width:9px;height:9px;border-radius:50%}}.dot.android{{background:var(--android)}}.dot.ios{{background:var(--ios)}}
.strip{{display:flex;gap:10px;overflow-x:auto;padding-bottom:6px}}
.shot{{flex:0 0 auto;border:1px solid var(--line);border-radius:14px;padding:0;background:#000;cursor:zoom-in;overflow:hidden}}
.shot img{{display:block;height:360px;width:auto}}@media (max-width:700px){{.shot img{{height:300px}}}}
.none{{color:var(--muted);font-style:italic;margin:6px 0}}
.imps{{margin-top:18px;background:var(--brand-soft);border-radius:12px;padding:12px 16px}}.imps h3{{margin:0 0 4px;font-size:15px;color:var(--brand)}}.imps ul{{margin:0;padding-left:20px}}
.coming{{border-style:dashed}}footer{{color:var(--muted);font-size:14px;padding:24px 0 48px}}
dialog{{border:0;padding:0;background:transparent;max-width:96vw;max-height:94vh}}dialog::backdrop{{background:rgba(0,0,0,.8)}}
dialog img{{max-height:92vh;max-width:94vw;border-radius:14px;display:block}}
</style></head><body>
<header><div class="wrap"><h1>{TITLE}</h1><div class="v">{SUB}</div><p>{html.escape(INTRO)}</p></div></header>
<nav class="toc" aria-label="Features"><div class="wrap"><ul>{toc}</ul></div></nav>
<main class="wrap">{body}
{coming}</main>
<footer class="wrap">Screens captured on a Nothing Phone (Android) and an iPhone 17 simulator, both running version 2.5.5,
using demo accounts talking to each other. Everything shown is demo content.</footer>
<dialog id="lb"><img alt=""></dialog>
<script>
const lb=document.getElementById('lb'),im=lb.querySelector('img');
document.querySelectorAll('.shot').forEach(b=>b.addEventListener('click',()=>{{im.src=b.querySelector('img').src;im.alt=b.querySelector('img').alt;lb.showModal();}}));
lb.addEventListener('click',()=>lb.close());
</script></body></html>"""


if __name__ == "__main__":
    missing = [n for f in FEATURES for s in f[2] for n in s[2] + s[3] if not os.path.exists(f"site/img/{n}.jpg")]
    assert not missing, f"missing images: {missing}"
    open("site/index.html", "w").write(page())
    print("site/index.html written")
