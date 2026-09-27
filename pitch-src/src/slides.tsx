import { useState } from 'react'
import { motion } from 'motion/react'
import { TextEffect } from '@/components/ui/text-effect'
import { TextShimmer } from '@/components/ui/text-shimmer'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { AnimatedNumber } from '@/components/ui/animated-number'
import { TransitionPanel } from '@/components/ui/transition-panel'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { Spotlight } from '@/components/ui/spotlight'
import { Dialog, DialogTrigger, DialogContent, DialogClose } from '@/components/ui/dialog'
import { Blob, Waves, Phone, Reveal, Ph, Section, Eyebrow } from '@/components/bits'
import { Arch } from '@/components/Arch'
import * as C from '@/data/content'

function Hero() {
  return (
    <Section id="hero" bg={<><Blob className="-left-40 -top-40 h-[42rem] w-[42rem] opacity-40" /><Blob className="-right-40 bottom-0 h-[36rem] w-[36rem] opacity-30" seeds={[7, 19, 41]} color="var(--accent)" /><Waves /></>}>
      <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <img src="./logo.png" alt="Doctaz" className="mb-8 h-10 w-auto" />
          <TextShimmer className="mb-4 text-sm font-bold uppercase tracking-[0.3em] [--base-color:var(--primary)] [--base-gradient-color:var(--text)]" duration={3}>{C.hero.kicker}</TextShimmer>
          <TextEffect as="h1" per="word" preset="fade-in-blur" className="text-5xl font-extrabold leading-[1.02] sm:text-7xl">{C.hero.title}</TextEffect>
          <Reveal delay={0.6}><p className="mt-6 max-w-xl text-lg text-muted sm:text-xl">{C.hero.sub}</p></Reveal>
          <Reveal delay={0.9}>
            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              {['Android + iOS live', 'HD video and group calls', 'Hospital-ready'].map((t) => (
                <span key={t} className="glass rounded-full px-4 py-2">{t}</span>
              ))}
            </div>
          </Reveal>
        </div>
        <div className="relative mx-auto flex h-[30rem] w-full max-w-md sm:h-[34rem] items-center justify-center">
          <motion.div className="absolute left-2 top-0 w-40 sm:top-10 sm:w-52" animate={{ y: [0, -14, 0] }} transition={{ duration: 6, repeat: Infinity }}>
            <Phone src="medtalk/ios-chat-1.jpg" className="aspect-[9/19.5]" alt="Chat" />
          </motion.div>
          <motion.div className="absolute right-2 top-12 z-10 w-40 sm:top-24 sm:w-60" animate={{ y: [0, 16, 0] }} transition={{ duration: 7, repeat: Infinity }}>
            <Phone src="call/ios-2-connected.jpg" className="aspect-[9/19.5]" alt="Video call" />
          </motion.div>
        </div>
      </div>
    </Section>
  )
}

function Problem() {
  return (
    <Section id="problem" bg={<><Blob className="right-[-20rem] top-0 h-[40rem] w-[40rem] opacity-20" seeds={[5, 13, 23]} /></>}>
      <Eyebrow>The problem</Eyebrow>
      <TextEffect as="h2" per="word" preset="blur" className="max-w-4xl text-4xl font-bold sm:text-6xl">
        Millions have a smartphone but no doctor within reach.
      </TextEffect>
      <AnimatedGroup preset="blur-slide" className="mt-14 grid gap-5 sm:grid-cols-3">
        {C.problem.map((p) => (
          <div key={p.label} className="glass rounded-3xl p-7">
            <div className="text-4xl font-bold"><Ph>{p.stat}</Ph></div>
            <p className="mt-3 text-muted">{p.label}</p>
          </div>
        ))}
      </AnimatedGroup>
      <Reveal delay={0.3}><p className="mt-10 max-w-2xl text-lg text-muted">Care is far away, prices are unclear, and hospitals coordinate staff on WhatsApp. Doctaz fixes all three on the phone people already own.</p></Reveal>
    </Section>
  )
}

