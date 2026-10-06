const b = board('12 How NeuroGen comes aboard', 3520, 3180, C.surface);
chrome(b, 'Onboarding', '12');
txt(b, 'What it takes to switch this on.', 90, 130, 1340, 46, C.ink, 700, 5);
txt(b, 'No integration project, no change to how NeuroGen delivers care.', 90, 188, 1340, 24, C.muted, 400, 5);
const steps = [['1','NeuroGen is created as a facility','A hospital environment with its own name, branding and member list.','Doctaz sets up'],
               ['2','Clinicians join NeuroGen','Each doctor, APRN and nurse is added to the facility and approved once.','Doctaz sets up'],
               ['3','Appointments are facility-covered','Inside NeuroGen the per-appointment country fee is waived, so a clinician confirms in one tap.','Configuration'],
               ['4','Calls inside NeuroGen are free','Provider-to-patient consults within the facility carry no per-minute charge.','Configuration'],
               ['5','Patients are invited','Existing international patients are connected to the clinician who treated them.','Together']];
steps.forEach(function (s, i) {
  const y = 260 + i * 112;
  rect(b, 90, y, 1420, 96, C.surfaceAlt, 14, 1);
  rect(b, 90, y, 6, 96, C.brand, 0, 2);
  rect(b, 124, y + 28, 40, 40, C.brand, 20, 2);
  txt(b, s[0], 138, y + 36, 24, 20, C.white, 700, 6);
  txt(b, s[1], 186, y + 20, 440, 23, C.ink, 700, 6);
  txt(b, s[2], 186, y + 52, 900, 18, C.muted, 400, 6);
  rect(b, 1310, y + 30, 170, 36, C.brandSoft, 18, 2);
  txt(b, s[3], 1310, y + 39, 170, 16, C.brandDarker, 700, 6, 'center');
});
rect(b, 90, 830, 1420, 50, C.surfaceAlt, 12, 1);
txt(b, 'NeuroGen’s treatment, travel and admission process is untouched throughout.', 130, 844, 1340, 20, C.muted, 500, 5);
applyZ();
return { ok: true, kids: b.children.length };
