/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import { layouts } from '@/slides'
import { ContentProvider, useE, T, M, ItemTools, AddItem, type Slide } from '@/edit'
import { Phone, Blob } from '@/components/bits'

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
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const slides = (c.slides as Slide[]).map((s, i) => ({ ...s, i })).filter((s) => edit || !s.hidden)

  useEffect(() => { document.documentElement.classList.toggle('dark', dark); store.set('theme', dark ? 'dark' : 'light') }, [dark])
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
      <div key={s.id} className={`relative ${s.hidden ? 'opacity-40' : ''}`}>
        {edit && <span className="absolute left-2 top-16 z-40 rounded-full bg-black/70 px-3 py-1 text-xs text-white">Page {s.i + 1} · {layouts[s.type]?.name ?? s.type}{s.hidden ? ' · hidden' : ''}</span>}
        <L.C id={s.id} b={`slides.${s.i}.data`} d={s.data} />
      </div>
    )
  }

  return (
    <>
      {!present && view < 0 && <motion.div data-chrome className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-primary to-accent" style={{ scaleX: bar }} />}
      <header data-chrome className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-2 px-3 py-3 text-sm sm:px-4 ${present ? 'pointer-events-none opacity-0 transition hover:pointer-events-auto hover:opacity-100 focus-within:pointer-events-auto focus-within:opacity-100' : ''}`}>
        <label className="glass flex items-center gap-2 rounded-full py-1 pl-4 pr-2">
          <span className="sr-only">Choose view</span>
          <select value={view} onChange={(e) => { setPresent(false); setView(Number(e.target.value)); scrollTo(0, 0) }}
            className="max-w-[44vw] cursor-pointer bg-transparent py-1 font-display font-semibold outline-none">
            <option value={-1}>{c.deckName}</option>
            <optgroup label="User journeys">
              {c.journeys.map((j: any, k: number) => <option key={k} value={k}>{j.name}</option>)}
            </optgroup>
          </select>
        </label>
        <div className="flex items-center gap-2">
          <button onClick={startPresent} className="rounded-full bg-primary px-4 py-2 font-semibold text-white shadow-[0_0_24px_color-mix(in_srgb,var(--primary)_50%,transparent)]" title="P">
            {present ? '✕ Exit' : '▶ Present as slides'}
          </button>
          {!present && <button onClick={exportPdf} className="glass hidden rounded-full px-4 py-2 sm:block" title="Save as PDF">PDF</button>}
          <button onClick={() => setDark((d) => !d)} className="glass rounded-full px-3 py-2" aria-label="Toggle theme" title="T">{dark ? '☀' : '☾'}</button>
        </div>
      </header>

      <EditBar onPages={() => setPages((p) => !p)} />
      {pages && edit && <PagesPanel onClose={() => setPages(false)} />}

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
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-primary">Clickable prototype</p>
          <T p={`journeys.${k}.name`} as="h1" className="block text-4xl font-bold sm:text-5xl" />
          <p className="mt-3 text-muted">Tap the phone or use ← → to move through the flow. Real Android screens.</p>
          <ol className="mt-8 grid gap-1 sm:grid-cols-2">
            {j.steps.map((_: any, s: number) => (
              <li key={s} className="relative">
                <ItemTools p={p} i={s} />
                <div role="button" tabIndex={0} onClick={() => setI(s)} onKeyDown={(e) => e.key === 'Enter' && setI(s)}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 pr-20 transition ${s === at ? 'glass' : 'opacity-60 hover:opacity-100'}`}>
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${s === at ? 'bg-primary text-white' : 'border border-line'}`}>{s + 1}</span>
                  <T p={`${p}.${s}.t`} className="font-display text-sm font-semibold" />
                </div>
              </li>
            ))}
          </ol>
          <AddItem p={p} label="Add screen" />
          {edit && (
            <div className="mt-6 flex flex-wrap gap-2 text-sm">
              <button type="button" className="edit-btn !px-4 !py-2" onClick={() => set('journeys', [...c.journeys, { name: 'New journey', steps: [{ t: 'First screen', a: 'signup/android-1-register-as.jpg' }] }])}>＋ New journey</button>
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
        </div>
      </div>
    </section>
  )
}

function EditBar({ onPages }: { onPages: () => void }) {
  const { edit, dirty, busy, save, login, logout, discard, token } = useE()
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
      {edit && dirty && <button className="rounded-full px-3 py-1 hover:bg-white/10" onClick={() => confirm('Discard all unsaved changes?') && discard()}>Discard</button>}
      <button disabled={!dirty || !!busy} className="rounded-full bg-primary px-4 py-1 font-semibold disabled:opacity-40" onClick={async () => setMsg(await save())}>{busy || (dirty ? 'Save & publish' : 'Saved')}</button>
      <button className="rounded-full px-3 py-1 text-white/60 hover:bg-white/10" onClick={logout}>Lock</button>
      {msg && <span className="basis-full px-2 text-center text-xs text-white/80" role="status">{msg}</span>}
    </div>
  )
}

function PagesPanel({ onClose }: { onClose: () => void }) {
  const { c, set } = useE()
  const [type, setType] = useState('statement')
  return (
    <aside data-chrome className="fixed right-3 top-16 z-[56] max-h-[80vh] w-[min(92vw,360px)] overflow-y-auto rounded-3xl bg-bg p-5 shadow-2xl ring-1 ring-line">
      <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">Pages</h2><button onClick={onClose} aria-label="Close" className="px-2">✕</button></div>
      <ol className="space-y-2">
        {c.slides.map((s: any, i: number) => (
          <li key={s.id} className="relative flex items-center gap-2 rounded-xl border border-line p-2 pr-24 text-sm">
            <ItemTools p="slides" i={i} />
            <button title={s.hidden ? 'Show page' : 'Hide page'} onClick={() => set(`slides.${i}.hidden`, !s.hidden)} className="w-6 shrink-0">{s.hidden ? '◌' : '●'}</button>
            <div className="min-w-0">
              <a href={`#${s.id}`} className="block truncate"><T p={`slides.${i}.label`} className="font-semibold" /></a>
              <span className="text-xs text-muted">{layouts[s.type]?.name ?? s.type}</span>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-5 rounded-2xl border border-dashed border-line p-3">
        <p className="mb-2 text-sm font-semibold">Add a page</p>
        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-lg border border-line bg-bg px-2 py-2 text-sm">
          {Object.entries(layouts).map(([k, l]) => <option key={k} value={k}>{l.name}</option>)}
        </select>
        <button className="mt-3 w-full rounded-full bg-primary py-2 text-sm font-semibold text-white" onClick={() => {
          const id = `page-${Date.now().toString(36)}`
          set('slides', [...c.slides, { id, type, label: layouts[type].name, data: layouts[type].template() }])
          setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300)
        }}>＋ Add at the end</button>
        <p className="mt-2 text-xs text-muted">Use ↑ ↓ to reorder, ● to hide a page without deleting it, ✕ to delete.</p>
      </div>
    </aside>
  )
}
