/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import { layouts } from '@/slides'
import { ContentProvider, useE, T, M, ItemTools, AddItem, Field, type Slide } from '@/edit'
import { Phone, Blob, Waves } from '@/components/bits'

const store = {
  get: (k: string) => { try { return localStorage.getItem(k) } catch { return null } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v) } catch { /* private mode */ } },
}

export default function App() {
  return <ContentProvider><Shell /></ContentProvider>
}

function Shell() {
  const { c, edit } = useE()
  const [dark, setDark] = useState(() => (store.get('theme') ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark')
  const [present, setPresent] = useState(() => new URLSearchParams(location.search).has('present'))
  const [view, setView] = useState(() => { const m = location.hash.match(/^#journey-(\d+)/); return m ? Number(m[1]) : -1 })
  const [active, setActive] = useState(0)
  const [pages, setPages] = useState(false)
  const [settings, setSettings] = useState(false)
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const slides = (c.slides as Slide[]).map((s, i) => ({ ...s, i })).filter((s) => edit || !s.hidden)

  useEffect(() => { document.documentElement.classList.toggle('dark', dark); store.set('theme', dark ? 'dark' : 'light') }, [dark])
  const st: any = (c as any).settings ?? {}
  const ui = { present: '▶ Present as slides', exit: '✕ Exit', pdf: 'PDF', journeysGroup: 'User journeys', journeyKicker: 'Clickable prototype', journeyHint: '', ...(st.ui ?? {}) }
  useEffect(() => { if (st.title) document.title = st.title }, [st.title])
  const themeCss = useThemeCss(st)
  useEffect(() => { if (view >= 0) history.replaceState(null, '', `#journey-${view}`); else if (location.hash.startsWith('#journey')) history.replaceState(null, '', location.pathname + location.search) }, [view])

  useEffect(() => {
    if (present || view >= 0) return
    const els = [...document.querySelectorAll<HTMLElement>('[data-slide]')]
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(els.indexOf(e.target as HTMLElement))), { threshold: 0.5 })
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [present, view, slides.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input,textarea,select,[contenteditable=true]')) return
      if (present) {
        if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); setActive((a) => Math.min(slides.length - 1, a + 1)) }
        if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); setActive((a) => Math.max(0, a - 1)) }
        if (e.key === 'Escape') setPresent(false)
      }
      if (e.key === 'p' || e.key === 'P') startPresent()
      if (e.key === 'f' || e.key === 'F') toggleFs()
      if (e.key === 't' || e.key === 'T') setDark((d) => !d)
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  })

  const toggleFs = () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {}))
  const startPresent = () => { setView(-1); setPresent((p) => { if (!p) { setActive(0); document.documentElement.requestFullscreen?.().catch(() => {}) } else if (document.fullscreenElement) document.exitFullscreen(); return !p }) }

  // Reveal-on-scroll content only renders once seen, so walk every slide before printing.
  const exportPdf = async () => {
    setPresent(false); setView(-1)
    await new Promise((r) => setTimeout(r, 300))
    for (const el of document.querySelectorAll<HTMLElement>('[data-slide]')) { el.scrollIntoView(); await new Promise((r) => setTimeout(r, 700)) }
    await new Promise((r) => setTimeout(r, 1500)); scrollTo(0, 0); print()
  }

  const render = (s: Slide & { i: number }) => {
    const L = layouts[s.type] ?? layouts.statement
    return (
      <div key={s.id} data-bg={s.bg ?? 'auto'} className={`relative ${s.hidden ? 'opacity-40' : ''}`}>
        {s.bg === 'waves' && <><Waves flip /><Waves /></>}
        {edit && <span className="absolute left-2 top-16 z-40 rounded-full bg-black/70 px-3 py-1 text-xs text-white">Page {s.i + 1} · {layouts[s.type]?.name ?? s.type}{s.hidden ? ' · hidden' : ''}</span>}
        <L.C id={s.id} b={`slides.${s.i}.data`} d={s.data} />
      </div>
    )
  }

  return (
    <>
      <style>{themeCss}</style>
      {!present && view < 0 && <motion.div data-chrome className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-primary to-accent" style={{ scaleX: bar }} />}
      <header data-chrome className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-2 px-3 py-3 text-sm sm:px-4 ${present ? 'pointer-events-none opacity-0 transition hover:pointer-events-auto hover:opacity-100 focus-within:pointer-events-auto focus-within:opacity-100' : ''}`}>
        <label className="glass flex items-center gap-2 rounded-full py-1 pl-4 pr-2">
          <span className="sr-only">Choose view</span>
          <select value={view} onChange={(e) => { setPresent(false); setView(Number(e.target.value)); scrollTo(0, 0) }}
            className="max-w-[44vw] cursor-pointer bg-transparent py-1 font-display font-semibold outline-none">
            <option value={-1}>{c.deckName}</option>
            <optgroup label={ui.journeysGroup}>
              {c.journeys.map((j: any, k: number) => <option key={k} value={k}>{j.name}</option>)}
            </optgroup>
          </select>
        </label>
        <div className="flex items-center gap-2">
          <button onClick={startPresent} className="rounded-full bg-primary px-4 py-2 font-semibold text-white shadow-[0_0_24px_color-mix(in_srgb,var(--primary)_50%,transparent)]" title="P">
            {present ? ui.exit : ui.present}
          </button>
          {!present && <button onClick={exportPdf} className="glass hidden rounded-full px-4 py-2 sm:block" title="Save as PDF">{ui.pdf}</button>}
          <button onClick={() => setDark((d) => !d)} className="glass rounded-full px-3 py-2" aria-label="Toggle theme" title="T">{dark ? '☀' : '☾'}</button>
        </div>
      </header>

      <EditBar onPages={() => { setSettings(false); setPages((p) => !p) }} onSettings={() => { setPages(false); setSettings((p) => !p) }} />
      {pages && edit && <PagesPanel onClose={() => setPages(false)} />}
      {settings && edit && <SettingsPanel onClose={() => setSettings(false)} />}

      {view >= 0 ? <JourneyViewer k={view} /> : present ? (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-bg" onClick={(e) => { if (!(e.target as HTMLElement).closest('a,button,[role=button],video,select')) setActive((a) => Math.min(slides.length - 1, a + 1)) }}>
          <AnimatePresence mode="wait">
            <motion.div key={slides[active]?.id} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
              {slides[active] && render(slides[active])}
            </motion.div>
          </AnimatePresence>
          <div data-chrome className="fixed inset-x-0 bottom-4 z-50 flex items-center justify-center gap-3 text-sm">
            <button className="glass rounded-full px-3 py-1" onClick={(e) => { e.stopPropagation(); setActive((a) => Math.max(0, a - 1)) }} aria-label="Previous slide">←</button>
            <span className="glass rounded-full px-4 py-1 font-display">{active + 1} / {slides.length} · {slides[active]?.label}</span>
            <button className="glass rounded-full px-3 py-1" onClick={(e) => { e.stopPropagation(); setActive((a) => Math.min(slides.length - 1, a + 1)) }} aria-label="Next slide">→</button>
          </div>
        </div>
      ) : (
        <>
          <nav data-chrome className="fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-2 md:flex" aria-label="Slides">
            {slides.map((s, i) => (
              <a key={s.id} href={`#${s.id}`} title={s.label} aria-label={s.label}
                className={`h-2.5 w-2.5 rounded-full transition-all ${i === active ? 'h-6 bg-primary' : 'bg-muted/40 hover:bg-muted'}`} />
            ))}
          </nav>
          <main>{slides.map(render)}</main>
        </>
      )}
    </>
  )
}

