'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Bell, Plus } from 'lucide-react'

export default function NewAnnouncementPage() {
  const [form, setForm] = useState({ title: '', content: '', priority: 'NORMAL' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async () => {
    if (!form.title || !form.content) {
      setError('Title and content are required!')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setSuccess('Announcement posted successfully!')
        setTimeout(() => window.location.href = '/admin', 2000)
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
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm mb-8 hover:text-cyan-400 transition-colors"
              style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-amber-600/20 border border-yellow-400/30 flex items-center justify-center">
            <Bell size={24} className="text-yellow-400" />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl text-slate-900">New Announcement</h1>
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm">Post announcement for students</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Title *</label>
            <input type="text" placeholder="Announcement title..."
              value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="input-field" />
          </div>

          <div>
            <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Priority *</label>
            <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
              className="input-field">
              <option value="LOW" style={{ background: '#040d2a' }}>Low</option>
              <option value="NORMAL" style={{ background: '#040d2a' }}>Normal</option>
              <option value="HIGH" style={{ background: '#040d2a' }}>High</option>
              <option value="URGENT" style={{ background: '#040d2a' }}>Urgent</option>
            </select>
          </div>

          <div>
            <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Content *</label>
            <textarea rows={5} placeholder="Announcement details..."
              value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
              className="input-field resize-none" />
          </div>

          {error && <div className="text-red-400 text-xs text-center p-2 rounded-lg bg-red-400/10">{error}</div>}
          {success && <div className="text-green-400 text-xs text-center p-2 rounded-lg bg-green-400/10">{success}</div>}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full btn-primary justify-center py-3 disabled:opacity-50">
            {loading ? 'Posting...' : <><Plus size={16} /> Post Announcement</>}
          </button>
        </div>
      </div>
    </div>
  )
}