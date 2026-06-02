'use client'
import { useState } from 'react'
import { Bell, Pencil, Trash2, X } from 'lucide-react'

export interface AnnouncementRow {
  id: string
  title: string
  content: string
  priority: string
  createdAt: string // ISO string
}

const priorityColor: Record<string, string> = {
  URGENT: 'badge-red',
  HIGH: 'badge-gold',
  NORMAL: 'badge-cyan',
  LOW: 'badge-green',
}

type EditForm = {
  title: string
  content: string
  priority: string
}

export default function AnnouncementsManager({ initialAnnouncements }: { initialAnnouncements: AnnouncementRow[] }) {
  const [items, setItems] = useState<AnnouncementRow[]>(initialAnnouncements)
  const [busyId, setBusyId] = useState<string | null>(null)

  const [editing, setEditing] = useState<AnnouncementRow | null>(null)
  const [editForm, setEditForm] = useState<EditForm | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const refresh = async () => {
    const res = await fetch('/api/admin/announcements')
    const data = await res.json()
    if (Array.isArray(data)) {
      setItems(
        data.map((a: any): AnnouncementRow => ({
          id: a.id,
          title: a.title,
          content: a.content,
          priority: a.priority,
          createdAt: a.createdAt,
        }))
      )
    }
  }

  const deleteItem = async (a: AnnouncementRow) => {
    if (!confirm(`Delete "${a.title}"? Yeh action wapas nahi hoga.`)) return
    setBusyId(a.id)
    try {
      await fetch(`/api/admin/announcements?id=${a.id}`, { method: 'DELETE' })
      setItems((prev) => prev.filter((x) => x.id !== a.id))
    } finally {
      setBusyId(null)
    }
  }

  const openEdit = (a: AnnouncementRow) => {
    setError('')
    setEditing(a)
    setEditForm({ title: a.title ?? '', content: a.content ?? '', priority: a.priority ?? 'NORMAL' })
  }

  const saveEdit = async () => {
    if (!editing || !editForm) return
    if (!editForm.title || !editForm.content) {
      setError('Title aur content required hai!')
      return
    }
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editing.id, ...editForm }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setEditing(null)
        setEditForm(null)
        await refresh()
      }
    } catch {
      setError('Kuch ghalat hua!')
    } finally {
      setSaving(false)
    }
  }

  const setField = (key: keyof EditForm, value: string) =>
    setEditForm((p) => (p ? { ...p, [key]: value } : p))

  return (
    <>
      {items.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-2xl">
          <Bell size={48} className="mx-auto mb-4 opacity-20 text-yellow-400" />
          <p style={{ color: 'var(--text-muted)' }}>Koi announcement nahi hai</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((a) => {
            const busy = busyId === a.id
            return (
              <div key={a.id} className="glass-card rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`badge ${priorityColor[a.priority] ?? 'badge-cyan'}`}>{a.priority}</span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {new Date(a.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{a.title}</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{a.content}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => openEdit(a)}
                      disabled={busy}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors disabled:opacity-50"
                      style={{ color: 'var(--cyan)', borderColor: 'rgba(37,99,235,0.3)' }}
                    >
                      <Pencil size={13} /> Edit
                    </button>
                    <button
                      onClick={() => deleteItem(a)}
                      disabled={busy}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 border border-red-400/40 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editing && editForm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60"
          style={{ backdropFilter: 'blur(4px)' }}
          onClick={() => { if (!saving) { setEditing(null); setEditForm(null) } }}
        >
          <div
            className="glass-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b rounded-t-2xl"
                 style={{ background: '#ffffff', borderColor: 'var(--border)' }}>
              <h2 className="font-display font-bold text-xl text-slate-900 flex items-center gap-2">
                <Pencil size={18} className="text-yellow-500" /> Edit Announcement
              </h2>
              <button onClick={() => { setEditing(null); setEditForm(null) }}
                className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-black/5 transition-colors"
                style={{ color: 'var(--text-secondary)' }} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Title *</label>
                <input type="text" value={editForm.title} onChange={(e) => setField('title', e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Priority *</label>
                <select value={editForm.priority} onChange={(e) => setField('priority', e.target.value)} className="input-field">
                  <option value="LOW" style={{ background: '#040d2a' }}>Low</option>
                  <option value="NORMAL" style={{ background: '#040d2a' }}>Normal</option>
                  <option value="HIGH" style={{ background: '#040d2a' }}>High</option>
                  <option value="URGENT" style={{ background: '#040d2a' }}>Urgent</option>
                </select>
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Content *</label>
                <textarea rows={5} value={editForm.content} onChange={(e) => setField('content', e.target.value)} className="input-field resize-none" />
              </div>

              {error && <div className="text-red-400 text-xs text-center p-2 rounded-lg bg-red-400/10">{error}</div>}

              <div className="flex items-center gap-2 pt-2">
                <button onClick={saveEdit} disabled={saving} className="btn-primary justify-center py-3 px-6 disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={() => { setEditing(null); setEditForm(null) }} disabled={saving} className="btn-outline text-sm">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
