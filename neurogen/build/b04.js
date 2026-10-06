const b = board('04 The principle', 0, 1060, C.brandDarker);
rect(b, 0, 0, W, H, C.brandDarker, 0, 0);
rect(b, 0, 0, W, 10, C.brand, 0, 1);
txt(b, 'THE PRINCIPLE', 90, 90, 900, 22, C.brandSoft, 700, 5);
txt(b, 'Doctaz does not replace', 90, 250, 1420, 72, C.white, 700, 5);
txt(b, 'NeuroGen’s clinical care.', 90, 334, 1420, 72, C.white, 700, 5);
txt(b, 'It gives the relationship around that care a single place to live - so the patient can always find their way back to NeuroGen.',
    90, 470, 1200, 32, C.brandSoft, 400, 5);
rect(b, 90, 620, 240, 4, C.brand, 0, 4);
txt(b, 'Specialist treatment, travel and admission stay exactly as NeuroGen runs them today.',
    90, 670, 1200, 24, '#9FC9C4', 400, 5);
applyZ();
return { ok: true, kids: b.children.length };
