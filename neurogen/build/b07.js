const b = scenario('07 Scenario 2', 0, 2120, '2',
  'The patient is still in India, and about to fly home.',
  'The follow-up is arranged before they leave, while they are still in front of the NeuroGen team - not left to them to restart from abroad.',
  [['Connected before departure','Set up while still at NeuroGen','p-01-home'],
   ['Chooses the provider','The clinician who treated them','p-04-provider-profile'],
   ['Books for after the flight','A date past the return home','p-07-booking-day'],
   ['Visible to both','Nothing depends on memory','d-01-appointments'],
   ['Patient returns home','The pathway does not change'],
   ['Follow-up happens','Same app, different country','p-12-ringing']]);
rect(b, 90, 798, 1420, 62, C.brandSoft, 14, 1);
txt(b, 'End state: the patient leaves India with the next appointment already booked, and keeps it from home.', 130, 816, 1340, 21, C.brandDarker, 500, 5);
applyZ();
return { ok: true, kids: b.children.length };
