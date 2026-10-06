const b = board('10 The follow-up loop', 0, 3180, C.surface);
chrome(b, 'Continuity', '10');
txt(b, 'A cycle, not a single call.', 90, 130, 1300, 54, C.ink, 700, 5);
txt(b, 'Every consult ends by booking the next one, so the relationship never lapses back to phone and email.', 90, 192, 1340, 24, C.muted, 400, 5);
const ring = [['Consult happens','MedTalk, both sides present'],
              ['Next one booked','Before the call ends'],
              ['Patient is reminded','The appointment lives in the app'],
              ['They return','Same place, no new channel']];
ring.forEach(function (s, i) {
  const x = 90 + i * 360;
  rect(b, x, 320, 320, 220, C.surfaceAlt, 18, 1);
  rect(b, x, 320, 320, 6, C.brand, 0, 2);
  txt(b, s[0], x + 28, 362, 260, 26, C.ink, 700, 5);
  txt(b, s[1], x + 28, 404, 260, 18, C.muted, 400, 5);
  txt(b, i < 3 ? '→' : '↺', x + 324, 410, 36, 30, C.brand, 700, 5);
});
rect(b, 90, 600, 1420, 210, C.brandDarker, 18, 1);
txt(b, 'What this changes for NeuroGen', 130, 636, 900, 28, C.white, 700, 5);
txt(b, 'A discharge date on paper depends on the patient restarting contact from another country. An appointment inside Doctaz is visible to both sides, survives the flight home, and is re-booked from inside the consult itself.',
    130, 686, 1340, 23, C.brandSoft, 400, 5);
applyZ();
return { ok: true, kids: b.children.length };
