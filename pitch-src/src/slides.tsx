/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
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
import { AfricaMap } from '@/components/AfricaMap'
import { T, M, ItemTools, AddItem, useE, defaultContent } from '@/edit'

type P = { id: string; b: string; d: any }

const Eb = ({ b }: { b: string }) => <Eyebrow><T p={`${b}.eyebrow`} /></Eyebrow>
const H2 = ({ b, className = 'max-w-3xl text-4xl font-bold sm:text-5xl', preset = 'blur' }: { b: string; className?: string; preset?: any }) => (
  <T p={`${b}.title`} as="h2" className={className} view={(s) => <TextEffect key={s} as="h2" per="word" preset={preset} className={className}>{s}</TextEffect>} />
)
const Li = ({ p, i, className = '', children }: { p: string; i: number; className?: string; children: ReactNode }) => (
  <div className={`relative ${className}`}><ItemTools p={p} i={i} />{children}</div>
)
const PhoneM = ({ p, className = 'aspect-[9/19.5]', alt = '' }: { p: string; className?: string; alt?: string }) => (
  <M p={p} render={(url, raw) => <Phone src={raw} url={url} className={className} alt={alt} />} />
)

function Hero({ id, b }: P) {
  const { scrollY } = useScroll()
  const yA = useTransform(scrollY, [0, 800], [0, -120])
  const yB = useTransform(scrollY, [0, 800], [0, 80])
  const rot = useTransform(scrollY, [0, 800], [0, -6])
  const { get, edit } = useE()
  const chips: string[] = get(`${b}.chips`) ?? []
  return (
    <Section id={id} bg={<><Blob className="-left-40 -top-40 h-[42rem] w-[42rem] opacity-40" /><Blob className="-right-40 bottom-0 h-[36rem] w-[36rem] opacity-30" seeds={[7, 19, 41]} color="var(--accent)" /><Waves /></>}>
      <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <M p={`${b}.logo`} accept="image/*" render={(url) => <img src={url} alt="Logo" className="mb-8 h-10 w-auto" />} />
          <T p={`${b}.kicker`} as="p" className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-primary"
            view={(s) => <TextShimmer className="mb-4 text-sm font-bold uppercase tracking-[0.3em] [--base-color:var(--primary)] [--base-gradient-color:var(--text)]" duration={3}>{s}</TextShimmer>} />
          <T p={`${b}.title`} as="h1" className="text-5xl font-extrabold leading-[1.02] sm:text-7xl"
            view={(s) => <TextEffect key={s} as="h1" per="word" preset="fade-in-blur" className="text-5xl font-extrabold leading-[1.02] sm:text-7xl">{s}</TextEffect>} />
          <Reveal delay={0.6}><T p={`${b}.sub`} as="p" className="mt-6 block max-w-xl text-lg text-muted sm:text-xl" /></Reveal>
          <Reveal delay={0.9}>
            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              {chips.map((_, k) => <Li key={k} p={`${b}.chips`} i={k}><T p={`${b}.chips.${k}`} className="glass inline-block rounded-full px-4 py-2" /></Li>)}
            </div>
            {edit && <AddItem p={`${b}.chips`} label="Add chip" />}
          </Reveal>
        </div>
        <div className="relative mx-auto flex h-[30rem] w-full max-w-md items-center justify-center sm:h-[34rem]">
          <motion.div style={{ y: yA, rotate: rot }} className="absolute left-2 top-0 w-40 sm:top-10 sm:w-52" animate={{ y: [0, -14, 0] }} transition={{ duration: 6, repeat: Infinity }}>
            <PhoneM p={`${b}.phoneA`} alt="App screen" />
          </motion.div>
          <motion.div style={{ y: yB }} className="absolute right-2 top-12 z-10 w-40 sm:top-24 sm:w-60" animate={{ y: [0, 16, 0] }} transition={{ duration: 7, repeat: Infinity }}>
            <PhoneM p={`${b}.phoneB`} alt="App screen" />
          </motion.div>
        </div>
      </div>
    </Section>
  )
}