function Solution() {
  return (
    <Section id="solution">
      <Eyebrow>The solution</Eyebrow>
      <TextEffect as="h2" per="word" preset="fade-in-blur" className="max-w-4xl text-4xl font-bold sm:text-6xl">One network. Five roles.</TextEffect>
      <Reveal><p className="mt-4 max-w-2xl text-lg text-muted">Every new member makes the network more useful for everyone else.</p></Reveal>
      <AnimatedGroup preset="scale" className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-5">
        {C.roles.map((r) => (
          <div key={r.name} className="glass group relative overflow-hidden rounded-3xl p-6 text-center">
            <Spotlight size={180} className="from-primary/40 via-primary/10 to-transparent" />
            <img src={`./roles/${r.icon}.png`} alt="" className="mx-auto h-16 w-16 object-contain transition group-hover:scale-110" />
            <h3 className="mt-4 text-lg font-semibold">{r.name}</h3>
            <p className="mt-1 text-sm text-muted">{r.line}</p>
          </div>
        ))}
      </AnimatedGroup>
    </Section>
  )
}

function Journey({ id, eyebrow, title, steps }: { id: string; eyebrow: string; title: string; steps: C.Step[] }) {
  const [i, setI] = useState(0)
  const s = steps[i]
  return (
    <Section id={id} bg={<Blob className="-left-60 bottom-0 h-[36rem] w-[36rem] opacity-20" seeds={[17, 31, 2]} color="var(--accent)" />}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <TextEffect as="h2" per="word" preset="blur" className="text-4xl font-bold sm:text-5xl">{title}</TextEffect>
      <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
        <ol className="space-y-2">
          {steps.map((st, k) => (
            <li key={st.t}>
              <button onClick={() => setI(k)} onMouseEnter={() => setI(k)}
                className={`flex w-full items-start gap-4 rounded-2xl p-3 text-left transition ${k === i ? 'glass' : 'opacity-60 hover:opacity-100'}`}>
                <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${k === i ? 'bg-primary text-white' : 'border border-line'}`}>{k + 1}</span>
                <span>
                  <span className="block font-display font-semibold">{st.t}</span>
                  {k === i && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="block text-sm text-muted">{st.d}</motion.span>}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <TransitionPanel activeIndex={i} className="h-[30rem] sm:h-[34rem]"
          transition={{ duration: 0.4, ease: 'easeOut' }}
          variants={{ enter: { opacity: 0, y: 30, filter: 'blur(6px)' }, center: { opacity: 1, y: 0, filter: 'blur(0)' }, exit: { opacity: 0, y: -30, filter: 'blur(6px)' } }}>
          {steps.map((st) => (
            <div key={st.t} className="flex h-full items-center justify-center gap-4 sm:gap-8">
              <Shot src={st.a} label="Android" />
              <Shot src={st.i} label="iPhone" />
            </div>
          ))}
        </TransitionPanel>
      </div>
      <p className="sr-only" aria-live="polite">{s.t}</p>
    </Section>
  )
}

function Shot({ src, label }: { src: string; label: string }) {
  return (
    <Dialog>
      <DialogTrigger className="flex w-36 cursor-zoom-in flex-col sm:w-56">
        <Phone src={src} className="aspect-[9/19.5]" alt={label} />
        <span className="mt-3 block text-center text-xs uppercase tracking-widest text-muted">{label}</span>
      </DialogTrigger>
      <DialogContent className="w-[min(90vw,420px)] rounded-3xl bg-bg p-3">
        <img src={C.img(src)} alt={label} className="max-h-[85vh] w-full rounded-2xl object-contain" />
        <DialogClose />
      </DialogContent>
    </Dialog>
  )
}

function Features() {
  return (
    <Section id="features">
      <Eyebrow>What makes it different</Eyebrow>
      <TextEffect as="h2" per="word" preset="blur" className="max-w-3xl text-4xl font-bold sm:text-5xl">Built for trust. Built to grow.</TextEffect>
      <AnimatedGroup preset="blur-slide" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {C.features.map((f) => (
          <div key={f.t} className="glass group relative flex gap-4 overflow-hidden rounded-3xl p-5">
            <Spotlight size={220} className="from-primary/30 via-primary/5 to-transparent" />
            <div className="h-40 w-20 shrink-0 overflow-hidden rounded-xl border border-line">
              <img src={C.img(f.img)} alt="" loading="lazy" className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-110" />
            </div>
            <div>
              <h3 className="font-semibold">{f.t}</h3>
              <p className="mt-2 text-sm text-muted">{f.d}</p>
            </div>
          </div>
        ))}
      </AnimatedGroup>
      <div className="mt-14 opacity-70">
        <InfiniteSlider gap={20} speed={40} speedOnHover={10}>
          {['chat/ios-5-grid.jpg', 'share/ios-4-editor.jpg', 'conference/android-2-grid.jpg', 'call/ios-1-incoming.jpg', 'community/ios-home-1.jpg', 'reviews/ios-3-filled.jpg', 'chat/android-9-grid-gallery.jpg', 'share/android-8-delivered.jpg']
            .map((p) => <img key={p} src={C.img(p)} alt="" className="h-48 w-24 rounded-xl object-cover object-top" />)}
        </InfiniteSlider>
      </div>
    </Section>
  )
}

function Tech() {
  return (
    <Section id="tech" bg={<><Blob className="left-1/3 top-1/4 h-[30rem] w-[30rem] opacity-15" seeds={[43, 8, 27]} /></>}>
      <Eyebrow>Technology moat</Eyebrow>
      <TextEffect as="h2" per="word" preset="blur" className="max-w-3xl text-4xl font-bold sm:text-5xl">We own the stack that others rent.</TextEffect>
      <Reveal><div className="glass mt-10 rounded-3xl p-4 sm:p-8"><Arch /></div></Reveal>
      <AnimatedGroup preset="fade" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {C.tech.map((t) => (
          <div key={t.t} className="border-l-2 border-primary pl-4">
            <h3 className="font-semibold">{t.t}</h3>
            <p className="text-sm text-muted">{t.d}</p>
          </div>
        ))}
      </AnimatedGroup>
    </Section>
  )
}

function Model() {
  return (
    <Section id="model">
      <Eyebrow>Business model</Eyebrow>
      <TextEffect as="h2" per="word" preset="blur" className="max-w-3xl text-4xl font-bold sm:text-5xl">Revenue on every interaction.</TextEffect>
      <AnimatedGroup preset="slide" className="mt-12 grid gap-5 md:grid-cols-3">
        {C.model.map((m, k) => (
          <div key={m.t} className="glass relative overflow-hidden rounded-3xl p-7">
            <div className="absolute -right-6 -top-6 font-display text-[8rem] font-extrabold leading-none opacity-5">{k + 1}</div>
            <div className="text-3xl font-bold"><Ph>{m.v}</Ph></div>
            <h3 className="mt-4 text-xl font-semibold">{m.t}</h3>
            <p className="mt-2 text-muted">{m.d}</p>
          </div>
        ))}
      </AnimatedGroup>
      <Reveal delay={0.2}>
        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-muted">
          <span className="glass rounded-full px-4 py-2">Patient tops up wallet</span>→
          <span className="glass rounded-full px-4 py-2">Sees the price</span>→
          <span className="glass rounded-full px-4 py-2">Call connects and is billed</span>→
          <span className="rounded-full bg-primary px-4 py-2 text-white">Doctaz take rate</span>
        </div>
      </Reveal>
    </Section>
  )
}

function Market() {
  return (
    <Section id="market" bg={<><Blob className="-right-40 top-10 h-[40rem] w-[40rem] opacity-25" seeds={[12, 36, 9]} color="var(--accent)" /></>}>
      <Eyebrow>Market</Eyebrow>
      <TextEffect as="h2" per="word" preset="blur" className="max-w-3xl text-4xl font-bold sm:text-5xl">Africa first. Built for the world.</TextEffect>
      <div className="mt-12 grid items-center gap-12 lg:grid-cols-2">
        <div className="relative mx-auto aspect-square w-full max-w-md">
          {C.market.map((m, k) => (
            <motion.div key={m.k} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: k * 0.25, type: 'spring' }}
              className="absolute inset-0 m-auto flex items-start justify-center rounded-full border border-primary/40 pt-6"
              style={{ width: `${100 - k * 30}%`, height: `${100 - k * 30}%`, background: `color-mix(in srgb, var(--primary) ${10 + k * 15}%, transparent)` }}>
              <div className="text-center"><div className="font-display text-sm font-bold">{m.k}</div><Ph>{m.v}</Ph><div className="text-xs text-muted">{m.d}</div></div>
            </motion.div>
          ))}
        </div>
        <div>
          <h3 className="mb-6 text-xl font-semibold">Expansion path</h3>
          <ol className="relative border-l border-line pl-6">
            {C.expansion.map((e, k) => (
              <motion.li key={e} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: k * 0.15 }} className="mb-6">
                <span className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]" />
                <span className="font-display font-semibold">{e.startsWith('[') ? <Ph>{e}</Ph> : e}</span>
              </motion.li>
            ))}
          </ol>
          <p className="text-muted">The same product works in any market: mobile money or cards, multiple currencies, and new facilities added from the admin panel with no app release.</p>
        </div>
      </div>
    </Section>
  )
}

function Traction() {
  const [go, setGo] = useState(false)
  return (
    <Section id="traction">
      <Eyebrow>Traction</Eyebrow>
      <TextEffect as="h2" per="word" preset="blur" className="text-4xl font-bold sm:text-5xl">Live on Android and iPhone today.</TextEffect>
      <motion.div onViewportEnter={() => setGo(true)} className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
        {C.traction.map((t) => (
          <div key={t.label} className="glass rounded-3xl p-7">
            <div className="font-display text-4xl font-bold sm:text-5xl">
              {t.v == null ? <Ph>[__]</Ph> : <><AnimatedNumber value={go ? t.v : 0} springOptions={{ bounce: 0, duration: 2000 }} />{t.suffix}</>}
            </div>
            <p className="mt-2 text-muted">{t.label}</p>
          </div>
        ))}
      </motion.div>
      <Reveal><p className="mt-8 text-muted">Shipped: chat, 1:1 and group video, wallet billing, hospital environments, share-to-Doctaz and reviews. All of it is on both platforms.</p></Reveal>
    </Section>
  )
}

function Competition() {
  return (
    <Section id="competition">
      <Eyebrow>Competition</Eyebrow>
      <TextEffect as="h2" per="word" preset="blur" className="text-4xl font-bold sm:text-5xl">Where Doctaz wins.</TextEffect>
      <Reveal>
        <div className="glass mt-10 overflow-x-auto rounded-3xl">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead><tr>{['', ...C.competitors].map((c, k) => <th key={k} className={`p-4 font-display ${k === 1 ? 'text-primary' : ''}`}>{c.startsWith('[') ? <Ph>{c}</Ph> : c}</th>)}</tr></thead>
            <tbody>
              {C.compRows.map(([r, v]) => (
                <tr key={r} className="border-t border-line">
                  <td className="p-4">{r}</td>
                  {v.map((b, k) => <td key={k} className={`p-4 text-lg ${k === 0 ? 'bg-primary/10' : ''}`}>{k === 0 ? (b ? '✓' : '–') : <Ph>?</Ph>}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </Section>
  )
}

function Roadmap() {
  return (
    <Section id="roadmap">
      <Eyebrow>Roadmap</Eyebrow>
      <TextEffect as="h2" per="word" preset="blur" className="text-4xl font-bold sm:text-5xl">What we've built, and what comes next.</TextEffect>
      <AnimatedGroup preset="blur-slide" className="mt-12 grid gap-5 md:grid-cols-3">
        {C.roadmap.map((r, k) => (
          <div key={r.q} className={`rounded-3xl p-7 ${k === 0 ? 'bg-primary text-white' : 'glass'}`}>
            <h3 className="text-xl font-bold">{r.q}</h3>
            <ul className="mt-4 space-y-2">{r.items.map((i) => <li key={i}>{i.startsWith('[') ? <Ph>{i}</Ph> : `• ${i}`}</li>)}</ul>
          </div>
        ))}
      </AnimatedGroup>
      <p className="mt-6 text-xs text-muted">Items marked "Next" and "Later" are future work, not shipped features.</p>
    </Section>
  )
}

function Team() {
  return (
    <Section id="team">
      <Eyebrow>Team</Eyebrow>
      <TextEffect as="h2" per="word" preset="blur" className="text-4xl font-bold sm:text-5xl">The people building it.</TextEffect>
      <AnimatedGroup preset="zoom" className="mt-12 grid gap-5 sm:grid-cols-3">
        {C.team.map((t, k) => (
          <div key={k} className="glass rounded-3xl p-7 text-center">
            <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gradient-to-br from-primary to-accent" />
            <h3 className="text-lg font-semibold"><Ph>{t.n}</Ph></h3>
            <p className="text-primary">{t.r}</p>
            <p className="mt-2 text-sm text-muted"><Ph>{t.b}</Ph></p>
          </div>
        ))}
      </AnimatedGroup>
    </Section>
  )
}

function Ask() {
  return (
    <Section id="ask" bg={<><Blob className="left-1/2 top-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 opacity-30" /></>}>
      <div className="text-center">
        <Eyebrow>The ask</Eyebrow>
        <h2 className="text-5xl font-extrabold sm:text-7xl">Raising <span className="grad"><Ph>{C.ask.amount}</Ph></span></h2>
        <Reveal><p className="mx-auto mt-4 max-w-xl text-lg text-muted">To win the launch market and open the next ones.</p></Reveal>
        <div className="mx-auto mt-12 max-w-2xl space-y-4 text-left">
          {C.ask.uses.map(([u, p], k) => (
            <div key={u}>
              <div className="mb-1 flex justify-between text-sm"><span>{u}</span><span className="text-muted">{p}% <span className="text-xs">(placeholder)</span></span></div>
              <div className="h-3 overflow-hidden rounded-full bg-line">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" initial={{ width: 0 }} whileInView={{ width: `${p}%` }} viewport={{ once: true }} transition={{ duration: 1.2, delay: k * 0.15 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Contact() {
  return (
    <Section id="contact" bg={<><Waves flip /><Waves /></>}>
      <div className="text-center">
        <img src="./logo.png" alt="Doctaz" className="mx-auto mb-8 h-14 w-auto" />
        <TextEffect as="h2" per="char" preset="fade-in-blur" className="text-5xl font-extrabold sm:text-7xl">Care, one tap away.</TextEffect>
        <p className="mt-6 text-lg text-muted"><Ph>{C.contact.email}</Ph> · {C.contact.site}</p>
      </div>
    </Section>
  )
}

export const slides = [
  { id: 'hero', label: 'Doctaz', C: Hero },
  { id: 'problem', label: 'Problem', C: Problem },
  { id: 'solution', label: 'Solution', C: Solution },
  { id: 'patient', label: 'Patient journey', C: () => <Journey id="patient" eyebrow="Patient journey" title="From sign-up to a 5-star consult." steps={C.patientJourney} /> },
  { id: 'provider', label: 'Providers', C: () => <Journey id="provider" eyebrow="Providers and hospitals" title="Built for the people who deliver care." steps={C.providerJourney} /> },
  { id: 'features', label: 'Features', C: Features },
  { id: 'tech', label: 'Technology', C: Tech },
  { id: 'model', label: 'Business model', C: Model },
  { id: 'market', label: 'Market', C: Market },
  { id: 'traction', label: 'Traction', C: Traction },
  { id: 'competition', label: 'Competition', C: Competition },
  { id: 'roadmap', label: 'Roadmap', C: Roadmap },
  { id: 'team', label: 'Team', C: Team },
  { id: 'ask', label: 'Ask', C: Ask },
  { id: 'contact', label: 'Contact', C: Contact },
]
