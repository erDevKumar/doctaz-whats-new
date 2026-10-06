const b = board('01 Title', 0, 0, C.navy);
// brand wash
rect(b, 0, 0, W, H, C.navy, 0, 0);
rect(b, 0, 0, 14, H, C.brand, 0, 1);
rect(b, 980, 0, 620, H, C.brandDarker, 0, 1);
rect(b, 980, 0, 620, H, C.brandDark, 0, 2);

txt(b, 'PARTNERSHIP PROPOSAL', 110, 150, 700, 22, C.brandSoft, 700, 5);
txt(b, 'NeuroGen', 110, 220, 820, 104, C.white, 700, 5);
txt(b, 'x Doctaz', 110, 340, 820, 104, C.brand, 700, 5);
txt(b, 'One digital pathway for every international patient - before travel, before going home, and long after they are back in their own country.',
    110, 500, 760, 30, '#C9D2DD', 400, 5);
rect(b, 110, 650, 300, 4, C.brand, 0, 4);
txt(b, 'Prepared for NeuroGen leadership', 110, 690, 700, 22, '#8C99A8', 400, 5);
txt(b, 'Demo environment - all patient identities are fictional', 110, 726, 700, 20, '#6B7B8C', 400, 5);

// phone on the right
imgRect(b, 1120, 170, 300, 560, M['p-09-booking-confirmed'], 26, 6);
applyZ();
return { ok: true, name: b.name, kids: b.children.length };