function StatCards({ id, b, d, cols = 3 }: P & { cols?: number }) {
  return (
    <Section id={id} bg={<Blob className="right-[-20rem] top-0 h-[40rem] w-[40rem] opacity-20" seeds={[5, 13, 23]} />}>
      <Eb b={b} />
      <H2 b={b} className="max-w-4xl text-4xl font-bold sm:text-6xl" />
      <AnimatedGroup preset="blur-slide" className={`mt-14 grid gap-5 ${cols === 3 ? 'md:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
        {d.items.map((w: any, k: number) => (
          <Li key={k} p={`${b}.items`} i={k} className="glass overflow-hidden rounded-3xl p-7">
            <div className="absolute -right-4 -top-8 font-display text-[9rem] font-extrabold leading-none opacity-[0.06]">{k + 1}</div>
            {'t' in w && <T p={`${b}.items.${k}.t`} as="h3" className="block text-xl font-semibold" />}
            {'d' in w && <T p={`${b}.items.${k}.d`} as="p" className="mt-3 block text-muted" />}
            <div className={`${'t' in w ? 'mt-6' : ''} text-3xl font-bold`}><T p={`${b}.items.${k}.stat`} /></div>
            <T p={`${b}.items.${k}.label`} as="p" className="mt-2 block text-sm text-muted" />
          </Li>
        ))}
      </AnimatedGroup>
      <AddItem p={`${b}.items`} label="Add card" />
      {'note' in d && <Reveal delay={0.3}><T p={`${b}.note`} as="p" className="mt-10 block max-w-2xl text-lg text-muted" /></Reveal>}
    </Section>
  )
}

function Solution({ id, b, d }: P) {
  return (
    <Section id={id}>
      <Eb b={b} />
      <H2 b={b} className="max-w-4xl text-4xl font-bold sm:text-6xl" preset="fade-in-blur" />
      <Reveal><T p={`${b}.sub`} as="p" className="mt-4 block max-w-2xl text-lg text-muted" /></Reveal>
      <AnimatedGroup preset="scale" className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-5">
        {d.items.map((_: any, k: number) => (
          <Li key={k} p={`${b}.items`} i={k} className="glass group overflow-hidden rounded-3xl p-6 text-center">
            <Spotlight size={180} className="from-primary/40 via-primary/10 to-transparent" />
            <M p={`${b}.items.${k}.icon`} accept="image/*" render={(url) => <img src={url} alt="" className="mx-auto h-16 w-16 object-contain transition group-hover:scale-110" />} />
            <T p={`${b}.items.${k}.name`} as="h3" className="mt-4 block text-lg font-semibold" />
            <T p={`${b}.items.${k}.line`} as="p" className="mt-1 block text-sm text-muted" />
          </Li>
        ))}
      </AnimatedGroup>
      <AddItem p={`${b}.items`} label="Add role" />
    </Section>
  )
}

function Journey({ id, b, d }: P) {
  const [i, setI] = useState(0)
  const { edit } = useE()
  const steps: any[] = d.steps
  const at = Math.min(i, steps.length - 1)
  return (
    <Section id={id} bg={<Blob className="-left-60 bottom-0 h-[36rem] w-[36rem] opacity-20" seeds={[17, 31, 2]} color="var(--accent)" />}>
      <Eb b={b} />
      <H2 b={b} className="text-4xl font-bold sm:text-5xl" />
      <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
        <ol className="space-y-2">
          {steps.map((_, k) => (
            <li key={k} className="relative">
              <ItemTools p={`${b}.steps`} i={k} />
              <div role="button" tabIndex={0} onClick={() => setI(k)} onMouseEnter={() => !edit && setI(k)} onKeyDown={(e) => e.key === 'Enter' && setI(k)}
                className={`flex w-full cursor-pointer items-start gap-4 rounded-2xl p-3 text-left transition ${k === at ? 'glass' : 'opacity-60 hover:opacity-100'}`}>
                <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${k === at ? 'bg-primary text-white' : 'border border-line'}`}>{k + 1}</span>
                <span>
                  <T p={`${b}.steps.${k}.t`} className="block font-display font-semibold" />
                  {(k === at || edit) && <T p={`${b}.steps.${k}.d`} as="span" className="block text-sm text-muted" />}
                </span>
              </div>
            </li>
          ))}
          <AddItem p={`${b}.steps`} label="Add step" />
        </ol>
        <TransitionPanel activeIndex={at} className="h-[30rem] sm:h-[34rem]" transition={{ duration: 0.4, ease: 'easeOut' }}
          variants={{ enter: { opacity: 0, y: 30, filter: 'blur(6px)' }, center: { opacity: 1, y: 0, filter: 'blur(0)' }, exit: { opacity: 0, y: -30, filter: 'blur(6px)' } }}>
          {steps.map((st, k) => (
            <div key={k} className="flex h-full items-center justify-center">
              <Shot p={`${b}.steps.${k}.a`} label={st.t} />
            </div>
          ))}
        </TransitionPanel>
      </div>
    </Section>
  )
}

