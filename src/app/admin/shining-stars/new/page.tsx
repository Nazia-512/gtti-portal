'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Star, Plus } from 'lucide-react'

const DEPARTMENTS = [
  'Computer Technology', 'Electronics', 'Electrical Technology',
  'Civil Technology', 'Mechanical Technology', 'Welding Technology',
  'HVACR', 'Auto Mechanic', 'Plumbing'
]

export default function NewShiningStarPage() {
  const [form, setForm] = useState({
    name: '', department: '', batch: '', position: '',
    company: '', story: '', skills: '', rollNumber: '', gpa: ''
  })
  const [photo, setPhoto] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async () => {
    if (!form.name || !form.department || !form.batch) {
      setError('Name, Department and Batch are required!')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/shining-stars/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, photo, gpa: form.gpa ? parseFloat(form.gpa) : null })
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setSuccess('Shining Star added successfully!')
        setTimeout(() => window.location.href = '/admin/shining-stars', 2000)
      }
    } catch {
      setError('Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link href="/admin/shining-stars" className="inline-flex items-center gap-2 text-sm mb-8 hover:text-cyan-400 transition-colors"
              style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Back
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-amber-600/20 border border-yellow-400/30 flex items-center justify-center">
            <Star size={24} className="text-yellow-400" />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl text-slate-900">Add Shining Star</h1>
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm">Add a top performer or success story</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-4">

          {/* Photo Upload */}
          <div className="flex items-center gap-4">
            {photo ? (
              <img src={photo} alt="Photo" className="w-20 h-20 rounded-full object-cover border-2 border-yellow-400" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-dashed border-yellow-400/50 flex items-center justify-center">
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Photo</span>
              </div>
            )}
            <div>
              <input type="file" accept="image/*" id="photo-upload" className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = () => setPhoto(reader.result as string)
                    reader.readAsDataURL(file)
                  }
                }} />
              <label htmlFor="photo-upload" className="btn-outline text-sm cursor-pointer">
                Upload Photo
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Full Name *</label>
              <input type="text" placeholder="Student name"
                value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="input-field" />
            </div>
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Roll Number</label>
              <input type="text" placeholder="GTTI-2024-001"
                value={form.rollNumber} onChange={e => setForm(p => ({ ...p, rollNumber: e.target.value }))}
                className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Department *</label>
              <select value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))}
                className="input-field">
                <option value="" style={{ background: '#040d2a' }}>Select Department</option>
                {DEPARTMENTS.map(d => <option key={d} value={d} style={{ background: '#040d2a' }}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Batch *</label>
              <input type="text" placeholder="e.g. 2022-2024"
                value={form.batch} onChange={e => setForm(p => ({ ...p, batch: e.target.value }))}
                className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Current Position</label>
              <input type="text" placeholder="e.g. Senior Developer"
                value={form.position} onChange={e => setForm(p => ({ ...p, position: e.target.value }))}
                className="input-field" />
            </div>
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Company/Organization</label>
              <input type="text" placeholder="e.g. Suzuki Motors"
                value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>GPA (Optional)</label>
              <input type="number" step="0.01" min="0" max="4" placeholder="e.g. 3.85"
                value={form.gpa} onChange={e => setForm(p => ({ ...p, gpa: e.target.value }))}
                className="input-field" />
            </div>
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Skills (comma separated)</label>
              <input type="text" placeholder="Python, AutoCAD, Welding"
                value={form.skills} onChange={e => setForm(p => ({ ...p, skills: e.target.value }))}
                className="input-field" />
            </div>
          </div>

          <div>
            <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Success Story</label>
            <textarea rows={4} placeholder="Write the student's success story..."
              value={form.story} onChange={e => setForm(p => ({ ...p, story: e.target.value }))}
              className="input-field resize-none" />
          </div>

          {error && <div className="text-red-400 text-xs text-center p-2 rounded-lg bg-red-400/10">{error}</div>}
          {success && <div className="text-green-400 text-xs text-center p-2 rounded-lg bg-green-400/10">{success}</div>}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full btn-gold justify-center py-3 disabled:opacity-50">
            {loading ? 'Adding...' : <><Plus size={16} /> Add Shining Star</>}
          </button>
        </div>
      </div>
    </div>
  )
}