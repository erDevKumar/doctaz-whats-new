const b = board('17 The ask', 1760, 5300, C.brandDarker);
rect(b, 0, 0, W, H, C.brandDarker, 0, 0);
rect(b, 0, 0, W, 10, C.brand, 0, 1);
txt(b, 'THE ASK', 90, 90, 700, 22, C.brandSoft, 700, 5);
txt(b, 'Let us run this with', 90, 210, 1300, 64, C.white, 700, 5);
txt(b, 'real NeuroGen patients.', 90, 284, 1300, 64, C.brand, 700, 5);
const asks = [['A pilot cohort','A small group of international patients already in follow-up with NeuroGen.'],
              ['Two or three clinicians','The ones who carry the most international follow-up today.'],
              ['Eight weeks','Long enough for each patient to complete a full follow-up cycle.']];
asks.forEach(function (s, i) {
  const x = 90 + i * 475;
  rect(b, x, 420, 440, 210, '#0D3B38', 16, 1);
  rect(b, x, 420, 440, 6, C.brand, 0, 2);
  txt(b, s[0], x + 32, 456, 380, 26, C.white, 700, 5);
  txt(b, s[1], x + 32, 500, 380, 18, C.brandSoft, 400, 5);
});
txt(b, 'We set up the NeuroGen environment, onboard the clinicians and cover the pilot. NeuroGen changes nothing about how it treats patients.',
    90, 690, 1300, 23, C.brandSoft, 400, 5);
rect(b, 90, 760, 300, 4, C.brand, 0, 4);
txt(b, 'Doctaz · doctaz.com', 90, 790, 700, 20, '#7FB3AE', 400, 5);
applyZ();
return { ok: true, kids: b.children.length };
