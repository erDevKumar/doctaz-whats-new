/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Ph } from '@/components/bits'
import defaults from '../public/content.json'

const REPO = 'erDevKumar/doctaz-whats-new'
const BRANCH = 'main'
const API = `https://api.github.com/repos/${REPO}`

// One build serves several decks, each deployed in its own directory, so the repo path to
// read and write has to come from where the page is actually served — a baked-in constant
// would make every deck edit (and overwrite) the first one.
const DECK_DIR = (() => {
  const segs = location.pathname.split('/').filter((s) => s && !s.endsWith('.html'))
  const i = segs.indexOf('doctaz-whats-new') // GitHub Pages serves under the repo name
  return (i >= 0 ? segs[i + 1] : segs[0]) || 'pitch'
})()
// Decks that also keep a copy of their content beside their source.
const SRC_MIRROR: Record<string, string> = {
  pitch: 'pitch-src/public/content.json',
  'pitch-neurogen': 'neurogen/content.json',
}
const CONTENT_PATHS = [`${DECK_DIR}/content.json`, ...(SRC_MIRROR[DECK_DIR] ? [SRC_MIRROR[DECK_DIR]] : [])]
// Namespaced per deck: a shared key would restore one deck's draft into another.
const DRAFT_KEY = `doctaz-pitch-draft:${DECK_DIR}`
const PUBLISHED_KEY = `doctaz-pitch-published:${DECK_DIR}`

export type Content = typeof defaults & { slides: Slide[]; savedAt?: number }
export type Slide = { id: string; type: string; label: string; hidden?: boolean; bg?: string; data: any }
export type SaveState = { kind: 'idle' | 'busy' | 'ok' | 'error'; text: string }

const store = {
  get: (k: string, s: Storage = localStorage) => { try { return s.getItem(k) } catch { return null } },
  set: (k: string, v: string, s: Storage = localStorage) => { try { s.setItem(k, v) } catch { /* private mode */ } },
  del: (k: string, s: Storage = localStorage) => { try { s.removeItem(k) } catch { /* private mode */ } },
}

// Media paths: bare paths live under ../img/, anything explicit is used as is.
export const media = (p: string, blobs?: Record<string, string>) =>
  blobs?.[p] ?? (/^(https?:|data:|blob:|\.\.?\/)/.test(p) ? p : `../img/${p}`)

const getAt = (o: any, path: string) => path.split('.').reduce((a, k) => a?.[k], o)
function setAt(o: any, path: string, v: any): any {
  const [k, ...rest] = path.split('.')
  const copy = Array.isArray(o) ? [...o] : { ...o }
  copy[k] = rest.length ? setAt(o?.[k] ?? {}, rest.join('.'), v) : v
  return copy
}
const fromB64 = (s: string) => decodeURIComponent(escape(atob(s.replace(/\n/g, ''))))
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

type Ctx = {
  c: Content; edit: boolean; dirty: boolean; token: string | null
  get: (p: string) => any; set: (p: string, v: any) => void
  src: (p: string) => string; upload: (p: string, f: File) => Promise<void>
  save: () => Promise<void>; login: (t: string) => Promise<string | null>; logout: () => void
  discard: () => void; busy: string; status: SaveState
}
const E = createContext<Ctx>(null as any)
export const useE = () => useContext(E)

// GitHub REST with no HTTP caching: its responses are cacheable for 60s, which served stale
// commit shas and made back-to-back saves fail.
async function ghFetch(token: string, path: string, init?: RequestInit) {
  const r = await fetch(API + path, { ...init, cache: 'no-store', headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...(init?.body ? { 'Content-Type': 'application/json' } : {}) } })
  const j = await r.json().catch(() => ({}))
  if (!r.ok) { const err = new Error(j.message || `HTTP ${r.status}`) as Error & { status: number }; err.status = r.status; throw err }
  return j
}

