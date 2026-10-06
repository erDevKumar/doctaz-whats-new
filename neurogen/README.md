# NeuroGen × Doctaz — pitch deck

Written for: whoever presents this to NeuroGen, and whoever rebuilds or edits it afterwards.

A partnership pitch for **NeuroGen**, a neurology hospital in India that treats international
patients. It argues that Doctaz turns NeuroGen's scattered international-patient touchpoints —
phone, email, reception, ad-hoc video — into **one repeatable digital pathway** the patient
returns to before travel, before going home, and after they are back in their own country.

Source brief: `NeuroGen_Doctaz_Demo_Execution_Plan_Formatted.docx` (three scenarios, §7
acceptance criteria).

The deck's central claim is that this works **today**, so almost every screen in it was captured
from the real app running on two physical Android phones, not drawn. Where something is proposed
rather than shipped, the board says so in red.

---

## Where everything lives

| What | Where |
|---|---|
| Penpot deck (17 boards) | Penpot file **"NeuroGen x Doctaz - Pitch Deck"**, page `01 Pitch deck` |
| Journey flowcharts (3 swimlane boards) | same file, page `02 Journey flows` |
| Board exports (JPEG) | `neurogen/boards/01.jpg … 17.jpg`, `f01–f03.jpg` |
| Phone captures used in the boards | `img/neurogen/*.jpg` (440px wide, from 1080×2400 originals) |
| Generator scripts (rebuild the deck) | `neurogen/build/` |

The Penpot file is a **new, dedicated file**. No pre-existing Penpot file, page or board was
modified.

---

## The deck

Seventeen boards, 1600×900, laid out three to a row. It is a persuasion arc with the three
scenarios as the proof section in the middle.

| # | Board | Job |
|---|---|---|
| 01 | Title | Frames this as a partnership proposal, not a product demo |
| 02 | Status quo | Phone, email, reception, video as four disconnected channels |
| 03 | What it costs NeuroGen | Coordination load, silent drop-off, no continuity of record |
| 04 | The principle | Doctaz **complements**, never replaces, NeuroGen's clinical care |
| 05 | One repeatable pathway | Discover → Schedule → MedTalk → Follow up → repeat |
| 06–08 | Scenario 1 / 2 / 3 | Six real screenshots each, in journey order |
| 09 | Live call | Two phones side by side, provider and patient, mid-consult |
| 10 | The follow-up loop | Why it is a cycle rather than a one-off video call |
| 11 | Proof — booking | The same appointment on both phones. The strongest board in the deck |
| 12 | How NeuroGen comes aboard | Five onboarding steps, and who does each |
| 13 | Commercial model | Country rate vs facility-covered — the actual commercial ask |
| 14 | What NeuroGen gains | The four benefits, in NeuroGen's language |
| 15 | Concept — NeuroGen in the app | **Proposed**, clearly marked. Facility page + richer provider profile |
| 16 | Acceptance criteria | §7 of the brief, with what is verified / configuration / proposed |
| 17 | The ask | A pilot cohort, two or three clinicians, eight weeks |

Page `02 Journey flows` carries one swimlane flowchart per scenario — **Patient / Doctaz /
NeuroGen** lanes, so a hospital reader can see exactly how little lands on them. Green nodes are
automatic, amber is a human decision, grey means "nothing to do".

### Board 04 is the one not to skip

The brief is emphatic that Doctaz must not be presented as replacing NeuroGen's clinical care.
Board 04 says so in the largest type in the deck. Specialist treatment, travel and admission stay
exactly as NeuroGen runs them today — Doctaz only holds the relationship around that care.

---

## What is real, and what is not

Being precise about this matters, because the deck's whole argument is "this already works".

**Real — captured live on 6 Oct 2026**, two Android phones (patient: Motorola edge 50 fusion;
provider: Nothing A063), both signed into the Doctaz Demo Clinic facility, production build 2.5.1:

- Find Care listing 43 providers, specialty search, provider profile
- The full booking sheet: visit type, day strip, slots grouped by period
- Booking confirmation — reference **APT-89**, Thu 8 Oct, 10:00 AM
- The appointment on **both** phones: patient "Pending", provider "Requested", same time
- A real MedTalk video call: provider dials, rings in ~3s, both reach "Connected", all five
  call controls present, priced at **$0.000/min** inside the facility

**Represented, and labelled as such:**

- *Camera imagery in the call boards.* The call, signalling, controls and pricing are real. Both
  phones were lying flat on a desk, so both cameras genuinely saw darkness (the remote tile peaked
  at brightness 20/255). The media pipeline was working — frames were flowing — there was simply
  nothing lit to see. Board 09 says so in its footnote.
- *NeuroGen branding.* The demo runs in **Doctaz Demo Clinic**, a demo facility. NeuroGen appears
  as the hospital being onboarded, which is what it would be. No screenshot claims to show a live
  NeuroGen environment.
- *Jai Din is listed as a Cardiologist,* not a neurologist — he is the controlled demo provider
  who is a member of the facility, so he is the only account that could demonstrate both sides.
- *Board 15 is a concept.* The facility page and the richer provider profile do not exist yet.

**All patient identities are fictional**, as the brief requires.

---

## Two things found while building this

Driving the real app surfaced two issues worth carrying into the NeuroGen conversation.

### 1. Appointment times were shown in UTC — fixed

The shared mapper `AppointmentDto.toUi()` parsed the server's UTC timestamp with no explicit
timezone, so `SimpleDateFormat` read it as local time. A slot booked for `2026-10-08T04:30:00Z`
rendered as **10:00 AM** in the booking sheet but **4:30 AM** in the appointments list and detail —
5½ hours out, and across a larger offset it moves the appointment to the wrong *day*.

