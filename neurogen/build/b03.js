const b = board('03 What it costs', 3520, 0, C.surface);
chrome(b, 'What it costs NeuroGen', '03');
txt(b, 'The cost is not the video call.', 90, 130, 1300, 54, C.ink, 700, 5);
txt(b, 'It is everything around it.', 90, 192, 1300, 54, C.brand, 700, 5);

const items = [
  ['Coordination load', 'Every follow-up is arranged by hand - phone, email, reception - for a patient in another country and another time zone.'],
  ['Silent drop-off', 'A discharge date written on paper depends on the patient restarting contact. The ones who do not are invisible.'],
  ['No continuity of record', 'The relationship lives in scattered threads, so each contact begins by re-establishing context.']
];
items.forEach(function (it, i) {
  const y = 330 + i * 165;
  rect(b, 90, y, 1420, 145, C.surfaceAlt, 18, 1);
  rect(b, 90, y, 8, 145, C.brand, 0, 2);
  txt(b, it[0], 130, y + 28, 420, 30, C.ink, 700, 5);
  txt(b, it[1], 570, y + 30, 900, 22, C.muted, 400, 5);
});
applyZ();
return { ok: true, kids: b.children.length };
