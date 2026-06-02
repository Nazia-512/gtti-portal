'use client'
import { useState } from 'react'
import { Briefcase, MapPin, Pencil, Trash2, X, Building2, Clock } from 'lucide-react'

export interface JobRow {
  id: string
  title: string
  company: string
  location: string
  type: string
  description: string
  salary: string | null
  deadline: string | null // ISO string ya null
  isActive: boolean
}

const TYPE_LABEL: Record<string, string> = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  INTERNSHIP: 'Internship',
  CONTRACT: 'Contract',
}

type EditForm = {
  title: string
  company: string
  location: string
  type: string
  description: string
  salary: string
  deadline: string // yyyy-mm-dd
}

// ISO -> date input (yyyy-mm-dd)
const toDateInput = (iso: string | null): string => (iso ? iso.slice(0, 10) : '')

export default function JobsManager({ initialJobs }: { initialJobs: JobRow[] }) {
  const [jobs, setJobs] = useState<JobRow[]>(initialJobs)
  const [busyId, setBusyId] = useState<string | null>(null)

  const [editing, setEditing] = useState<JobRow | null>(null)
  const [editForm, setEditForm] = useState<EditForm | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const refresh = async () => {
    const res = await fetch('/api/admin/jobs')
    const data = await res.json()
    if (data.jobs) {
      setJobs(
        data.jobs.map((j: any): JobRow => ({
          id: j.id,
          title: j.title,
          company: j.company,
          location: j.location,
          type: j.type,
          description: j.description,
          salary: j.salary ?? null,
          deadline: j.deadline ?? null,
          isActive: j.isActive,
        }))
      )
    }
  }

  const deleteJob = async (job: JobRow) => {
    if (!confirm(`Delete "${job.title}"? Yeh action wapas nahi hoga.`)) return
    setBusyId(job.id)
    try {
      await fetch(`/api/admin/jobs?id=${job.id}`, { method: 'DELETE' })
      setJobs((prev) => prev.filter((j) => j.id !== job.id))
    } finally {
      setBusyId(null)
    }
  }

  const openEdit = (job: JobRow) => {
    setError('')
    setEditing(job)
    setEditForm({
      title: job.title ?? '',
      company: job.company ?? '',
      location: job.location ?? '',
      type: job.type ?? 'FULL_TIME',
      description: job.description ?? '',
      salary: job.salary ?? '',
      deadline: toDateInput(job.deadline),
    })
  }

  const saveEdit = async () => {
    if (!editing || !editForm) return
    if (!editForm.title || !editForm.company || !editForm.location || !editForm.description) {
      setError('Title, Company, Location aur Description required hain!')
      return
    }
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/jobs', {
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
      {jobs.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-2xl">
          <Briefcase size={48} className="mx-auto mb-4 opacity-20 text-green-400" />
          <p style={{ color: 'var(--text-muted)' }}>Koi job post nahi hai</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => {
            const busy = busyId === job.id
            return (
              <div key={job.id} className="glass-card rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900">{job.title}</h3>
                      <span className="badge badge-green">{TYPE_LABEL[job.type] ?? job.type}</span>
                      {!job.isActive && <span className="badge badge-red">Inactive</span>}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                      <span className="inline-flex items-center gap-1"><Building2 size={12} /> {job.company}</span>
                      <span className="inline-flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                      {job.salary && <span>💰 {job.salary}</span>}
                      {job.deadline && (
                        <span className="inline-flex items-center gap-1">
                          <Clock size={12} /> {new Date(job.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{job.description}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => openEdit(job)}
                      disabled={busy}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors disabled:opacity-50"
                      style={{ color: 'var(--cyan)', borderColor: 'rgba(37,99,235,0.3)' }}
                    >
                      <Pencil size={13} /> Edit
                    </button>
                    <button
                      onClick={() => deleteJob(job)}
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
            className="glass-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b rounded-t-2xl"
                 style={{ background: '#ffffff', borderColor: 'var(--border)' }}>
              <h2 className="font-display font-bold text-xl text-slate-900 flex items-center gap-2">
                <Pencil size={18} className="text-green-500" /> Edit Job
              </h2>
              <button onClick={() => { setEditing(null); setEditForm(null) }}
                className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-black/5 transition-colors"
                style={{ color: 'var(--text-secondary)' }} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Job Title *</label>
                  <input type="text" value={editForm.title} onChange={(e) => setField('title', e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Company *</label>
                  <input type="text" value={editForm.company} onChange={(e) => setField('company', e.target.value)} className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Location *</label>
                  <input type="text" value={editForm.location} onChange={(e) => setField('location', e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Job Type *</label>
                  <select value={editForm.type} onChange={(e) => setField('type', e.target.value)} className="input-field">
                    <option value="FULL_TIME" style={{ background: '#040d2a' }}>Full Time</option>
                    <option value="PART_TIME" style={{ background: '#040d2a' }}>Part Time</option>
                    <option value="INTERNSHIP" style={{ background: '#040d2a' }}>Internship</option>
                    <option value="CONTRACT" style={{ background: '#040d2a' }}>Contract</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Salary (Optional)</label>
                  <input type="text" value={editForm.salary} onChange={(e) => setField('salary', e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Deadline (Optional)</label>
                  <input type="date" value={editForm.deadline} onChange={(e) => setField('deadline', e.target.value)} className="input-field" />
                </div>
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Job Description *</label>
                <textarea rows={5} value={editForm.description} onChange={(e) => setField('description', e.target.value)} className="input-field resize-none" />
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
