const b = scenario('08 Scenario 3', 1760, 2120, '3',
  'A prospective patient abroad is considering NeuroGen.',
  'Discovery, a pre-travel consult, treatment in India, and post-treatment follow-up - one relationship, carried the whole way through.',
  [['Searches for care','Specialty search, from abroad','p-03-search-neuro'],
   ['Finds NeuroGen’s clinicians','Profile, rating, availability','p-04-provider-profile'],
   ['Books a pre-travel consult','Before committing to travel','p-08-booking-slot-selected'],
   ['Meets the specialist','Assessment before the flight','p-13-incall'],
   ['Travels and is treated','NeuroGen’s existing process, unchanged'],
   ['Follows up from home','The same relationship, continued','p-11-appt-detail']]);
rect(b, 90, 798, 1420, 62, C.brandSoft, 14, 1);
txt(b, 'End state: the full lifecycle - discovery, consultation, treatment, and continued follow-up - inside one environment.', 130, 816, 1340, 21, C.brandDarker, 500, 5);
applyZ();
return { ok: true, kids: b.children.length };
