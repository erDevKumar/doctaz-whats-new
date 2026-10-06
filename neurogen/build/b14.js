const b = board('14 What NeuroGen gains', 1760, 4240, C.surface);
chrome(b, 'The case', '14');
txt(b, 'What NeuroGen gets out of it.', 90, 130, 1340, 46, C.ink, 700, 5);
const g = [['A front door that works from abroad','Prospective international patients can find NeuroGen’s clinicians, see availability and book a pre-travel consult without a single phone call.'],
           ['Follow-up that survives the flight home','The next appointment is booked before the patient leaves, and it is still there - with the right local time - when they land.'],
           ['Coordination lifted off reception','Requests, confirmations and reminders live in one place that both sides can see, instead of a phone queue and an inbox.'],
           ['One continuous record of the relationship','Each consult continues the last one rather than restarting it, because the history travels with the patient.']];
g.forEach(function (it, i) {
  const x = 90 + (i % 2) * 720, y = 260 + Math.floor(i / 2) * 300;
  rect(b, x, y, 690, 260, C.surfaceAlt, 18, 1);
  rect(b, x, y, 690, 8, C.brand, 0, 2);
  txt(b, it[0], x + 36, y + 46, 610, 27, C.ink, 700, 5);
  txt(b, it[1], x + 36, y + 110, 610, 20, C.muted, 400, 5);
});
applyZ();
return { ok: true, kids: b.children.length };