function Shot({ p, label }: { p: string; label: string }) {
  const { edit } = useE()
  if (edit) return <div className="w-36 sm:w-56"><PhoneM p={p} alt={label} /></div>
  return (
    <M p={p} render={(url, raw) => (
      <Dialog>
        <DialogTrigger className="flex w-36 cursor-zoom-in flex-col sm:w-56">
          <Phone src={raw} url={url} className="aspect-[9/19.5]" alt={label} />
          <span className="mt-3 block text-center text-xs uppercase tracking-widest text-muted">{label}</span>
        </DialogTrigger>
        <DialogContent className="w-[min(90vw,420px)] rounded-3xl bg-bg p-3">
          {raw.endsWith('.mp4') ? <video src={url} autoPlay muted loop playsInline className="max-h-[85vh] w-full rounded-2xl object-contain" />
            : <img src={url} alt={label} className="max-h-[85vh] w-full rounded-2xl object-contain" />}
          <DialogClose />
        </DialogContent>
      </Dialog>
    )} />
  )
}

function LiveCall({ id, b, d }: P) {
  return (
    <Section id={id} bg={<Blob className="left-1/2 top-1/2 h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 opacity-25" seeds={[21, 4, 33]} />}>
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <Eb b={b} />
          <H2 b={b} className="text-4xl font-bold sm:text-5xl" />
          <Reveal delay={0.2}><T p={`${b}.sub`} as="p" className="mt-5 block text-lg text-muted" /></Reveal>
          <Reveal delay={0.35}>
            <ul className="mt-6 space-y-2 text-sm">
              {d.points.map((_: string, k: number) => (
                <li key={k} className="relative flex items-center gap-3 pr-20"><ItemTools p={`${b}.points`} i={k} /><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-[10px] text-white">✓</span><T p={`${b}.points.${k}`} /></li>
              ))}
            </ul>
            <AddItem p={`${b}.points`} label="Add point" />
          </Reveal>
        </div>
        <div className="relative flex items-center justify-center gap-4 sm:gap-8">
          {d.phones.map((_: any, k: number) => (
            <motion.div key={k} initial={{ opacity: 0, y: 60, rotate: k ? 4 : -4 }} whileInView={{ opacity: 1, y: k ? 30 : 0, rotate: k ? 3 : -3 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: k * 0.2 }} className="w-40 sm:w-60">
              <PhoneM p={`${b}.phones.${k}.src`} alt="Live call" />
              <T p={`${b}.phones.${k}.who`} as="p" className="mt-3 block text-center text-xs uppercase tracking-widest text-muted" />
            </motion.div>
          ))}
          <motion.div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary px-4 py-2 font-display text-sm font-semibold text-white shadow-[0_0_40px_var(--primary)]"
            animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity }}><T p={`${b}.badge`} /></motion.div>
        </div>
      </div>
    </Section>
  )
}