function explain(e: any) {
  const m = String(e?.message ?? e)
  if (e?.status === 401) return 'The access token was rejected (expired or revoked). Lock, then unlock with a new token.'
  if (e?.status === 403 || e?.status === 404) return `This token is not allowed to write to the deck repository (${m}). It needs "Contents: Read and write" on ${REPO}.`
  if (e?.status === 409 || e?.status === 422) return `Someone else saved at the same moment (${m}). Press Save again.`
  if (/Failed to fetch|NetworkError/i.test(m)) return 'Could not reach GitHub. Check the internet connection and press Save again.'
  return m
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const wantEdit = new URLSearchParams(location.search).has('edit')
  const [c, setC] = useState<Content>(defaults as Content)
  const [dirty, setDirty] = useState(false)
  const [token, setToken] = useState<string | null>(() => (wantEdit ? store.get('gh-token', sessionStorage) : null))
  const [blobs, setBlobs] = useState<Record<string, string>>({})
  const pending = useRef<Record<string, string>>({}) // repo path -> git blob sha, committed with the next save
  const [busy, setBusy] = useState('')
  const [status, setStatus] = useState<SaveState>({ kind: 'idle', text: '' })

  useEffect(() => {
    let alive = true
    const pick = (live: Content | null) => {
      // The Pages CDN caches content.json for ~10 minutes and ignores query strings, so a
      // browser that just published keeps the copy it saved until the CDN catches up.
      const mine = store.get(PUBLISHED_KEY)
      let own: Content | null = null
      try { own = mine ? JSON.parse(mine) : null } catch { own = null }
      if (own && (!live || (own.savedAt ?? 0) > (live.savedAt ?? 0))) return own
      if (own) store.del(PUBLISHED_KEY)
      return live
    }
    ;(async () => {
      let live: Content | null = null
      if (wantEdit && token) {
        // Editors read the repo directly so they always start from the latest saved version.
        try { const f = await ghFetch(token, `/contents/${CONTENT_PATHS[0]}?ref=${BRANCH}`); live = JSON.parse(fromB64(f.content)) } catch { live = null }
      }
      if (!live) live = await fetch(`./content.json?t=${Date.now()}`, { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)).catch(() => null)
      if (!alive) return
      const base = pick(live)
      const draft = wantEdit ? store.get(DRAFT_KEY) : null
      if (draft) { try { setC(JSON.parse(draft)); setDirty(true); return } catch { /* fall through */ } }
      if (base) setC(base)
    })()
    return () => { alive = false }
  }, [wantEdit, token])

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = '' }
    addEventListener('beforeunload', warn); return () => removeEventListener('beforeunload', warn)
  }, [dirty])

  const edit = wantEdit && !!token
  const set = useCallback((p: string, v: any) => {
    setC((prev) => { const next = setAt(prev, p, v); store.set(DRAFT_KEY, JSON.stringify(next)); return next })
    setDirty(true); setStatus((s) => (s.kind === 'ok' ? { kind: 'idle', text: '' } : s))
  }, [])

  const upload = useCallback(async (p: string, f: File) => {
    if (!token) return
    if (f.size > 25 * 1024 * 1024) { setStatus({ kind: 'error', text: `${f.name} is larger than 25 MB. Please use a smaller file.` }); return }
    const name = `uploads/${Date.now()}-${f.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-')}`
    setBlobs((b) => ({ ...b, [name]: URL.createObjectURL(f) }))
    setBusy(`Uploading ${f.name}…`)
    try {
      const data = await new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1]); r.onerror = rej; r.readAsDataURL(f) })
      const blob = await ghFetch(token, '/git/blobs', { method: 'POST', body: JSON.stringify({ content: data, encoding: 'base64' }) })
      pending.current[`img/${name}`] = blob.sha
      set(p, name)
    } catch (e) { setStatus({ kind: 'error', text: `Upload failed: ${explain(e)}` }) } finally { setBusy('') }
  }, [token, set])

  const waitLive = useCallback(async (savedAt: number) => {
    for (let i = 0; i < 40; i++) {
      await sleep(15000)
      const live = await fetch(`./content.json?t=${Date.now()}`, { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)).catch(() => null)
      if ((live?.savedAt ?? 0) >= savedAt) { store.del(PUBLISHED_KEY); setStatus({ kind: 'ok', text: '✓ Live for everyone.' }); return }
      setStatus({ kind: 'ok', text: `✓ Saved. Publishing to the live page… (${Math.round(((i + 1) * 15) / 60 * 10) / 10} min; usually 1–10 min)` })
    }
    setStatus({ kind: 'ok', text: '✓ Saved. The live page is taking longer than usual to refresh; it will update on its own.' })
  }, [])

  const save = useCallback(async () => {
    if (!token) return
    setBusy('Saving…'); setStatus({ kind: 'busy', text: 'Saving…' })
    const savedAt = Date.now()
    const next = { ...c, savedAt }
    const body = JSON.stringify(next, null, 1)
    try {
      // One atomic commit with both content copies and any uploaded media; retried once if
      // the branch moved underneath us.
      for (let attempt = 0; ; attempt++) {
        try {
          const ref = await ghFetch(token, `/git/ref/heads/${BRANCH}`)
          const head = await ghFetch(token, `/git/commits/${ref.object.sha}`)
          const tree = await ghFetch(token, '/git/trees', { method: 'POST', body: JSON.stringify({
            base_tree: head.tree.sha,
            tree: [
              ...CONTENT_PATHS.map((path) => ({ path, mode: '100644', type: 'blob', content: body })),
              ...Object.entries(pending.current).map(([path, sha]) => ({ path, mode: '100644', type: 'blob', sha })),
            ],
          }) })
          const commit = await ghFetch(token, '/git/commits', { method: 'POST', body: JSON.stringify({ message: 'Pitch deck: content edit', tree: tree.sha, parents: [ref.object.sha] }) })
          await ghFetch(token, `/git/refs/heads/${BRANCH}`, { method: 'PATCH', body: JSON.stringify({ sha: commit.sha }) })
          break
        } catch (e: any) { if (attempt === 0 && (e.status === 409 || e.status === 422)) continue; throw e }
      }
      pending.current = {}
      setC(next); store.del(DRAFT_KEY); store.set(PUBLISHED_KEY, body); setDirty(false)
      setStatus({ kind: 'ok', text: '✓ Saved. Publishing to the live page… (usually 1–10 min)' })
      void waitLive(savedAt)
    } catch (e) {
      setStatus({ kind: 'error', text: `Not saved: ${explain(e)} Your edits are kept in this browser.` })
    } finally { setBusy('') }
  }, [c, token, waitLive])

  const login = useCallback(async (t: string) => {
    const tok = t.trim()
    try {
      await ghFetch(tok, '')
      // A harmless write: an unreferenced blob proves the token can write without committing
      // anything. Reading the repo alone is not enough — a fine-grained token reports the
      // owner's push permission even when the token itself cannot write.
      await ghFetch(tok, '/git/blobs', { method: 'POST', body: JSON.stringify({ content: 'write-check', encoding: 'utf-8' }) })
    } catch (e: any) {
      if (e.status === 401) return 'That token was not accepted. Check it was copied completely.'
      if (e.status === 403 || e.status === 404) return `That token cannot write to the deck. When creating it, choose "Only select repositories" → ${REPO}, and set Repository permissions → Contents → "Read and write".`
      return `Could not check the token: ${explain(e)}`
    }
    store.set('gh-token', tok, sessionStorage); setToken(tok); return null
  }, [])

  const logout = useCallback(() => { store.del('gh-token', sessionStorage); setToken(null) }, [])
  const discard = useCallback(() => { store.del(DRAFT_KEY); pending.current = {}; location.reload() }, [])

  const v = useMemo<Ctx>(() => ({
    c, edit, dirty, token, busy, status, set, upload, save, login, logout, discard,
    get: (p) => getAt(c, p), src: (p) => media(p, blobs),
  }), [c, edit, dirty, token, busy, status, set, upload, save, login, logout, discard, blobs])
  return <E.Provider value={v}>{children}</E.Provider>
}

