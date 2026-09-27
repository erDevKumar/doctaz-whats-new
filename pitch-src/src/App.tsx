import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { slides } from '@/slides'

const store = {
  get: (k: string) => { try { return localStorage.getItem(k) } catch { return null } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v) } catch { /* private mode */ } },
}

export default function App() {
  const [dark, setDark] = useState(() => (store.get('theme') ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark')
  const [present, setPresent] = useState(() => new URLSearchParams(location.search).has('present'))
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  useEffect(() => { document.documentElement.classList.toggle('dark', dark); store.set('theme', dark ? 'dark' : 'light') }, [dark])
  useEffect(() => { document.documentElement.style.scrollSnapType = present ? 'y mandatory' : '' }, [present])

  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>('[data-slide]')]
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(els.indexOf(e.target as HTMLElement))), { threshold: 0.5 })
    els.forEach((e) => { e.style.scrollSnapAlign = 'start'; io.observe(e) })
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const go = (i: number) => document.querySelectorAll('[data-slide]')[Math.max(0, Math.min(slides.length - 1, i))]?.scrollIntoView({ behavior: 'smooth' })
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input,textarea')) return
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key) && present) { e.preventDefault(); go(active + 1) }
      if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key) && present) { e.preventDefault(); go(active - 1) }
      if (e.key === 'p' || e.key === 'P') setPresent((p) => !p)
      if (e.key === 'f' || e.key === 'F') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {})
      if (e.key === 't' || e.key === 'T') setDark((d) => !d)
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [active, present])

  return (
    <>
      <motion.div className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-primary to-accent" style={{ scaleX: bar }} />
      <div className="fixed right-4 top-4 z-50 flex gap-2 text-sm">
        <button onClick={() => setPresent((p) => !p)} className="glass rounded-full px-4 py-2" title="P">{present ? 'Scroll mode' : 'Present'}</button>
        <button onClick={() => setDark((d) => !d)} className="glass rounded-full px-3 py-2" aria-label="Toggle theme" title="T">{dark ? '☀' : '☾'}</button>
      </div>
      <nav className="fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-2 md:flex" aria-label="Slides">
        {slides.map((s, i) => (
          <a key={s.id} href={`#${s.id}`} title={s.label} aria-label={s.label}
            className={`h-2.5 w-2.5 rounded-full transition-all ${i === active ? 'h-6 bg-primary' : 'bg-muted/40 hover:bg-muted'}`} />
        ))}
      </nav>
      {present && <div className="fixed bottom-4 left-4 z-50 font-display text-sm text-muted">{active + 1} / {slides.length} · {slides[active]?.label}</div>}
      <main>{slides.map(({ id, C }) => <C key={id} />)}</main>
    </>
  )
}