function Features({ id, b, d }: P) {
  const { src, edit } = useE()
  return (
    <Section id={id}>
      <Eb b={b} />
      <H2 b={b} />
      <AnimatedGroup preset="blur-slide" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {d.items.map((_: any, k: number) => (
          <Li key={k} p={`${b}.items`} i={k} className="glass group flex gap-4 overflow-hidden rounded-3xl p-5">
            <Spotlight size={220} className="from-primary/30 via-primary/5 to-transparent" />
            <div className="h-40 w-20 shrink-0 overflow-hidden rounded-xl border border-line">
              <M p={`${b}.items.${k}.img`} render={(url, raw) => raw.endsWith('.mp4')
                ? <video src={url} autoPlay muted loop playsInline className="h-full w-full object-cover object-top" />
                : <img src={url} alt="" loading="lazy" className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-110" />} />
            </div>
            <div>
              <T p={`${b}.items.${k}.t`} as="h3" className="block font-semibold" />
              <T p={`${b}.items.${k}.d`} as="p" className="mt-2 block text-sm text-muted" />
            </div>
          </Li>
        ))}
      </AnimatedGroup>
      <AddItem p={`${b}.items`} label="Add feature" />
      {edit ? (
        <div className="mt-10 flex flex-wrap gap-3">
          {d.strip.map((_: string, k: number) => <Li key={k} p={`${b}.strip`} i={k} className="w-24"><M p={`${b}.strip.${k}`} render={(url) => <img src={url} alt="" className="h-48 w-24 rounded-xl object-cover object-top" />} /></Li>)}
          <AddItem p={`${b}.strip`} label="Add screen" />
        </div>
      ) : (
        <div className="mt-14 opacity-70">
          <InfiniteSlider gap={20} speed={40} speedOnHover={10}>
            {d.strip.map((s: string, k: number) => <img key={k} src={src(s)} alt="" className="h-48 w-24 rounded-xl object-cover object-top" />)}
          </InfiniteSlider>
        </div>
      )}
    </Section>
  )
}

function Tech({ id, b, d }: P) {
  return (
    <Section id={id} bg={<Blob className="left-1/3 top-1/4 h-[30rem] w-[30rem] opacity-15" seeds={[43, 8, 27]} />}>
      <Eb b={b} />
      <H2 b={b} />
      <Reveal><div className="glass mt-10 rounded-3xl p-4 sm:p-8"><Arch labels={d.nodes} /></div></Reveal>
      <EditNodes b={b} n={d.nodes.length} />
      <AnimatedGroup preset="fade" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {d.items.map((_: any, k: number) => (
          <Li key={k} p={`${b}.items`} i={k} className="border-l-2 border-primary pl-4 pr-16">
            <T p={`${b}.items.${k}.t`} as="h3" className="block font-semibold" />
            <T p={`${b}.items.${k}.d`} as="p" className="block text-sm text-muted" />
          </Li>
        ))}
      </AnimatedGroup>
      <AddItem p={`${b}.items`} label="Add point" />
    </Section>
  )
}

function EditNodes({ b, n }: { b: string; n: number }) {
  const { edit } = useE()
  if (!edit) return null
  return (
    <div className="mt-4 grid gap-2 text-xs sm:grid-cols-4">
      <p className="text-muted sm:col-span-4">Diagram boxes:</p>
      {Array.from({ length: n }, (_, k) => <div key={k} className="glass rounded-lg p-2"><T p={`${b}.nodes.${k}.t`} className="block font-semibold" /><T p={`${b}.nodes.${k}.s`} className="block text-muted" /></div>)}
    </div>
  )
}

function Model({ id, b, d }: P) {
  return (
    <Section id={id}>
      <Eb b={b} />
      <H2 b={b} />
      <AnimatedGroup preset="slide" className="mt-12 grid gap-5 md:grid-cols-3">
        {d.items.map((_: any, k: number) => (
          <Li key={k} p={`${b}.items`} i={k} className="glass overflow-hidden rounded-3xl p-7">
            <div className="absolute -right-6 -top-6 font-display text-[8rem] font-extrabold leading-none opacity-5">{k + 1}</div>
            <div className="text-3xl font-bold"><T p={`${b}.items.${k}.v`} /></div>
            <T p={`${b}.items.${k}.t`} as="h3" className="mt-4 block text-xl font-semibold" />
            <T p={`${b}.items.${k}.d`} as="p" className="mt-2 block text-muted" />
          </Li>
        ))}
      </AnimatedGroup>
      <AddItem p={`${b}.items`} label="Add revenue line" />
      <Reveal delay={0.2}>
        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-muted">
          {d.flow.map((_: string, k: number) => (
            <span key={k} className="flex items-center gap-3">
              {k > 0 && '→'}
              <Li p={`${b}.flow`} i={k}><T p={`${b}.flow.${k}`} className={`inline-block rounded-full px-4 py-2 ${k === d.flow.length - 1 ? 'bg-primary text-white' : 'glass'}`} /></Li>
            </span>
          ))}
        </div>
        <AddItem p={`${b}.flow`} label="Add flow step" />
      </Reveal>
    </Section>
  )
}

function Market({ id, b, d }: P) {
  const { edit } = useE()
  return (
    <Section id={id} bg={<Blob className="-right-40 top-10 h-[40rem] w-[40rem] opacity-25" seeds={[12, 36, 9]} color="var(--accent)" />}>
      <Eb b={b} />
      <H2 b={b} />
      <div className="mt-12 grid items-center gap-12 lg:grid-cols-2">
        <div className="relative mx-auto w-full max-w-lg">
          <AfricaMap names={d.cities} />
          <T p={`${b}.mapCaption`} as="p" className="mt-2 block text-center text-xs text-muted" />
          {edit && <div className="mt-3 flex flex-wrap gap-1 text-xs"><span className="text-muted">City labels:</span>{d.cities.map((_: string, k: number) => <T key={k} p={`${b}.cities.${k}`} className="glass rounded px-2" />)}</div>}
        </div>
        <div>
          <T p={`${b}.expansionTitle`} as="h3" className="mb-6 block text-xl font-semibold" />
          <ol className="relative border-l border-line pl-6">
            {d.expansion.map((_: string, k: number) => (
              <motion.li key={k} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: k * 0.15 }} className="relative mb-6 pr-20">
                <ItemTools p={`${b}.expansion`} i={k} />
                <span className="absolute -left-[31px] mt-1.5 h-3 w-3 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]" />
                <T p={`${b}.expansion.${k}`} className="font-display font-semibold" />
              </motion.li>
            ))}
          </ol>
          <AddItem p={`${b}.expansion`} label="Add market" />
          <div className="mb-8 mt-4 grid grid-cols-3 gap-3">
            {d.sizes.map((_: any, k: number) => (
              <motion.div key={k} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: k * 0.15 }}
                className="glass rounded-2xl p-4" style={{ background: `color-mix(in srgb, var(--primary) ${8 + k * 10}%, var(--card))` }}>
                <T p={`${b}.sizes.${k}.k`} className="block font-display text-sm font-bold text-primary" />
                <div className="mt-1 text-xl font-bold"><T p={`${b}.sizes.${k}.v`} /></div>
                <T p={`${b}.sizes.${k}.d`} className="mt-1 block text-xs text-muted" />
              </motion.div>
            ))}
          </div>
          <T p={`${b}.note`} as="p" className="block text-muted" />
        </div>
      </div>
    </Section>
  )
}