/** Editable text bound to a content path. `view` customises the non-edit rendering (animations). */
export function T({ p, as: Tag = 'span', className = '', view }: { p: string; as?: any; className?: string; view?: (s: string) => ReactNode }) {
  const { get, set, edit } = useE()
  const v = String(get(p) ?? '')
  if (edit) {
    return (
      <Tag contentEditable suppressContentEditableWarning spellCheck className={`${className} edit-t`} data-ph={v ? undefined : 'Type…'}
        onClick={(e: any) => e.stopPropagation()} onKeyDown={(e: any) => { if (e.key === 'Enter' && Tag !== 'p') { e.preventDefault(); e.currentTarget.blur() } }}
        onBlur={(e: any) => { const t = e.currentTarget.innerText.trim(); if (t !== v) set(p, t) }}>{v}</Tag>
    )
  }
  if (!v.trim()) return null
  if (/^\[.*\]$/.test(v.trim())) return <Tag className={className}><Ph>{v}</Ph></Tag>
  return view ? <>{view(v)}</> : <Tag className={className}>{v}</Tag>
}

/** Media slot: renders `render(url)`; in edit mode adds a Replace control. */
export function M({ p, render, accept = 'image/*,video/mp4', optional = false }: { p: string; render: (url: string, raw: string) => ReactNode; accept?: string; optional?: boolean }) {
  const { get, src, edit, upload, set } = useE()
  const raw = String(get(p) ?? '')
  const ref = useRef<HTMLInputElement>(null)
  if (!edit) return <>{render(src(raw), raw)}</>
  return (
    <div className="relative">
      {render(src(raw), raw)}
      <button type="button" onClick={(e) => { e.stopPropagation(); e.preventDefault(); ref.current?.click() }}
        className="absolute inset-x-2 bottom-2 z-30 rounded-full bg-black/75 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/30 backdrop-blur hover:bg-primary">
        ⬆ {raw ? 'Replace' : 'Add'} media
      </button>
      {optional && raw && <button type="button" onClick={(ev) => { ev.stopPropagation(); set(p, '') }} className="absolute right-1 top-1 z-30 edit-btn hover:!bg-red-600" title="Remove media">✕</button>}
      <input ref={ref} type="file" accept={accept} hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(p, f); e.target.value = '' }} />
    </div>
  )
}

