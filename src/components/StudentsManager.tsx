'use client'
import { useState } from 'react'
import { Users, GraduationCap, Pencil, Trash2, Check, X, Clock, BadgeCheck } from 'lucide-react'

export interface StudentRow {
  studentId: string
  userId: string
  name: string
  email: string
  approved: boolean | null
  rollNumber: string
  department: string
  batch: string
  phone: string | null
}

const DEPARTMENTS = [
  'Computer Technology', 'Electronics', 'Electrical Technology',
  'Civil Technology', 'Mechanical Technology', 'Welding Technology',
  'HVACR', 'Auto Mechanic', 'Plumbing',
]

// Pending sirf jab approved === false; warna (true ya legacy null) approved
const isPending = (s: StudentRow): boolean => s.approved === false

type EditForm = {
  name: string
  rollNumber: string
  department: string
  batch: string
  phone: string
}

export default function StudentsManager({ initialStudents }: { initialStudents: StudentRow[] }) {
  const [students, setStudents] = useState<StudentRow[]>(initialStudents)
  const [busyId, setBusyId] = useState<string | null>(null)

  const [editing, setEditing] = useState<StudentRow | null>(null)
  const [editForm, setEditForm] = useState<EditForm | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const refresh = async () => {
    const res = await fetch('/api/admin/students')
    const data = await res.json()
    if (data.students) {
      setStudents(
        data.students.map((s: any): StudentRow => ({
          studentId: s.id,
          userId: s.userId,
          name: s.user?.name ?? '',
          email: s.user?.email ?? '',
          approved: s.user?.approved ?? null,
          rollNumber: s.rollNumber,
          department: s.department,
          batch: s.batch,
          phone: s.phone ?? null,
        }))
      )
    }
  }

  const setApproval = async (s: StudentRow, approved: boolean) => {
    setBusyId(s.studentId)
    try {
      await fetch('/api/admin/students', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: s.userId, approved }),
      })
      await refresh()
    } finally {
      setBusyId(null)
    }
  }

  const removeStudent = async (s: StudentRow, isReject: boolean) => {
    const msg = isReject
      ? `Reject "${s.name}"? This pending registration will be deleted.`
      : `Delete "${s.name}"? This action cannot be undone.`
    if (!confirm(msg)) return
    setBusyId(s.studentId)
    try {
      await fetch(`/api/admin/students?studentId=${s.studentId}&userId=${s.userId}`, { method: 'DELETE' })
      setStudents((prev) => prev.filter((x) => x.studentId !== s.studentId))
    } finally {
      setBusyId(null)
    }
  }

  const openEdit = (s: StudentRow) => {
    setError('')
    setEditing(s)
    setEditForm({
      name: s.name ?? '',
      rollNumber: s.rollNumber ?? '',
      department: s.department ?? '',
      batch: s.batch ?? '',
      phone: s.phone ?? '',
    })
  }

  const saveEdit = async () => {
    if (!editing || !editForm) return
    if (!editForm.name || !editForm.rollNumber || !editForm.department || !editForm.batch) {
      setError('Name, Roll No, Trade and Year are required!')
      return
    }
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: editing.studentId, userId: editing.userId, ...editForm }),
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
      setError('Something went wrong!')
    } finally {
      setSaving(false)
    }
  }

  const setField = (key: keyof EditForm, value: string) =>
    setEditForm((p) => (p ? { ...p, [key]: value } : p))

  const pendingCount = students.filter(isPending).length

  return (
    <>
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total Students</p>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-cyan-500/10">
              <GraduationCap size={18} className="text-cyan-500" />
            </div>
          </div>
          <p className="font-display font-bold text-3xl text-slate-900">{students.length}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Registered</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Pending Approval</p>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-500/10">
              <Clock size={18} className="text-amber-500" />
            </div>
          </div>
          <p className="font-display font-bold text-3xl text-slate-900">{pendingCount}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Awaiting review</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Approved</p>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-green-500/10">
              <BadgeCheck size={18} className="text-green-500" />
            </div>
          </div>
          <p className="font-display font-bold text-3xl text-slate-900">{students.length - pendingCount}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Can log in</p>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl p-2 sm:p-4 overflow-x-auto">
        {students.length === 0 ? (
          <div className="text-center py-16">
            <Users size={48} className="mx-auto mb-4 opacity-20 text-cyan-500" />
            <p style={{ color: 'var(--text-muted)' }}>No students registered yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['Student Name', 'Roll No', 'Trade', 'Year', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left font-semibold px-3 py-3 whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const pending = isPending(s)
                const busy = busyId === s.studentId
                return (
                  <tr key={s.studentId} className="border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-3 py-3 font-medium text-slate-900 whitespace-nowrap">{s.name}</td>
                    <td className="px-3 py-3 font-mono whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>{s.rollNumber}</td>
                    <td className="px-3 py-3 whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>{s.department}</td>
                    <td className="px-3 py-3 whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>{s.batch}</td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {pending ? (
                        <span className="badge badge-gold inline-flex items-center gap-1"><Clock size={11} /> Pending</span>
                      ) : (
                        <span className="badge badge-green inline-flex items-center gap-1"><Check size={11} /> Approved</span>
                      )}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {pending && (
                          <>
                            <button
                              onClick={() => setApproval(s, true)}
                              disabled={busy}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                              <Check size={13} /> Approve
                            </button>
                            <button
                              onClick={() => removeStudent(s, true)}
                              disabled={busy}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 border border-red-400/40 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                            >
                              <X size={13} /> Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => openEdit(s)}
                          disabled={busy}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors disabled:opacity-50"
                          style={{ color: 'var(--cyan)', borderColor: 'rgba(37,99,235,0.3)' }}
                        >
                          <Pencil size={13} /> Edit
                        </button>
                        <button
                          onClick={() => removeStudent(s, false)}
                          disabled={busy}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 border border-red-400/40 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

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
                <Pencil size={18} className="text-cyan-500" /> Edit Student
              </h2>
              <button onClick={() => { setEditing(null); setEditForm(null) }}
                className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-black/5 transition-colors"
                style={{ color: 'var(--text-secondary)' }} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Full Name *</label>
                <input type="text" value={editForm.name} onChange={(e) => setField('name', e.target.value)} className="input-field" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Roll No *</label>
                  <input type="text" value={editForm.rollNumber} onChange={(e) => setField('rollNumber', e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Year / Batch *</label>
                  <input type="text" value={editForm.batch} onChange={(e) => setField('batch', e.target.value)} className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Trade / Department *</label>
                  <select value={editForm.department} onChange={(e) => setField('department', e.target.value)} className="input-field">
                    <option value="" style={{ background: '#040d2a' }}>Select Trade</option>
                    {DEPARTMENTS.map((d) => <option key={d} value={d} style={{ background: '#040d2a' }}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Phone</label>
                  <input type="tel" value={editForm.phone} onChange={(e) => setField('phone', e.target.value)} className="input-field" />
                </div>
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
