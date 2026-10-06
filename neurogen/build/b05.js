const b = board('05 One pathway', 1760, 1060, C.surface);
chrome(b, 'The solution', '05');
txt(b, 'One repeatable pathway', 90, 130, 1300, 54, C.ink, 700, 5);
txt(b, 'the patient returns to at every stage.', 90, 192, 1300, 54, C.muted, 400, 5);

const steps = [['Discover','Find NeuroGen and the right provider'],
               ['Schedule','Book a virtual consult in their own time zone'],
               ['MedTalk','Meet by secure video, both sides in one place'],
               ['Follow up','Book the next one before leaving the call']];
steps.forEach(function (s, i) {
  const x = 90 + i * 360;
  rect(b, x, 340, 310, 260, C.surfaceAlt, 20, 1);
  rect(b, x + 30, 372, 56, 56, C.brand, 28, 2);
  txt(b, String(i + 1), x + 50, 384, 40, 28, C.white, 700, 5);
  txt(b, s[0], x + 30, 452, 250, 30, C.ink, 700, 5);
  txt(b, s[1], x + 30, 496, 250, 19, C.muted, 400, 5);
  if (i < 3) txt(b, '→', x + 322, 450, 40, 32, C.brand, 700, 5);
});
rect(b, 90, 660, 1420, 110, C.brandSoft, 16, 1);
txt(b, 'And then it repeats. The fourth step is the first step again - that is what makes it a pathway rather than a one-off call.',
    130, 698, 1340, 26, C.brandDarker, 500, 5);
applyZ();
return { ok: true, kids: b.children.length };