/** Remove / move controls for one list item. */
export function ItemTools({ p, i }: { p: string; i: number }) {
  const { get, set, edit } = useE()
  if (!edit) return null
  const arr: any[] = get(p) ?? []
  const move = (d: number) => { const j = i + d; if (j < 0 || j >= arr.length) return; const a = [...arr]; [a[i], a[j]] = [a[j], a[i]]; set(p, a) }
  return (
    <span className="absolute right-1 top-1 z-40 flex gap-1 text-[11px]" onClick={(e) => e.stopPropagation()}>
      <button type="button" className="edit-btn" title="Move earlier" onClick={() => move(-1)}>↑</button>
      <button type="button" className="edit-btn" title="Move later" onClick={() => move(1)}>↓</button>
      <button type="button" className="edit-btn hover:!bg-red-600" title="Remove" onClick={() => { if (arr.length > 1 || confirm('Remove the last item?')) set(p, arr.filter((_, k) => k !== i)) }}>✕</button>
    </span>
  )
}

/** Adds a copy of the last item (or `blank`) to a list. */
export function AddItem({ p, blank, label = 'Add item' }: { p: string; blank?: any; label?: string }) {
  const { get, set, edit } = useE()
  if (!edit) return null
  const arr: any[] = get(p) ?? []
  const tmpl = blank ?? structuredClone(arr[arr.length - 1] ?? '')
  return <button type="button" className="edit-btn mt-4 !px-4 !py-2 text-sm" onClick={() => set(p, [...arr, tmpl])}>＋ {label}</button>
}

export const defaultContent = defaults as Content

/** Plain form field bound to a content path (for URLs, colours, settings). */
export function Field({ p, label, type = 'text', options, placeholder }: { p: string; label: string; type?: string; options?: [string, string][]; placeholder?: string }) {
  const { get, set } = useE()
  const v = String(get(p) ?? '')
  const cls = 'mt-1 w-full rounded-lg border border-line bg-bg px-2 py-1.5 text-sm text-text outline-none focus:border-primary'
  return (
    <label className="block text-xs text-muted">
      {label}
      {options ? <select className={cls} value={v} onChange={(e) => set(p, e.target.value)}>{options.map(([k, n]) => <option key={k} value={k}>{n}</option>)}</select>
        : <input type={type} className={`${cls} ${type === 'color' ? 'h-9 p-1' : ''}`} value={v} placeholder={placeholder} onChange={(e) => set(p, e.target.value)} />}
    </label>
  )
}

/** Button/link row. Each link: label (inline editable), href and style (edited in a small popover row). */
export function Links({ p, className = '' }: { p: string; className?: string }) {
  const { get, edit } = useE()
  const links: any[] = get(p) ?? []
  if (!edit && !links.length) return null
  return (
    <div className={`mt-8 flex flex-wrap items-start gap-3 ${className}`}>
      {links.map((l, k) => {
        const cls = l.style === 'primary' ? 'bg-primary text-white shadow-[0_0_24px_color-mix(in_srgb,var(--primary)_45%,transparent)]' : 'glass'
        return edit ? (
          <div key={k} className="relative rounded-2xl border border-dashed border-line p-2 pr-24">
            <ItemTools p={p} i={k} />
            <T p={`${p}.${k}.label`} className={`inline-block rounded-full px-5 py-2.5 font-semibold ${cls}`} />
            <div className="mt-2 grid w-56 gap-1"><Field p={`${p}.${k}.href`} label="Link (URL, #page-id, #journey-0 or mailto:)" /><Field p={`${p}.${k}.style`} label="Style" options={[['primary', 'Filled'], ['ghost', 'Outline']]} /></div>
          </div>
        ) : (
          <a key={k} href={l.href} target={/^https?:/.test(l.href) ? '_blank' : undefined} rel="noreferrer"
            onClick={(ev) => { if (String(l.href).startsWith('#journey-')) { ev.preventDefault(); location.hash = l.href; location.reload() } }}
            className={`inline-block rounded-full px-5 py-2.5 font-semibold transition hover:scale-[1.03] ${cls}`}>{/^\[.*\]$/.test(l.label) ? <Ph>{l.label}</Ph> : l.label}</a>
        )
      })}
      {edit && <AddItem p={p} blank={{ label: 'New button', href: 'https://', style: 'ghost' }} label="Add button" />}
    </div>
  )
}
