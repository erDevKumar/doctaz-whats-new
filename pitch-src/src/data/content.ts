// Every value in `null` / '[__]' is a placeholder the client fills before presenting.
export const img = (p: string) => `../img/${p}`

export const hero = {
  kicker: 'Doctaz · Investor preview',
  title: "Africa's realtime care network",
  sub: 'Patients, doctors, APRNs, nurses and hospitals on one network. Chat, video and group calls, with the price shown before anyone taps Call.',
}

export const problem = [
  { stat: '[__]', label: 'doctors per 10,000 people across Sub-Saharan Africa' },
  { stat: '[__]', label: 'average travel time to reach a specialist' },
  { stat: '[__]', label: 'mobile subscribers in target markets' },
]

export const roles = [
  { name: 'Patients', icon: 'patient', line: 'Find care, chat, call and pay from one wallet' },
  { name: 'Doctors', icon: 'doctor', line: 'Verified profiles, paid consultations, reviews' },
  { name: 'APRNs', icon: 'aprn', line: 'Advanced practice nurses bookable like doctors' },
  { name: 'Nurses', icon: 'nurse', line: 'Nursing care within reach of every patient' },
  { name: 'Hospitals', icon: 'hospital', line: 'A private environment where staff calls are free' },
]

export type Step = { t: string; d: string; a: string }
export const patientJourney: Step[] = [
  { t: 'Choose a role', d: 'One app, five kinds of member. Patients start in seconds.', a: 'signup/android-1-register-as.jpg' },
  { t: 'Pick an environment', d: 'Solo care or inside a hospital. The network changes around you.', a: 'onboarding/android-env-picker.jpg' },
  { t: 'Discover', d: 'A live community home with providers, posts and reviews.', a: 'community/android-home-1.jpg' },
  { t: 'Chat', d: 'Messages, photos, voice notes and PDFs. Links open as rich cards.', a: 'medtalk/android-chat-1.jpg' },
  { t: 'Know the price', d: 'The call sheet shows the cost before you call. No surprise bills.', a: 'call/android-0-callsheet.jpg' },
  { t: 'Video call', d: 'HD video on the phone’s native call screen, even when the app is closed.', a: 'call/android-2-connected.jpg' },
  { t: 'Bring in a specialist', d: 'Add people mid-call. Everyone appears in one grid.', a: 'conference/android-2-grid.jpg' },
  { t: 'Rate the care', d: 'Reviews after each call build trust for the next patient.', a: 'reviews/android-2-stars.jpg' },
]
export const providerJourney: Step[] = [
  { t: 'Register as a provider', d: 'Doctors, APRNs and nurses onboard with their credentials.', a: 'signup/android-2-form.jpg' },
  { t: 'Verify documents', d: 'Licences are uploaded in-app and checked before going live.', a: 'signup/android-doctor-docs.jpg' },
  { t: 'A public profile', d: 'A profile that patients find, follow and review.', a: 'profile/android-patient-own-1.jpg' },
  { t: 'Answer anywhere', d: 'A native ringing screen, like a normal phone call.', a: 'call/android-1-incoming.jpg' },
  { t: 'Free inside the hospital', d: 'Colleagues in the same facility call each other for free.', a: 'call/android-0-callsheet-facility.jpg' },
]

export const features = [
  { t: 'Know the price before you call', d: 'The price is on the call sheet, and the wallet is charged only for the connected call.', img: 'call/android-0-callsheet.jpg' },
  { t: 'Free calls inside a hospital', d: 'The facility environment makes internal calls free. That is a B2B hook.', img: 'call/android-0-callsheet-facility.jpg' },
  { t: 'Everyone in one grid', d: 'Conference calls with specialists, family or a guest.', img: 'conference/android-1-addperson.jpg' },
  { t: 'Rich clinical chat', d: 'Media, audio, PDFs and link cards, in sync on Android and iPhone.', img: 'chat/android-2-link-bubble.jpg' },
  { t: 'Share to Doctaz', d: 'Send lab results from any app with the system share sheet.', img: 'share/android-1-sharesheet.jpg' },
  { t: 'Reviews and reputation', d: 'Ratings after each call, shown on the home screen.', img: 'reviews/android-home-card.jpg' },
]

export const tech = [
  { t: 'Own realtime layer', d: 'In-house Socket.IO network (pulse) for chat, presence and call signalling.' },
  { t: 'Own WebRTC calling', d: 'No per-minute vendor fees. HD video and multi-party calls.' },
  { t: 'Native call screens', d: 'CallKit on iOS and Telecom on Android. Calls ring like normal phone calls.' },
  { t: 'Shared SDK', d: 'One Swift + Kotlin SDK keeps both apps on the same contract.' },
  { t: 'Pricing rules on the server', d: 'Call pricing and facility access are enforced server-side and covered by tests.' },
  { t: 'Push everywhere', d: 'Calls and messages still arrive when the app is closed.' },
]

export const model = [
  { t: 'Consultation fees', d: 'A take rate on every paid chat and call, charged from the wallet.', v: '[__]%' },
  { t: 'Facility plans', d: 'Hospitals pay per seat for their private environment.', v: '[__]/seat' },
  { t: 'Wallet float and top-ups', d: 'Mobile-money and card top-ups across currencies.', v: '[__]' },
]

export const market = [
  { k: 'TAM', v: '[__]', d: 'Digital health, Africa' },
  { k: 'SAM', v: '[__]', d: 'Teleconsultation in launch markets' },
  { k: 'SOM', v: '[__]', d: '5-year target' },
]
export const expansion = ['[Launch market]', '[Market 2]', '[Market 3]', 'Pan-Africa', 'Global']

export const traction = [
  { v: null as number | null, label: 'Registered users', suffix: '' },
  { v: null as number | null, label: 'Verified providers', suffix: '' },
  { v: null as number | null, label: 'Calls completed', suffix: '' },
  { v: null as number | null, label: 'Month-on-month growth', suffix: '%' },
]

export const competitors = ['Doctaz', '[Competitor A]', '[Competitor B]', '[Competitor C]']
export const compRows: [string, boolean[]][] = [
  ['Price before the call', [true, false, false, false]],
  ['Free in-facility calls', [true, false, false, false]],
  ['Group video consults', [true, false, false, false]],
  ['Nurses and APRNs as providers', [true, false, false, false]],
  ['Native call screen when the app is closed', [true, false, false, false]],
  ['Android + iOS parity', [true, false, false, false]],
]

export const roadmap = [
  { q: 'Live now', items: ['Chat, video and group calls', 'Wallet billing', 'Hospital environments', 'Share to Doctaz'] },
  { q: 'Next', items: ['[Appointments and scheduling]', '[E-prescriptions]', '[Insurer integration]'] },
  { q: 'Later', items: ['[AI triage]', '[Pharmacy network]', '[New regions]'] },
]

export const team = [
  { n: '[Name]', r: 'CEO', b: '[One-line background]' },
  { n: '[Name]', r: 'CTO', b: '[One-line background]' },
  { n: '[Name]', r: 'Medical lead', b: '[One-line background]' },
]

export const ask = { amount: '[$__]', uses: [['Growth', 40], ['Engineering', 30], ['Provider network', 20], ['Operations', 10]] as [string, number][] }
export const contact = { email: '[email]', site: 'doctaz.com' }