function JourneyViewer({ k }: { k: number }) {
  const { c, edit, set, get } = useE()
  const j = c.journeys[k] as any
  const [i, setI] = useState(0)
  useEffect(() => setI(0), [k])
  const n = j?.steps.length ?? 0
  const at = Math.min(i, Math.max(0, n - 1))
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input,select,[contenteditable=true]')) return
      if (e.key === 'ArrowRight') setI((x) => (x + 1) % n)
      if (e.key === 'ArrowLeft') setI((x) => (x - 1 + n) % n)
    }
    addEventListener('keydown', onKey); return () => removeEventListener('keydown', onKey)
  }, [n])
  if (!j) return null
  const p = `journeys.${k}.steps`
  return (
    <section className="relative min-h-screen overflow-hidden px-4 pb-16 pt-24 sm:px-10">
      <Blob className="-left-40 top-20 h-[36rem] w-[36rem] opacity-25" seeds={[17, 31, 2]} />
      <div className="relative z-10 mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[1fr_auto]">
        <div>
          {edit && <div className="relative mb-2 h-7"><ItemTools p="journeys" i={k} /><span className="text-xs text-muted">Move or delete this journey →</span></div>}
          <T p="settings.ui.journeyKicker" as="p" className="mb-3 block text-xs font-bold uppercase tracking-[0.25em] text-primary" />
          <T p={`journeys.${k}.name`} as="h1" className="block text-4xl font-bold sm:text-5xl" />
          <T p={`journeys.${k}.sub`} as="p" className="mt-3 block max-w-xl text-lg text-muted" />
          <T p="settings.ui.journeyHint" as="p" className="mt-3 block text-sm text-muted" />
          {edit && <p className="mt-2 text-xs text-muted">Tip: clear any text to hide it. The hint and kicker are shared by all journeys.</p>}
          <ol className="mt-8 grid gap-1 sm:grid-cols-2">
            {j.steps.map((_: any, s: number) => (
              <li key={s} className="relative">
                <ItemTools p={p} i={s} />
                <div role="button" tabIndex={0} onClick={() => setI(s)} onKeyDown={(e) => e.key === 'Enter' && setI(s)}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 pr-20 transition ${s === at ? 'glass' : 'opacity-60 hover:opacity-100'}`}>
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${s === at ? 'bg-primary text-white' : 'border border-line'}`}>{s + 1}</span>
                  <span><T p={`${p}.${s}.t`} className="block font-display text-sm font-semibold" />{(edit || s === at) && <T p={`${p}.${s}.d`} className="block text-xs text-muted" />}</span>
                </div>
              </li>
            ))}
          </ol>
          <AddItem p={p} label="Add screen" />
          {edit && (
            <div className="mt-6 flex flex-wrap gap-2 text-sm">
              <button type="button" className="edit-btn !px-4 !py-2" onClick={() => set('journeys', [...c.journeys, { name: 'New journey', sub: '', steps: [{ t: 'First screen', d: '', a: 'signup/android-1-register-as.jpg' }] }])}>＋ New journey</button>
              <button type="button" className="edit-btn !px-4 !py-2 hover:!bg-red-600" onClick={() => { if (c.journeys.length > 1 && confirm(`Delete "${j.name}"?`)) { set('journeys', c.journeys.filter((_: any, x: number) => x !== k)); location.hash = '' } }}>Delete this journey</button>
            </div>
          )}
        </div>
        <div className="mx-auto flex flex-col items-center">
          <div className="relative w-64 sm:w-72" onClick={() => !edit && setI((x) => (x + 1) % n)} role="button" aria-label="Next screen" tabIndex={-1}>
            <AnimatePresence mode="wait">
              <motion.div key={`${k}-${at}-${get(`${p}.${at}.a`)}`} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.35, ease: 'easeOut' }} className="cursor-pointer">
                <M p={`${p}.${at}.a`} render={(url, raw) => <Phone src={raw} url={url} tilt={false} className="aspect-[9/20]" alt={j.steps[at]?.t} />} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-5 flex items-center gap-3 text-sm">
            <button className="glass rounded-full px-3 py-1" onClick={() => setI((x) => (x - 1 + n) % n)} aria-label="Previous screen">←</button>
            <span className="font-display">{at + 1} / {n} · {j.steps[at]?.t}</span>
            <button className="glass rounded-full px-3 py-1" onClick={() => setI((x) => (x + 1) % n)} aria-label="Next screen">→</button>
          </div>
          {j.steps[at]?.d && !edit && <p className="mt-2 max-w-xs text-center text-sm text-muted">{j.steps[at].d}</p>}
        </div>
      </div>
    </section>
  )
}