For a product sold on cross-border follow-up this was fatal, so it was fixed at the shared cause
(matching `SlotPickerViewModel.utcIn`), with two regression tests that fail without the fix.
Committed on `Doctaz_legacy` branch `neurogen-pitch` as **3128f7ac**. Every appointment screenshot
in this deck is post-fix.

### 2. Provider approval is payment-gated outside a facility — a commercial question, not a bug

Tapping **Approve** as the provider opens a Stripe **ADD_CREDIT ₹700** screen rather than
confirming the appointment. The cause is not a defect:

- India's country rate (admin → Countries & Rates, row #18) sets an **appointment fee of ₹700**
  for doctor, APRN and nurse, with a 40% take-home split.
- `POST /v1/appointments/{id}/approve` returns `402 payment_required` when a fee is owed, and
  approves free when the reason is `covered_by_facility` or `already_paid`.
- The booking contract (`POST v1/appointments`) sends only `provider_type`, `provider_id`,
  `slot_utc` and `appointment_type` — **there is no facility field**, so a booking made inside a
  facility cannot currently be marked facility-covered.

This is exactly what board 13 is about. For NeuroGen the answer is configuration — appointments
inside the NeuroGen facility are facility-covered, so a clinician confirms in one tap — but it
needs the booking contract to carry facility context. That is a backend change, not an app one.

The brief's acceptance criteria do **not** require an approved appointment, only that both views
show the same one, which they do.

---

## Known gaps, honestly

- **No facility search or facility profile screen exists on Android.** Scenario 3's "open the
  NeuroGen facility profile" step cannot be shown as written, so the deck narrates discovery
  through provider search instead, and board 15 proposes the facility page.
- **The provider profile is thin** — avatar, name, online state and reviews. No specialty, no
  bio, no booking CTA. Booking starts from the Find Care card.
- **MedTalk is drawer-only** (Book Visit took its bottom-nav slot), though it is also reachable
  from the home top bar.
- **Find Care search needs an explicit submit** — typing alone does not filter — and the result
  count reads "**1 providers**".
- **The Scheduler tab is still labelled "Appointments"** despite the 27 Sep rename. Visible in
  most screenshots. Left alone deliberately: it is cosmetic, and the agreement was hard blockers
  only.
- The Find Care **"Book Appointment"** CTA is already correct on this branch.

---

## Rebuilding the deck

The deck is generated, not hand-drawn, so it can be rebuilt from scratch.

```bash
# 1. start the Penpot MCP relay (hosted Penpot; no Docker involved)
"$GW/scripts/start-penpot-mcp.sh"

# 2. in the browser: open the Penpot file, Meta+Alt+p, open "Penpot MCP Plugin",
#    click "Connect to MCP server" inside the localhost:4400 iframe
curl -s -X POST http://127.0.0.1:4403/execute \
  -H 'Content-Type: application/json' -d '{"code":"return penpot.currentPage.name;"}'

# 3. upload the captures, then build each board
python3 neurogen/build/run.py neurogen/build/b01.js p-09-booking-confirmed
...
python3 neurogen/build/export.py "01 Title" out/01.png 0.6
```

`build/prelude.js` is the factory: `board()`, `rect()`, `imgRect()`, `txt()`, `applyZ()`, plus
`scenario()` and `flowBoard()`.

### Penpot traps this deck actually hit

Worth reading before touching it, because each cost real time:

1. **Paint order is inverted.** Every shape records an explicit `z`; `applyZ()` sorts ascending and
   `bringToFront()`s in order. Without it, labels render *underneath* their own backgrounds.
2. **Verify by PNG export only.** `children` order tells you nothing. Export the board and look at it.
3. **`penpot.openPage()` only takes effect on the *next* REPL call.** This silently put three
   flow boards on the wrong page, on top of the deck. Switch page in one call, build in the next,
   and never page-hop inside a loop.
4. **`penpot.currentPage.children` is undefined** — use `findShapes()`.
5. **The REPL body cap is ~100 KB**, so captures are 440px JPEGs (~68 KB of base64). Images are
   uploaded once via `uploadMediaData` and then referenced by id, which keeps board payloads small.
6. **`penpot.currentFile.name` is read-only** — rename the file through the UI.
7. A JS parse error returns an opaque HTTP 500, identical to a dropped socket. Syntax-check
   locally first: `{ echo 'async function _(){'; cat prelude.js board.js; echo '}'; } | node --check -`.
8. **A board is rebuilt, not repaired.** The z-map lives for exactly one call.

### Capture traps

- **A screenshot and a UI dump can disagree.** With the drawer open, taps landed on the overlay
  while the dump still read the screen underneath — producing a "appointments list" capture that
  was actually the drawer. Verify the *image*, not just the dump.
- `am start` on `LandingPageActivity` after a `force-stop` lands on the launcher; relaunch with
  the monkey launcher intent, and re-apply SystemUI demo mode afterwards.
- Always pin `ANDROID_SERIAL` / `adb -s`. Two phones are attached and other sessions share them.

---

## Status

- 17 deck boards + 3 flowcharts built and exported; no duplicates, no overlapping boards.
- All three scenarios run end to end; §7 criteria met except the two items board 16 marks as
  *configuration* and *proposed*.
- Outstanding: a provider-side approval that does not demand ₹700 (needs facility context in the
  booking contract), and presentable camera imagery if the call boards are to show faces.
