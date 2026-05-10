'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Briefcase, Plus } from 'lucide-react'

export default function PostJobPage() {
  const [form, setForm] = useState({
    title: '', company: '', location: '', type: 'FULL_TIME',
    description: '', salary: '', deadline: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async () => {
    if (!form.title || !form.company || !form.location || !form.description) {
      setError('Sab required fields fill karo!')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setSuccess('Job post ho gayi!')
        setTimeout(() => window.location.href = '/admin', 2000)
      }
    } catch {
      setError('Kuch ghalat hua!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm mb-8 hover:text-cyan-400 transition-colors"
              style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400/20 to-emerald-600/20 border border-green-400/30 flex items-center justify-center">
            <Briefcase size={24} className="text-green-400" />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl text-white">Post New Job</h1>
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm">Add job opportunity for students</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Job Title *</label>
              <input type="text" placeholder="e.g. Junior Electrician"
                value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                className="input-field" />
            </div>
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Company *</label>
              <input type="text" placeholder="Company Name"
                value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Location *</label>
              <input type="text" placeholder="e.g. D.G. Khan"
                value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                className="input-field" />
            </div>
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Job Type *</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                className="input-field">
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
              <input type="text" placeholder="e.g. 25,000 - 35,000 PKR"
                value={form.salary} onChange={e => setForm(p => ({ ...p, salary: e.target.value }))}
                className="input-field" />
            </div>
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Deadline (Optional)</label>
              <input type="date"
                value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))}
                className="input-field" />
            </div>
          </div>

          <div>
            <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Job Description *</label>
            <textarea rows={5} placeholder="Job details, requirements, responsibilities..."
              value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className="input-field resize-none" />
          </div>

          {error && <div className="text-red-400 text-xs text-center p-2 rounded-lg bg-red-400/10">{error}</div>}
          {success && <div className="text-green-400 text-xs text-center p-2 rounded-lg bg-green-400/10">{success}</div>}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full btn-primary justify-center py-3 disabled:opacity-50">
            {loading ? 'Posting...' : <><Plus size={16} /> Post Job</>}
          </button>
        </div>
      </div>
    </div>
  )
}