function EditBar({ onPages, onSettings }: { onPages: () => void; onSettings: () => void }) {
  const { edit, dirty, busy, save, login, logout, discard, token, status } = useE()
  const [tok, setTok] = useState('')
  const [msg, setMsg] = useState('')
  if (!new URLSearchParams(location.search).has('edit')) return null
  if (!token) {
    return (
      <div className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4 backdrop-blur">
        <form className="w-full max-w-md rounded-3xl bg-bg p-7 shadow-2xl ring-1 ring-line" onSubmit={async (e) => { e.preventDefault(); setMsg('Checking…'); setMsg((await login(tok)) ?? '') }}>
          <h2 className="text-2xl font-bold">Edit the deck</h2>
          <p className="mt-2 text-sm text-muted">Paste the GitHub access token you were given. It stays in this browser tab only and is forgotten when you close it.</p>
          <input type="password" autoFocus value={tok} onChange={(e) => setTok(e.target.value)} placeholder="github_pat_…" className="mt-5 w-full rounded-xl border border-line bg-transparent px-4 py-3 outline-none focus:border-primary" aria-label="GitHub access token" />
          {msg && <p className="mt-3 text-sm text-primary" role="status">{msg}</p>}
          <div className="mt-5 flex justify-between gap-3">
            <a href={location.pathname} className="rounded-full px-4 py-2 text-sm text-muted">View only</a>
            <button className="rounded-full bg-primary px-5 py-2 font-semibold text-white">Unlock editing</button>
          </div>
        </form>
      </div>
    )
  }
  return (
    <div data-chrome className="fixed bottom-4 left-1/2 z-[55] flex -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-full bg-black/85 px-3 py-2 text-sm text-white shadow-2xl ring-1 ring-white/20 backdrop-blur">
      <span className="px-2 font-display font-semibold">✎ Editing</span>
      <button className="rounded-full px-3 py-1 hover:bg-white/10" onClick={onPages}>☰ Pages</button>
      <button className="rounded-full px-3 py-1 hover:bg-white/10" onClick={onSettings}>⚙ Settings</button>
      {edit && dirty && <button className="rounded-full px-3 py-1 hover:bg-white/10" onClick={() => confirm('Discard all unsaved changes?') && discard()}>Discard</button>}
      <button disabled={!dirty || !!busy} className="rounded-full bg-primary px-4 py-1 font-semibold disabled:opacity-40" onClick={() => save()}>{busy || (dirty ? 'Save & publish' : 'No unsaved changes')}</button>
      <button className="rounded-full px-3 py-1 text-white/60 hover:bg-white/10" onClick={logout}>Lock</button>
      {dirty && !busy && <span className="basis-full px-2 text-center text-xs text-amber-300">Unsaved changes: only you can see them until you press Save &amp; publish.</span>}
      {status.text && <span role={status.kind === 'error' ? 'alert' : 'status'} className={`basis-full rounded-xl px-3 py-1.5 text-center text-xs ${status.kind === 'error' ? 'bg-red-600 font-semibold text-white' : 'text-emerald-300'}`}>{status.text}</span>}
    </div>
  )
}

