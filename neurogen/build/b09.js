const b = board('09 Live call', 3520, 2120, C.navy);
rect(b, 0, 0, W, H, C.navy, 0, 0);
rect(b, 0, 0, W, 10, C.brand, 0, 1);
txt(b, 'NOT A MOCK-UP', 90, 90, 700, 22, C.brandSoft, 700, 5);
txt(b, 'Two real phones.', 90, 180, 760, 60, C.white, 700, 5);
txt(b, 'One live consult.', 90, 248, 760, 60, C.brand, 700, 5);
const pts = ['Provider dials, inside the facility - the patient is never asked to pay to be seen',
             'Rings like a normal phone call, answered in seconds',
             'HD video and audio on Doctaz’s own stack',
             'A specialist can be added to the call mid-consult'];
pts.forEach(function (p, i) {
  const y = 360 + i * 74;
  rect(b, 90, y, 34, 34, C.brand, 17, 2);
  txt(b, '✓', 100, y + 5, 24, 20, C.white, 700, 6);
  txt(b, p, 142, y + 4, 640, 21, '#C9D2DD', 400, 5);
});
txt(b, 'Captured live between two Android phones on 6 Oct 2026. Camera view is represented; the call, signalling and controls are real.',
    90, 720, 760, 17, '#6B7B8C', 400, 5);
imgRect(b, 900, 150, 300, 600, M['d-08-incall'], 24, 6);
txt(b, 'PROVIDER', 900, 766, 300, 16, C.brandSoft, 700, 7, 'center');
imgRect(b, 1240, 150, 300, 600, M['p-13-incall'], 24, 6);
txt(b, 'PATIENT', 1240, 766, 300, 16, C.brandSoft, 700, 7, 'center');
rect(b, 1150, 420, 140, 54, C.brand, 27, 8);
txt(b, 'LIVE', 1150, 434, 140, 24, C.white, 700, 9, 'center');
applyZ();
return { ok: true, kids: b.children.length };
