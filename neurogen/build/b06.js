const b = scenario('06 Scenario 1', 3520, 1060, '1',
  'The patient is already home, and needs a follow-up.',
  'Previously treated at NeuroGen, now back in their own country. No new phone call, no new email thread - they open the app they already have.',
  [['Opens Doctaz','A pathway that is already there','p-01-home'],
   ['Finds the provider','The same NeuroGen clinician','p-02-findcare'],
   ['Books a follow-up','Slots in the patient’s own time zone','p-06-booking-sheet'],
   ['Confirmed','Reference, time, status','p-09-booking-confirmed'],
   ['Both sides see it','Patient view and provider view agree','p-10-appointments'],
   ['They meet','Secure video inside the same app','p-13-incall']]);
rect(b, 90, 798, 1420, 62, C.brandSoft, 14, 1);
txt(b, 'End state: home, still connected to NeuroGen, follow-up completed, and the next one already in the diary.', 130, 816, 1340, 21, C.brandDarker, 500, 5);
applyZ();
return { ok: true, kids: b.children.length };
