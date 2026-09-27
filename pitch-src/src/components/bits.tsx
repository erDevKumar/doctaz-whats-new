import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { Tilt } from '@/components/ui/tilt'
import { InView } from '@/components/ui/in-view'

// Haikei-style shapes: seeded blob and layered waves, generated like haikei.app's exports.
function rng(seed: number) { return () => ((seed = (seed * 16807) % 2147483647) / 2147483647) }
export function blobPath(seed: number, n = 7, r = 180) {
  const rand = rng(seed)
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2, rr = r * (0.7 + rand() * 0.45)
    return [200 + Math.cos(a) * rr, 200 + Math.sin(a) * rr]
  })
  let d = ''
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n]
    if (!i) d += `M${p1[0]},${p1[1]}`
    d += `C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`
  }
  return d + 'Z'
}

export function Blob({ className, seeds = [3, 11, 29], color = 'var(--primary)' }: { className?: string; seeds?: number[]; color?: string }) {
  return (
    <motion.svg viewBox="0 0 400 400" className={`pointer-events-none absolute blur-3xl ${className}`} aria-hidden
      animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}>
      <motion.path fill={color} d={blobPath(seeds[0])} initial={{ d: blobPath(seeds[0]) }} animate={{ d: seeds.map((s) => blobPath(s)) .concat(blobPath(seeds[0])) }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />
    </motion.svg>
  )
}

export function Waves({ flip }: { flip?: boolean }) {
  const layers = ['var(--primary)', 'var(--accent)', 'var(--secondary)']
  return (
    <svg viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden
      className={`pointer-events-none absolute inset-x-0 h-40 w-full opacity-30 ${flip ? 'top-0 rotate-180' : 'bottom-0'}`}>
      {layers.map((c, i) => (
        <path key={i} fill={c} opacity={0.5 + i * 0.2}
          d={`M0 ${120 + i * 30} C 240 ${60 + i * 40}, 480 ${190 - i * 20}, 720 ${130 + i * 20} S 1200 ${70 + i * 30}, 1440 ${140 + i * 20} V220 H0Z`} />
      ))}
    </svg>
  )
}

export function Phone({ src, url, className = '', tilt = true, alt = '' }: { src: string; url?: string; className?: string; tilt?: boolean; alt?: string }) {
  const u = url ?? `../img/${src}`
  const body = (
    <div className={`rounded-[2.2rem] border-[6px] border-neutral-900 bg-neutral-900 shadow-2xl shadow-[color-mix(in_srgb,var(--primary)_35%,transparent)] overflow-hidden ${className}`}>
      {src.endsWith('.mp4')
        ? <video src={u} aria-label={alt} autoPlay muted loop playsInline preload="metadata" className="block h-full w-full object-cover object-top" />
        : <img src={u} alt={alt} loading="lazy" className="block h-full w-full object-cover object-top" />}
    </div>
  )
  return tilt ? <Tilt rotationFactor={8} isRevese>{body}</Tilt> : body
}

export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <InView once viewOptions={{ margin: '0px 0px -15% 0px' }}
      variants={{ hidden: { opacity: 0, y: 40, filter: 'blur(8px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)' } }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </InView>
  )
}

export function Ph({ children }: { children: ReactNode }) {
  return <span className="ph" title="Placeholder: fill in src/data/content.ts">{children}</span>
}

export function Section({ id, children, className = '', bg }: { id: string; children: ReactNode; className?: string; bg?: ReactNode }) {
  return (
    <section id={id} data-slide className={`relative flex min-h-screen w-full items-center overflow-hidden px-4 py-24 sm:px-10 ${className}`}>
      {bg}
      <div className="relative z-10 mx-auto w-full max-w-6xl">{children}</div>
    </section>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-primary">{children}</p>
}
