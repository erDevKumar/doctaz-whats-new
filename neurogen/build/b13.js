const b = board('13 Commercial model', 0, 4240, C.surface);
chrome(b, 'Commercial model', '13');
txt(b, 'What it costs, and who pays.', 90, 130, 1340, 46, C.ink, 700, 5);
txt(b, 'Doctaz already prices per country. Inside a facility, those charges are waived - that is the difference NeuroGen is being offered.', 90, 188, 1340, 23, C.muted, 400, 5);

rect(b, 90, 270, 690, 420, C.surfaceAlt, 18, 1);
rect(b, 90, 270, 690, 8, C.muted, 0, 2);
txt(b, 'Outside a facility (today)', 130, 310, 600, 28, C.ink, 700, 5);
const a = ['Appointment fee, India: ₹700 per appointment',
           'Settled by the clinician when they confirm',
           'Consults charged per minute to the patient',
           'Patient needs wallet balance before they can call'];
a.forEach(function (s, i) { txt(b, '•  ' + s, 130, 370 + i * 54, 600, 20, C.muted, 400, 5); });

rect(b, 820, 270, 690, 420, C.brandDarker, 18, 1);
rect(b, 820, 270, 690, 8, C.brand, 0, 2);
txt(b, 'Inside NeuroGen', 860, 310, 600, 28, C.white, 700, 5);
const c = ['Appointments are facility-covered - no ₹700 fee',
           'The clinician confirms in one tap',
           'Provider-to-patient consults are free',
           'The patient is never asked to pay to be seen'];
c.forEach(function (s, i) { txt(b, '✓  ' + s, 860, 370 + i * 54, 600, 20, C.brandSoft, 400, 5); });

rect(b, 90, 730, 1420, 120, C.brandSoft, 16, 1);
txt(b, 'This is configuration, not development. The platform already distinguishes a facility-covered appointment from a country-rate one; NeuroGen simply becomes the facility.',
    130, 762, 1340, 23, C.brandDarker, 500, 5);
txt(b, 'Country rates are maintained per country and per role in the Doctaz admin console.', 130, 806, 1340, 18, C.brandDark, 400, 5);
applyZ();
return { ok: true, kids: b.children.length };
