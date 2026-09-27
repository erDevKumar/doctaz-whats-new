import { motion } from 'motion/react'

// Rough continental outline (lon, lat) — decorative, not survey-grade.
const outline: [number, number][] = [
  [-17, 21], [-16, 28], [-10, 30], [-6, 35.8], [3, 36.9], [10, 37.3], [11, 33], [20, 31], [25, 31.6], [32, 31.3], [34.5, 28],
  [37, 22], [39, 16], [43, 12.5], [51, 11.8], [48, 5], [41, -2], [39.5, -7], [40.5, -11], [40.5, -15.5], [35.5, -23.5],
  [32.8, -26], [30, -31.5], [25.5, -34], [20, -34.8], [18.4, -33.9], [15, -27], [11.8, -17], [13.5, -12], [12.2, -6],
  [9, -1], [9.5, 3.5], [8.5, 4.5], [6, 4.3], [1, 5.8], [-4, 5.2], [-8, 4.4], [-13, 8], [-15.2, 11], [-17.5, 14.7],
]
const cities: [string, number, number][] = [
  ['Lagos', 3.4, 6.5], ['Accra', -0.2, 5.6], ['Dakar', -17.4, 14.7], ['Nairobi', 36.8, -1.3], ['Kampala', 32.6, 0.3],
  ['Kigali', 30.1, -1.9], ['Addis Ababa', 38.7, 9], ['Cairo', 31.2, 30], ['Kinshasa', 15.3, -4.3], ['Dar es Salaam', 39.3, -6.8],
  ['Johannesburg', 28, -26.2], ['Abidjan', -4, 5.3], ['Douala', 9.7, 4],
]
const links: [number, number][] = [[0, 3], [0, 1], [3, 4], [4, 5], [3, 6], [0, 7], [0, 8], [8, 10], [3, 9], [2, 11], [11, 0], [12, 0], [12, 8], [6, 7], [9, 10]]

const W = 500, H = 540
const px = (lon: number) => ((lon + 20) / 75) * W
const py = (lat: number) => ((38 - lat) / 75) * H

function inside(x: number, y: number) {
  let c = false
  for (let i = 0, j = outline.length - 1; i < outline.length; j = i++) {
    const [xi, yi] = [px(outline[i][0]), py(outline[i][1])], [xj, yj] = [px(outline[j][0]), py(outline[j][1])]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}
const dots: [number, number][] = []
for (let y = 6; y < H; y += 11) for (let x = 6; x < W; x += 11) if (inside(x, y)) dots.push([x, y])

export function AfricaMap() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Doctaz network across African cities">
      <defs>
        <radialGradient id="glow"><stop offset="0" stopColor="var(--accent)" stopOpacity=".9" /><stop offset="1" stopColor="var(--accent)" stopOpacity="0" /></radialGradient>
      </defs>
      {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.7} fill="var(--muted)" opacity={0.35} />)}
      {links.map(([a, b], i) => {
        const [x1, y1, x2, y2] = [px(cities[a][1]), py(cities[a][2]), px(cities[b][1]), py(cities[b][2])]
        const d = `M${x1},${y1} Q${(x1 + x2) / 2},${Math.min(y1, y2) - 40} ${x2},${y2}`
        return (
          <g key={i}>
            <motion.path d={d} fill="none" stroke="var(--primary)" strokeWidth={1.4} strokeOpacity={0.7}
              initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, delay: 0.3 + i * 0.12 }} />
            <circle r={2.6} fill="var(--accent)">
              <animateMotion dur={`${2.4 + (i % 4) * 0.6}s`} begin={`${i * 0.3}s`} repeatCount="indefinite" path={d} />
            </circle>
          </g>
        )
      })}
      {cities.map(([n, lon, lat], i) => (
        <g key={n} transform={`translate(${px(lon)},${py(lat)})`}>
          <circle r={14} fill="url(#glow)">
            <animate attributeName="r" values="4;16;4" dur="3s" begin={`${i * 0.25}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0;1" dur="3s" begin={`${i * 0.25}s`} repeatCount="indefinite" />
          </circle>
          <circle r={3.5} fill="var(--accent)" />
          <text x={7} y={-6} fontSize={10} fill="var(--text)" fontFamily="Rubik" opacity={0.8}>{n}</text>
        </g>
      ))}
    </svg>
  )
}
