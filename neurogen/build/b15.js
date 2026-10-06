const b = board('15 Concept - NeuroGen in the app', 3520, 4240, C.surface);
chrome(b, 'Concept', '15');
txt(b, 'How NeuroGen would appear in the app.', 90, 130, 1340, 46, C.ink, 700, 5);
txt(b, 'Proposed, not yet built. Everything else in this deck is live today - these two screens are the next step we would build for NeuroGen.', 90, 188, 1340, 23, C.rose, 500, 5);

// concept 1 - facility environment card
rect(b, 90, 260, 440, 560, C.surfaceAlt, 18, 1);
txt(b, 'Hospital environment', 130, 300, 360, 22, C.muted, 700, 5);
rect(b, 130, 340, 360, 180, C.brandDarker, 14, 2);
txt(b, 'NeuroGen', 160, 386, 300, 34, C.white, 700, 6);
txt(b, 'Neurology · India', 160, 428, 300, 18, C.brandSoft, 400, 6);
rect(b, 130, 548, 360, 56, C.brand, 28, 2);
txt(b, 'Enter NeuroGen', 130, 565, 360, 20, C.white, 700, 6, 'center');
txt(b, 'The patient picks NeuroGen the way they pick a hospital today - the whole app is then scoped to NeuroGen’s clinicians.',
    130, 630, 360, 17, C.muted, 400, 5);

// concept 2 - richer provider profile
rect(b, 570, 260, 440, 560, C.surfaceAlt, 18, 1);
txt(b, 'Provider profile', 610, 300, 360, 22, C.muted, 700, 5);
rect(b, 610, 340, 360, 420, C.surface, 14, 2);
rect(b, 634, 364, 80, 80, C.brandSoft, 40, 3);
txt(b, 'Dr A. Rao', 730, 372, 220, 24, C.ink, 700, 4);
txt(b, 'Consultant Neurologist', 730, 402, 220, 16, C.brand, 500, 4);
txt(b, 'NeuroGen · Bengaluru', 730, 424, 220, 15, C.muted, 400, 4);
['DM Neurology, 18 years', 'Epilepsy, movement disorders', 'English, Hindi, Kannada', 'Next available: Thu 10:00'].forEach(function (s, i) {
  txt(b, '•  ' + s, 634, 470 + i * 34, 310, 15, C.inkSoft, 400, 4);
});
rect(b, 634, 620, 310, 50, C.brand, 25, 3);
txt(b, 'Book Appointment', 634, 635, 310, 18, C.white, 700, 4, 'center');
txt(b, 'Today the profile shows a name and reviews. A hospital’s patient needs the specialty, credentials, languages and a way to book.',
    610, 778, 360, 17, C.muted, 400, 5);

// what exists today
rect(b, 1050, 260, 460, 560, C.surfaceAlt, 18, 1);
txt(b, 'What exists today', 1090, 300, 380, 22, C.muted, 700, 5);
imgRect(b, 1090, 340, 250, 420, M['p-04-provider-profile'], 10, 3);
txt(b, 'The real profile screen, captured live.', 1090, 778, 380, 17, C.muted, 400, 5);
applyZ();
return { ok: true, kids: b.children.length };