function Traction({ id, b, d }: P) {
  const [go, setGo] = useState(false)
  const { edit } = useE()
  return (
    <Section id={id}>
      <Eb b={b} />
      <H2 b={b} className="text-4xl font-bold sm:text-5xl" />
      <motion.div onViewportEnter={() => setGo(true)} className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
        {d.items.map((t: any, k: number) => {
          const n = Number(String(t.v).replace(/[^0-9.]/g, ''))
          return (
            <Li key={k} p={`${b}.items`} i={k} className="glass rounded-3xl p-7">
              <div className="font-display text-4xl font-bold sm:text-5xl">
                {edit ? <><T p={`${b}.items.${k}.v`} /><T p={`${b}.items.${k}.suffix`} className="text-2xl text-muted" /></>
                  : t.v === '' || Number.isNaN(n) ? <Ph>{t.v || '[__]'}</Ph>
                    : <><AnimatedNumber value={go ? n : 0} springOptions={{ bounce: 0, duration: 2000 }} />{t.suffix}</>}
              </div>
              <T p={`${b}.items.${k}.label`} as="p" className="mt-2 block text-muted" />
            </Li>
          )
        })}
      </motion.div>
      {edit && <p className="mt-2 text-xs text-muted">Type a number for an animated counter; the small field after it is the suffix (for example %).</p>}
      <AddItem p={`${b}.items`} label="Add metric" />
      <Reveal><T p={`${b}.note`} as="p" className="mt-8 block text-muted" /></Reveal>
    </Section>
  )
}

