const b = board('11 Proof - booking', 1760, 3180, C.surface);
chrome(b, 'Proof', '11');
txt(b, 'The same appointment, on both phones.', 90, 130, 1340, 46, C.ink, 700, 5);
txt(b, 'Captured live. The patient books; the provider sees the request; both read the time in their own time zone.', 90, 188, 1340, 23, C.muted, 400, 5);
const cols = [['Patient books','p-06-booking-sheet','Slots are shown in the patient’s time zone'],
              ['Confirmed','p-09-booking-confirmed','Reference APT-89, Thu 8 Oct, 10:00 AM'],
              ['Patient’s list','p-10-appointments','Pending - waiting on the provider'],
              ['Provider’s list','d-01-appointments','Requested - the same appointment, same time']];
cols.forEach(function (c, i) {
  const x = 90 + i * 365;
  rect(b, x, 260, 330, 540, C.surfaceAlt, 16, 1);
  txt(b, c[0], x + 20, 282, 290, 22, C.ink, 700, 6);
  imgRect(b, x + 20, 320, 290, 420, M[c[1]], 10, 3);
  txt(b, c[2], x + 20, 752, 290, 15, C.muted, 400, 6);
});
rect(b, 90, 822, 1420, 56, C.brandSoft, 12, 1);
txt(b, 'Acceptance criterion met: patient and provider views show the same scheduled appointment.', 130, 838, 1340, 21, C.brandDarker, 500, 5);
applyZ();
return { ok: true, kids: b.children.length };
