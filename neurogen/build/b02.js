const b = board('02 Status quo', 1760, 0, C.surface);
chrome(b, 'The problem', '02');
txt(b, 'Today an international patient', 90, 130, 1200, 54, C.ink, 700, 5);
txt(b, 'is handled across four disconnected channels.', 90, 192, 1300, 54, C.ink, 700, 5);

const ch = [
  ['Phone', 'Calls across time zones, no record of what was agreed.'],
  ['Email', 'Reports and scans arrive in a thread nobody owns.'],
  ['Reception', 'Follow-up is confirmed verbally, then chased.'],
  ['Video', 'A one-off link, on whatever tool is to hand.']
];
ch.forEach(function (c, i) {
  const x = 90 + i * 360, y = 330;
  rect(b, x, y, 320, 300, C.surfaceAlt, 20, 1);
  rect(b, x, y, 320, 8, C.rose, 0, 2);
  txt(b, c[0], x + 30, y + 46, 260, 32, C.ink, 700, 5);
  txt(b, c[1], x + 30, y + 100, 260, 20, C.muted, 400, 5);
});
// the gap between them
rect(b, 90, 690, 1420, 120, '#FEF2F2', 16, 1);
txt(b, 'Nothing connects them. The patient restarts the process every time, and NeuroGen carries the coordination.',
    130, 730, 1340, 26, '#991B1B', 500, 5);
applyZ();
return { ok: true, kids: b.children.length };
