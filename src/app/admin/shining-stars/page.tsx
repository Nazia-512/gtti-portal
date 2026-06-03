'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Star, ArrowLeft, Plus, Trash2, Pencil, X, GraduationCap, Award, Hash, Sparkles
} from 'lucide-react'

const DEPARTMENTS = [
  'Computer Technology', 'Electronics', 'Electrical Technology',
  'Civil Technology', 'Mechanical Technology', 'Welding Technology',
  'HVACR', 'Auto Mechanic', 'Plumbing'
]

interface ShiningStar {
  id: string
  name: string
  photo: string | null
  department: string
  batch: string
  position: string | null
  company: string | null
  story: string | null
  skills: string
  rollNumber: string | null
  gpa: number | null
  createdAt?: string
}

type EditForm = {
  name: string
  department: string
  batch: string
  position: string
  company: string
  story: string
  skills: string
  rollNumber: string
  gpa: string
  photo: string
}

const initials = (name: string): string =>
  name.split(' ').map((n) => n[0]).join('').slice(0, 2)

export default function ShiningStarsAdminPage() {
  const [shiningStars, setShiningStars] = useState<ShiningStar[]>([])
  const [loading, setLoading] = useState(true)

  // Detail modal
  const [selected, setSelected] = useState<ShiningStar | null>(null)

  // Edit modal
  const [editing, setEditing] = useState<ShiningStar | null>(null)
  const [editForm, setEditForm] = useState<EditForm | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadStars = () => {
    fetch('/api/admin/shining-stars/list')
      .then((r) => r.json())
      .then((d) => { setShiningStars(d.stars || []); setLoading(false) })
  }

  useEffect(() => { loadStars() }, [])

  const deleteStar = async (id: string) => {
    if (!confirm('Are you sure you want to delete this?')) return
    await fetch(`/api/admin/shining-stars/list?id=${id}`, { method: 'DELETE' })
    setShiningStars((prev) => prev.filter((s) => s.id !== id))
    setSelected(null)
  }

  const openEdit = (star: ShiningStar) => {
    setError('')
    setEditing(star)
    setEditForm({
      name: star.name ?? '',
      department: star.department ?? '',
      batch: star.batch ?? '',
      position: star.position ?? '',
      company: star.company ?? '',
      story: star.story ?? '',
      skills: star.skills ?? '',
      rollNumber: star.rollNumber ?? '',
      gpa: star.gpa != null ? String(star.gpa) : '',
      photo: star.photo ?? '',
    })
  }

  const saveEdit = async () => {
    if (!editing || !editForm) return
    if (!editForm.name || !editForm.department || !editForm.batch) {
      setError('Name, Department and Batch are required!')
      return
    }
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/shining-stars/list', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editing.id,
          ...editForm,
          gpa: editForm.gpa ? parseFloat(editForm.gpa) : null,
        }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setEditing(null)
        setEditForm(null)
        setSelected(null)
        loadStars()
      }
    } catch {
      setError('Something went wrong!')
    } finally {
      setSaving(false)
    }
  }

  const setField = (key: keyof EditForm, value: string) =>
    setEditForm((p) => (p ? { ...p, [key]: value } : p))

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm mb-8 hover:text-cyan-400 transition-colors"
              style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-amber-600/20 border border-yellow-400/30 flex items-center justify-center">
              <Star size={24} className="text-yellow-400" />
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl text-slate-900">Shining Stars</h1>
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm">Manage top performers</p>
            </div>
          </div>
          <Link href="/admin/shining-stars/new" className="btn-gold text-sm flex items-center gap-2">
            <Plus size={15} /> Add Shining Star
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>Loading...</div>
        ) : shiningStars.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-2xl">
            <Star size={48} className="mx-auto mb-4 opacity-20 text-yellow-400" />
            <p style={{ color: 'var(--text-muted)' }}>No Shining Stars yet</p>
            <Link href="/admin/shining-stars/new" className="btn-gold mt-4 text-sm inline-flex items-center gap-2">
              <Plus size={15} /> Add First Shining Star
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {shiningStars.map((star) => (
              <div
                key={star.id}
                onClick={() => setSelected(star)}
                className="glass-card rounded-2xl p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between cursor-pointer transition-all hover:border-yellow-400/40 hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {star.photo ? (
                    <img src={star.photo} alt={star.name}
                      className="w-12 h-12 rounded-xl object-cover border border-yellow-400/30 flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400/10 to-amber-600/10 border border-yellow-400/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-yellow-400">{initials(star.name)}</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{star.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {star.department} | {star.batch}
                    </p>
                    {star.position && star.company && (
                      <p className="text-xs text-yellow-400 mt-1 truncate">⭐ {star.position} at {star.company}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
                  <button
                    onClick={(e) => { e.stopPropagation(); openEdit(star) }}
                    className="btn-outline text-sm flex items-center gap-2"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteStar(star.id) }}
                    className="btn-outline text-sm flex items-center gap-2 hover:border-red-400 hover:text-red-400"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(2,6,23,0.65)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSelected(null)}
        >
          <div
            className="glass-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-2 rounded-t-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600" />
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-center gap-4 min-w-0">
                  {selected.photo ? (
                    <img src={selected.photo} alt={selected.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-yellow-400/30 flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-amber-600/20 border border-yellow-400/30 flex items-center justify-center flex-shrink-0">
                      <span className="font-display font-bold text-xl text-yellow-400">{initials(selected.name)}</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <h2 className="font-display font-bold text-xl text-slate-900 truncate">{selected.name}</h2>
                    {selected.rollNumber && (
                      <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--cyan)' }}>{selected.rollNumber}</p>
                    )}
                  </div>
                </div>
                <button onClick={() => setSelected(null)}
                  className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                  style={{ color: 'var(--text-secondary)' }} aria-label="Close">
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <DetailItem icon={<GraduationCap size={14} className="text-cyan-400" />} label="Department" value={selected.department} />
                <DetailItem icon={<Hash size={14} className="text-cyan-400" />} label="Batch" value={selected.batch} />
                {selected.gpa != null && (
                  <DetailItem icon={<Star size={14} className="text-yellow-400" />} label="GPA" value={String(selected.gpa)} />
                )}
                {(selected.position || selected.company) && (
                  <DetailItem
                    icon={<Award size={14} className="text-yellow-400" />}
                    label="Position"
                    value={`${selected.position ?? ''}${selected.position && selected.company ? ' at ' : ''}${selected.company ?? ''}`}
                  />
                )}
              </div>

              {selected.skills && (
                <div className="mb-4">
                  <p className="text-xs mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                    <Sparkles size={13} className="text-cyan-400" /> Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.skills.split(',').map((s) => s.trim()).filter(Boolean).map((s) => (
                      <span key={s} className="badge badge-cyan">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {selected.story && (
                <div className="mb-5">
                  <p className="text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Success Story</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{selected.story}</p>
                </div>
              )}

              <div className="flex items-center gap-2 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <button onClick={() => openEdit(selected)} className="btn-gold text-sm flex items-center gap-2">
                  <Pencil size={14} /> Edit
                </button>
                <button onClick={() => deleteStar(selected.id)}
                  className="btn-outline text-sm flex items-center gap-2 hover:border-red-400 hover:text-red-400">
                  <Trash2 size={14} /> Delete
                </button>
                <button onClick={() => setSelected(null)} className="btn-outline text-sm ml-auto">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editing && editForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(2,6,23,0.65)', backdropFilter: 'blur(4px)' }}
          onClick={() => { if (!saving) { setEditing(null); setEditForm(null) } }}
        >
          <div
            className="glass-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="font-display font-bold text-xl text-slate-900 flex items-center gap-2">
                <Pencil size={18} className="text-yellow-400" /> Edit Shining Star
              </h2>
              <button onClick={() => { setEditing(null); setEditForm(null) }}
                className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                style={{ color: 'var(--text-secondary)' }} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Photo */}
              <div className="flex items-center gap-4">
                {editForm.photo ? (
                  <img src={editForm.photo} alt="Photo" className="w-20 h-20 rounded-full object-cover border-2 border-yellow-400" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-dashed border-yellow-400/50 flex items-center justify-center">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Photo</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input type="file" accept="image/*" id="edit-photo-upload" className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = () => setField('photo', reader.result as string)
                        reader.readAsDataURL(file)
                      }
                    }} />
                  <label htmlFor="edit-photo-upload" className="btn-outline text-sm cursor-pointer">Change Photo</label>
                  {editForm.photo && (
                    <button onClick={() => setField('photo', '')} className="btn-outline text-sm hover:border-red-400 hover:text-red-400">Remove</button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Full Name *</label>
                  <input type="text" value={editForm.name} onChange={(e) => setField('name', e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Roll Number</label>
                  <input type="text" value={editForm.rollNumber} onChange={(e) => setField('rollNumber', e.target.value)} className="input-field" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Department *</label>
                  <select value={editForm.department} onChange={(e) => setField('department', e.target.value)} className="input-field">
                    <option value="" style={{ background: '#040d2a' }}>Select Department</option>
                    {DEPARTMENTS.map((d) => <option key={d} value={d} style={{ background: '#040d2a' }}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Batch *</label>
                  <input type="text" value={editForm.batch} onChange={(e) => setField('batch', e.target.value)} className="input-field" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Current Position</label>
                  <input type="text" value={editForm.position} onChange={(e) => setField('position', e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Company/Organization</label>
                  <input type="text" value={editForm.company} onChange={(e) => setField('company', e.target.value)} className="input-field" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>GPA (Optional)</label>
                  <input type="number" step="0.01" min="0" max="4" value={editForm.gpa} onChange={(e) => setField('gpa', e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Skills (comma separated)</label>
                  <input type="text" value={editForm.skills} onChange={(e) => setField('skills', e.target.value)} className="input-field" />
                </div>
              </div>

              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Success Story</label>
                <textarea rows={4} value={editForm.story} onChange={(e) => setField('story', e.target.value)} className="input-field resize-none" />
              </div>

              {error && <div className="text-red-400 text-xs text-center p-2 rounded-lg bg-red-400/10">{error}</div>}

              <div className="flex items-center gap-2 pt-2">
                <button onClick={saveEdit} disabled={saving} className="btn-gold justify-center py-3 px-6 disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={() => { setEditing(null); setEditForm(null) }} disabled={saving} className="btn-outline text-sm">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg p-3" style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid var(--border)' }}>
      <p className="text-xs flex items-center gap-1.5 mb-1" style={{ color: 'var(--text-secondary)' }}>{icon} {label}</p>
      <p className="text-sm font-medium text-slate-900 break-words">{value}</p>
    </div>
  )
}
