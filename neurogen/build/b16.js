const b = board('16 Acceptance criteria', 0, 5300, C.surface);
chrome(b, 'Verification', '16');
txt(b, 'Against the agreed demo criteria.', 90, 130, 1340, 46, C.ink, 700, 5);
txt(b, 'Every row below was executed on two Android phones on 6 Oct 2026, not described.', 90, 188, 1340, 23, C.muted, 400, 5);
const rows = [['All three scenarios run end to end, no dead screens','met'],
              ['Patient and provider views show the same appointment','met'],
              ['MedTalk launches in every scenario that needs it','met'],
              ['Scenario 1 starts with a patient already home','met'],
              ['Scenario 2 books before departure, completes after return','met'],
              ['Scenario 3 runs discovery through to post-treatment follow-up','met'],
              ['One repeatable pathway rather than four channels','met'],
              ['All demo identities are fictional','met'],
              ['Provider confirms without a per-appointment fee','config'],
              ['Facility profile for NeuroGen inside the app','concept']];
rows.forEach(function (r, i) {
  const y = 250 + i * 60;
  const ok = r[1] === 'met';
  rect(b, 90, y, 1420, 50, i % 2 ? C.surfaceAlt : C.surface, 10, 1);
  rect(b, 118, y + 13, 24, 24, ok ? C.brand : (r[1] === 'config' ? '#D97706' : C.muted), 12, 2);
  txt(b, ok ? '✓' : '•', 125, y + 17, 18, 15, C.white, 700, 6);
  txt(b, r[0], 162, y + 16, 1000, 19, C.ink, ok ? 500 : 400, 6);
  const lbl = ok ? 'Verified live' : (r[1] === 'config' ? 'Configuration' : 'Proposed');
  txt(b, lbl, 1200, y + 16, 280, 17, ok ? C.brandDark : (r[1] === 'config' ? '#B45309' : C.muted), 700, 6, 'right');
});
applyZ();
return { ok: true, kids: b.children.length };