function Competition({ id, b, d }: P) {
  const { edit, get, set } = useE()
  const cycle = (p: string) => { const v = get(p); set(p, v === 'yes' ? 'no' : v === 'no' ? '?' : 'yes') }
  const mark = (v: string) => (v === 'yes' ? '✓' : v === 'no' ? '–' : <Ph>?</Ph>)
  return (
    <Section id={id}>
      <Eb b={b} />
      <H2 b={b} className="text-4xl font-bold sm:text-5xl" />
      <Reveal>
        <div className="glass mt-10 overflow-x-auto rounded-3xl">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead><tr><th className="p-4" />{d.competitors.map((_: string, k: number) => <th key={k} className={`p-4 font-display ${k === 0 ? 'text-primary' : ''}`}><T p={`${b}.competitors.${k}`} /></th>)}</tr></thead>
            <tbody>
              {d.rows.map((row: any, r: number) => (
                <tr key={r} className="border-t border-line">
                  <td className="relative p-4 pr-20"><ItemTools p={`${b}.rows`} i={r} /><T p={`${b}.rows.${r}.r`} /></td>
                  {d.competitors.map((_: string, k: number) => (
                    <td key={k} className={`p-4 text-lg ${k === 0 ? 'bg-primary/10' : ''}`}>
                      {edit ? <button type="button" className="edit-btn" title="Click to cycle ✓ / – / ?" onClick={() => cycle(`${b}.rows.${r}.v.${k}`)}>{mark(row.v[k] ?? '?')}</button> : mark(row.v[k] ?? '?')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
      {edit && <div className="flex gap-3"><AddItem p={`${b}.rows`} label="Add row" /><AddItem p={`${b}.competitors`} blank="[Competitor]" label="Add competitor" /></div>}
    </Section>
  )
}

function Roadmap({ id, b, d }: P) {
  return (
    <Section id={id}>
      <Eb b={b} />
      <H2 b={b} className="text-4xl font-bold sm:text-5xl" />
      <AnimatedGroup preset="blur-slide" className="mt-12 grid gap-5 md:grid-cols-3">
        {d.cols.map((col: any, k: number) => (
          <Li key={k} p={`${b}.cols`} i={k} className={`rounded-3xl p-7 ${k === 0 ? 'bg-primary text-white' : 'glass'}`}>
            <T p={`${b}.cols.${k}.q`} as="h3" className="block text-xl font-bold" />
            <ul className="mt-4 space-y-2">
              {col.items.map((_: string, j: number) => <li key={j} className="relative pr-20"><ItemTools p={`${b}.cols.${k}.items`} i={j} />• <T p={`${b}.cols.${k}.items.${j}`} /></li>)}
            </ul>
            <AddItem p={`${b}.cols.${k}.items`} label="Add" />
          </Li>
        ))}
      </AnimatedGroup>
      <T p={`${b}.note`} as="p" className="mt-6 block text-xs text-muted" />
    </Section>
  )
}

function Team({ id, b, d }: P) {
  return (
    <Section id={id}>
      <Eb b={b} />
      <H2 b={b} className="text-4xl font-bold sm:text-5xl" />
      <AnimatedGroup preset="zoom" className="mt-12 grid gap-5 sm:grid-cols-3">
        {d.items.map((_: any, k: number) => (
          <Li key={k} p={`${b}.items`} i={k} className="glass rounded-3xl p-7 text-center">
            <M p={`${b}.items.${k}.photo`} accept="image/*" render={(url, raw) => raw
              ? <img src={url} alt="" className="mx-auto mb-4 h-24 w-24 rounded-full object-cover" />
              : <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gradient-to-br from-primary to-accent" />} />
            <T p={`${b}.items.${k}.n`} as="h3" className="block text-lg font-semibold" />
            <T p={`${b}.items.${k}.r`} as="p" className="block text-primary" />
            <T p={`${b}.items.${k}.b`} as="p" className="mt-2 block text-sm text-muted" />
          </Li>
        ))}
      </AnimatedGroup>
      <AddItem p={`${b}.items`} label="Add person" />
    </Section>
  )
}

function Ask({ id, b, d }: P) {
  return (
    <Section id={id} bg={<Blob className="left-1/2 top-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 opacity-30" />}>
      <div className="text-center">
        <Eb b={b} />
        <h2 className="text-5xl font-extrabold sm:text-7xl"><T p={`${b}.lead`} /> <span className="grad"><T p={`${b}.amount`} /></span></h2>
        <Reveal><T p={`${b}.sub`} as="p" className="mx-auto mt-4 block max-w-xl text-lg text-muted" /></Reveal>
        <div className="mx-auto mt-12 max-w-2xl space-y-4 text-left">
          {d.uses.map((u: any, k: number) => (
            <Li key={k} p={`${b}.uses`} i={k}>
              <div className="mb-1 flex justify-between pr-20 text-sm"><T p={`${b}.uses.${k}.u`} /><span className="text-muted"><T p={`${b}.uses.${k}.p`} />% <T p={`${b}.useNote`} className="text-xs" /></span></div>
              <div className="h-3 overflow-hidden rounded-full bg-line">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" initial={{ width: 0 }} whileInView={{ width: `${Number(u.p) || 0}%` }} viewport={{ once: true }} transition={{ duration: 1.2, delay: k * 0.15 }} />
              </div>
            </Li>
          ))}
        </div>
        <AddItem p={`${b}.uses`} label="Add use of funds" />
      </div>
    </Section>
  )
}

function Contact({ id, b }: P) {
  return (
    <Section id={id} bg={<><Waves flip /><Waves /></>}>
      <div className="text-center">
        <M p="slides.0.data.logo" accept="image/*" render={(url) => <img src={url} alt="Logo" className="mx-auto mb-8 h-14 w-auto" />} />
        <T p={`${b}.title`} as="h2" className="text-5xl font-extrabold sm:text-7xl" view={(s) => <TextEffect key={s} as="h2" per="char" preset="fade-in-blur" className="text-5xl font-extrabold sm:text-7xl">{s}</TextEffect>} />
        <p className="mt-6 text-lg text-muted"><T p={`${b}.email`} /> · <T p={`${b}.site`} /></p>
      </div>
    </Section>
  )
}

// Basic layouts for pages the client adds.
function Statement({ id, b }: P) {
  return (
    <Section id={id} bg={<Blob className="left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 opacity-25" seeds={[9, 27, 14]} />}>
      <div className="mx-auto max-w-4xl text-center">
        <Eb b={b} />
        <H2 b={b} className="text-5xl font-extrabold sm:text-7xl" preset="fade-in-blur" />
        <Reveal delay={0.3}><T p={`${b}.sub`} as="p" className="mx-auto mt-6 block max-w-2xl text-xl text-muted" /></Reveal>
      </div>
    </Section>
  )
}

function TextMedia({ id, b, d }: P) {
  return (
    <Section id={id} bg={<Blob className="-right-40 top-10 h-[36rem] w-[36rem] opacity-20" seeds={[3, 22, 40]} color="var(--accent)" />}>
      <div className={`grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] ${d.flip === 'yes' ? 'lg:[&>*:first-child]:order-2' : ''}`}>
        <div>
          <Eb b={b} />
          <H2 b={b} className="text-4xl font-bold sm:text-5xl" />
          <Reveal delay={0.2}><T p={`${b}.sub`} as="p" className="mt-5 block text-lg text-muted" /></Reveal>
          <ul className="mt-6 space-y-2">
            {d.points.map((_: string, k: number) => (
              <li key={k} className="relative flex items-center gap-3 pr-20"><ItemTools p={`${b}.points`} i={k} /><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-[10px] text-white">✓</span><T p={`${b}.points.${k}`} /></li>
            ))}
          </ul>
          <AddItem p={`${b}.points`} label="Add point" />
          <FlipToggle b={b} />
        </div>
        <div className="mx-auto w-44 sm:w-64"><PhoneM p={`${b}.media`} alt="" /></div>
      </div>
    </Section>
  )
}

function FlipToggle({ b }: { b: string }) {
  const { edit, get, set } = useE()
  if (!edit) return null
  return <button type="button" className="edit-btn mt-4 ml-3 !px-4 !py-2 text-sm" onClick={() => set(`${b}.flip`, get(`${b}.flip`) === 'yes' ? 'no' : 'yes')}>⇄ Swap sides</button>
}

const Cards3 = (p: P) => <StatCards {...p} cols={3} />
const Cards4 = (p: P) => <StatCards {...p} cols={4} />

const base = defaultContent.slides
const fromDefault = (type: string) => structuredClone(base.find((s) => s.type === type)?.data)

export const layouts: Record<string, { name: string; C: (p: P) => ReactNode; template: () => any }> = {
  statement: { name: 'Big statement', C: Statement, template: () => ({ eyebrow: 'Section', title: 'A bold headline.', sub: 'One or two supporting sentences.' }) },
  textMedia: { name: 'Text + phone', C: TextMedia, template: () => ({ eyebrow: 'Section', title: 'Headline', sub: 'Supporting text.', points: ['First point', 'Second point'], media: 'call/android-live-doctor.jpg', flip: 'no' }) },
  hero: { name: 'Hero (headline + two phones)', C: Hero, template: () => fromDefault('hero') },
  problem: { name: 'Stat cards', C: Cards3, template: () => fromDefault('problem') },
  whyNow: { name: 'Numbered cards with stats', C: Cards3, template: () => fromDefault('whyNow') },
  solution: { name: 'Icon tiles', C: Solution, template: () => fromDefault('solution') },
  journey: { name: 'Step-by-step journey', C: Journey, template: () => fromDefault('journey') },
  live: { name: 'Two phones side by side', C: LiveCall, template: () => fromDefault('live') },
  features: { name: 'Feature cards + screen strip', C: Features, template: () => fromDefault('features') },
  tech: { name: 'Architecture diagram', C: Tech, template: () => fromDefault('tech') },
  model: { name: 'Revenue cards + flow', C: Model, template: () => fromDefault('model') },
  market: { name: 'Map + market sizes', C: Market, template: () => fromDefault('market') },
  traction: { name: 'Animated metrics', C: (p) => <Traction {...p} />, template: () => fromDefault('traction') },
  metrics4: { name: 'Four stat cards', C: Cards4, template: () => ({ eyebrow: 'Numbers', title: 'Headline', items: [1, 2, 3, 4].map(() => ({ stat: '[__]', label: 'What it measures' })) }) },
  competition: { name: 'Comparison table', C: Competition, template: () => fromDefault('competition') },
  roadmap: { name: 'Three columns', C: Roadmap, template: () => fromDefault('roadmap') },
  team: { name: 'People', C: Team, template: () => fromDefault('team') },
  ask: { name: 'Amount + bars', C: Ask, template: () => fromDefault('ask') },
  contact: { name: 'Closing', C: Contact, template: () => fromDefault('contact') },
}
