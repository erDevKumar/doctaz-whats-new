/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Ph } from '@/components/bits'
import defaults from '../public/content.json'

const REPO = 'erDevKumar/doctaz-whats-new'
const API = `https://api.github.com/repos/${REPO}/contents/`
const CONTENT_PATHS = ['pitch/content.json', 'pitch-src/public/content.json']
const DRAFT_KEY = 'doctaz-pitch-draft'

export type Content = typeof defaults & { slides: Slide[] }
export type Slide = { id: string; type: string; label: string; hidden?: boolean; bg?: string; data: any }

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
const b64 = (s: string) => btoa(unescape(encodeURIComponent(s)))

type Ctx = {
  c: Content; edit: boolean; dirty: boolean; token: string | null
  get: (p: string) => any; set: (p: string, v: any) => void
  src: (p: string) => string; upload: (p: string, f: File) => Promise<void>
  save: () => Promise<string>; login: (t: string) => Promise<string | null>; logout: () => void
  discard: () => void; busy: string
}
const E = createContext<Ctx>(null as any)
export const useE = () => useContext(E)

export function ContentProvider({ children }: { children: ReactNode }) {
  const wantEdit = new URLSearchParams(location.search).has('edit')
  const [c, setC] = useState<Content>(defaults as Content)
  const [dirty, setDirty] = useState(false)
  const [token, setToken] = useState<string | null>(() => (wantEdit ? store.get('gh-token', sessionStorage) : null))
  const [blobs, setBlobs] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState('')
  const loaded = useRef(false)

  useEffect(() => {
    fetch(`./content.json?t=${Date.now()}`).then((r) => (r.ok ? r.json() : null)).catch(() => null).then((live) => {
      const draft = wantEdit ? store.get(DRAFT_KEY) : null
      if (draft) { try { setC(JSON.parse(draft)); setDirty(true) } catch { if (live) setC(live) } }
      else if (live) setC(live)
      loaded.current = true
    })
  }, [wantEdit])

  const edit = wantEdit && !!token
  const set = useCallback((p: string, v: any) => {
    setC((prev) => { const next = setAt(prev, p, v); store.set(DRAFT_KEY, JSON.stringify(next)); return next })
    setDirty(true)
  }, [])

  const gh = useCallback(async (path: string, init?: RequestInit) => {
    const r = await fetch(API + path, { ...init, headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', ...(init?.headers ?? {}) } })
    if (!r.ok && r.status !== 404) throw new Error(`${r.status} ${(await r.json().catch(() => ({}))).message ?? ''}`)
    return r.status === 404 ? null : r.json()
  }, [token])

  const put = useCallback(async (path: string, base64: string, message: string) => {
    const cur = await gh(path)
    await gh(path, { method: 'PUT', body: JSON.stringify({ message, content: base64, sha: cur?.sha }) })
  }, [gh])

  const upload = useCallback(async (p: string, f: File) => {
    const name = `uploads/${Date.now()}-${f.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-')}`
    setBlobs((b) => ({ ...b, [name]: URL.createObjectURL(f) }))
    setBusy(`Uploading ${f.name}…`)
    try {
      const data = await new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1]); r.onerror = rej; r.readAsDataURL(f) })
      await put(`img/${name}`, data, `Pitch deck: upload ${f.name}`)
      set(p, name)
    } catch (e) { alert(`Upload failed: ${(e as Error).message}`) } finally { setBusy('') }
  }, [put, set])

  const save = useCallback(async () => {
    setBusy('Saving…')
    try {
      const body = b64(JSON.stringify(c, null, 1))
      for (const path of CONTENT_PATHS) await put(path, body, 'Pitch deck: content edit')
      store.del(DRAFT_KEY); setDirty(false)
      return 'Saved. The live deck updates for everyone in about a minute.'
    } catch (e) { return `Save failed: ${(e as Error).message}` } finally { setBusy('') }
  }, [c, put])

  const login = useCallback(async (t: string) => {
    const r = await fetch(`https://api.github.com/repos/${REPO}`, { headers: { Authorization: `Bearer ${t.trim()}` } }).catch(() => null)
    if (!r?.ok) return 'That token cannot open the deck repository.'
    const j = await r.json()
    if (!j.permissions?.push) return 'That token can read but not write. Give it "Contents: Read and write" on this repo.'
    store.set('gh-token', t.trim(), sessionStorage); setToken(t.trim()); return null
  }, [])

  const logout = useCallback(() => { store.del('gh-token', sessionStorage); setToken(null) }, [])
  const discard = useCallback(() => { store.del(DRAFT_KEY); location.reload() }, [])

  const v = useMemo<Ctx>(() => ({
    c, edit, dirty, token, busy, set, upload, save, login, logout, discard,
    get: (p) => getAt(c, p), src: (p) => media(p, blobs),
  }), [c, edit, dirty, token, busy, set, upload, save, login, logout, discard, blobs])
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