function PagesPanel({ onClose }: { onClose: () => void }) {
  const { c, set } = useE()
  const [type, setType] = useState('statement')
  const insert = (at: number) => {
    const id = `page-${Date.now().toString(36)}`
    set('slides', [...c.slides.slice(0, at), { id, type, label: layouts[type].name, bg: 'auto', data: layouts[type].template() }, ...c.slides.slice(at)])
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300)
  }
  return (
    <aside data-chrome className="fixed right-3 top-16 z-[56] max-h-[80vh] w-[min(92vw,360px)] overflow-y-auto rounded-3xl bg-bg p-5 shadow-2xl ring-1 ring-line">
      <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">Pages</h2><button onClick={onClose} aria-label="Close" className="px-2">✕</button></div>
      <ol className="space-y-2">
        {c.slides.map((s: any, i: number) => (
          <li key={s.id} className="relative flex items-center gap-2 rounded-xl border border-line p-2 pr-24 text-sm">
            <ItemTools p="slides" i={i} />
            <button title={s.hidden ? 'Show page' : 'Hide page'} onClick={() => set(`slides.${i}.hidden`, !s.hidden)} className="w-6 shrink-0">{s.hidden ? '◌' : '●'}</button>
            <div className="min-w-0 flex-1">
              <a href={`#${s.id}`} className="block truncate"><T p={`slides.${i}.label`} className="font-semibold" /></a>
              <span className="text-xs text-muted">{layouts[s.type]?.name ?? s.type}</span>
              <details className="mt-1 text-xs">
                <summary className="cursor-pointer text-primary">Page options</summary>
                <div className="mt-2 grid gap-2">
                  <Field p={`slides.${i}.bg`} label="Background" options={[['auto', 'Layout default'], ['waves', 'Add waves'], ['plain', 'Plain (no glow)']]} />
                  <Field p={`slides.${i}.id`} label="Page link id (used in #links)" />
                  <div className="flex flex-wrap gap-2">
                    <button className="edit-btn !px-3 !py-1" onClick={() => set('slides', [...c.slides.slice(0, i + 1), { ...structuredClone(s), id: `${s.id}-copy-${Date.now().toString(36)}`, label: `${s.label} (copy)` }, ...c.slides.slice(i + 1)])}>⧉ Duplicate</button>
                    <button className="edit-btn !px-3 !py-1" onClick={() => insert(i + 1)}>＋ Insert “{layouts[type].name}” after</button>
                  </div>
                </div>
              </details>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-5 rounded-2xl border border-dashed border-line p-3">
        <p className="mb-2 text-sm font-semibold">Add a page</p>
        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-lg border border-line bg-bg px-2 py-2 text-sm">
          {Object.entries(layouts).map(([k, l]) => <option key={k} value={k}>{l.name}</option>)}
        </select>
        <button className="mt-3 w-full rounded-full bg-primary py-2 text-sm font-semibold text-white" onClick={() => insert(c.slides.length)}>＋ Add at the end</button>
        <p className="mt-2 text-xs text-muted">Use ↑ ↓ to reorder, ● to hide a page without deleting it, ✕ to delete.</p>
      </div>
    </aside>
  )
}

const FONTS = ['Rubik', 'Lato', 'Inter', 'Poppins', 'Montserrat', 'Manrope', 'DM Sans', 'Outfit', 'Plus Jakarta Sans', 'Playfair Display', 'Merriweather', 'Space Grotesk']

function useThemeCss(st: any) {
  const col = { primary: '#39a2da', accent: '#1d93d3', accentDark: '#6cc4f0', bgLight: '#f5f9fc', bgDark: '#050b12', ...(st.colors ?? {}) }
  const f = { heading: 'Rubik', body: 'Lato', ...(st.fonts ?? {}) }
  useEffect(() => {
    const fams = [...new Set([f.heading, f.body])].filter((x) => x !== 'Rubik' && x !== 'Lato')
    if (!fams.length) return
    const l = document.createElement('link'); l.rel = 'stylesheet'
    l.href = `https://fonts.googleapis.com/css2?${fams.map((x) => `family=${x.replace(/ /g, '+')}:wght@400;600;700;800`).join('&')}&display=swap`
    document.head.appendChild(l); return () => l.remove()
  }, [f.heading, f.body])
  return `:root{--primary:${col.primary};--accent:${col.accent};--background:${col.bgLight};--fd:'${f.heading}';--fb:'${f.body}'}
.dark{--primary:${col.primary};--accent:${col.accentDark};--background:${col.bgDark}}
[data-bg=plain] .bgdeco{display:none}`
}

function SettingsPanel({ onClose }: { onClose: () => void }) {
  const fonts = FONTS.map((x) => [x, x] as [string, string])
  return (
    <aside data-chrome className="fixed right-3 top-16 z-[56] max-h-[80vh] w-[min(92vw,380px)] overflow-y-auto rounded-3xl bg-bg p-5 shadow-2xl ring-1 ring-line">
      <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">Site settings</h2><button onClick={onClose} aria-label="Close" className="px-2">✕</button></div>
      <div className="grid gap-3">
        <Field p="settings.title" label="Browser tab title" />
        <Field p="deckName" label="Deck name (in the top dropdown)" />
        <p className="mt-2 text-sm font-semibold">Brand colours</p>
        <div className="grid grid-cols-2 gap-2">
          <Field p="settings.colors.primary" type="color" label="Primary" />
          <Field p="settings.colors.accent" type="color" label="Accent (light)" />
          <Field p="settings.colors.accentDark" type="color" label="Accent (dark)" />
          <Field p="settings.colors.bgLight" type="color" label="Background (light)" />
          <Field p="settings.colors.bgDark" type="color" label="Background (dark)" />
        </div>
        <p className="mt-2 text-sm font-semibold">Fonts</p>
        <div className="grid grid-cols-2 gap-2">
          <Field p="settings.fonts.heading" label="Headings" options={fonts} />
          <Field p="settings.fonts.body" label="Body text" options={fonts} />
        </div>
        <p className="mt-2 text-sm font-semibold">Button and label text</p>
        <Field p="settings.ui.present" label="Present button" />
        <Field p="settings.ui.exit" label="Exit presentation button" />
        <Field p="settings.ui.pdf" label="PDF button" />
        <Field p="settings.ui.journeysGroup" label="Journeys group in dropdown" />
        <p className="text-xs text-muted">Journey names, subtitles and screens are edited on each journey page (pick it in the top dropdown).</p>
      </div>
    </aside>
  )
}
