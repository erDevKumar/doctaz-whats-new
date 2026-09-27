import { motion } from 'motion/react'

const nodes = [
  { id: 'and', x: 90, y: 90, t: 'Android app', s: 'Kotlin · Compose' },
  { id: 'ios', x: 90, y: 290, t: 'iPhone app', s: 'Swift · CallKit' },
  { id: 'sdk', x: 330, y: 190, t: 'Doctaz SDK', s: 'Swift + Kotlin' },
  { id: 'api', x: 590, y: 90, t: 'api.doctaz.com', s: 'Auth · pricing · wallet' },
  { id: 'pulse', x: 590, y: 300, t: 'pulse realtime', s: 'Socket.IO · chat · signalling' },
  { id: 'rtc', x: 850, y: 190, t: 'WebRTC media', s: 'HD video · group calls' },
  { id: 'push', x: 850, y: 360, t: 'Push (FCM/APNs)', s: 'Rings when the app is closed' },
]
const edges = [['api', 'rtc'], ['and', 'sdk'], ['ios', 'sdk'], ['sdk', 'api'], ['sdk', 'pulse'], ['pulse', 'rtc'], ['pulse', 'push']]
const at = (id: string) => nodes.find((n) => n.id === id)!

export function Arch({ labels }: { labels?: { t: string; s: string }[] }) {
  return (
    <svg viewBox="0 0 980 440" className="w-full" role="img" aria-label="Doctaz architecture: apps, shared SDK, API, realtime network, WebRTC media and push">
      <defs>
        <linearGradient id="eg" x1="0" x2="1"><stop offset="0" stopColor="var(--primary)" /><stop offset="1" stopColor="var(--accent)" /></linearGradient>
      </defs>
      {edges.map(([a, b], i) => {
        const A = at(a), B = at(b)
        const d = `M${A.x + 70},${A.y} C${(A.x + B.x) / 2 + 35},${A.y} ${(A.x + B.x) / 2 + 35},${B.y} ${B.x - 70},${B.y}`
        return (
          <g key={i}>
            <motion.path d={d} fill="none" stroke="url(#eg)" strokeWidth={2} initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
              viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 + i * 0.15 }} />
            <circle r={4} fill="var(--accent)">
              <animateMotion dur={`${2 + (i % 3)}s`} repeatCount="indefinite" path={d} />
            </circle>
          </g>
        )
      })}
      {nodes.map((n, i) => (
        <motion.g key={n.id} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          transition={{ delay: i * 0.1 }} style={{ transformOrigin: `${n.x}px ${n.y}px` }}>
          <rect x={n.x - 70} y={n.y - 30} width={140} height={60} rx={14} fill="var(--card)" stroke="var(--primary)" strokeOpacity={0.5} />
          <text x={n.x} y={n.y - 4} textAnchor="middle" fontFamily="Rubik" fontWeight={600} fontSize={13} fill="var(--text)">{labels?.[i]?.t ?? n.t}</text>
          <text x={n.x} y={n.y + 14} textAnchor="middle" fontSize={10} fill="var(--muted)">{labels?.[i]?.s ?? n.s}</text>
        </motion.g>
      ))}
    </svg>
  )
}
