'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Cpu, ArrowLeft, UserPlus, Eye, EyeOff } from 'lucide-react'

const DEPARTMENTS = ['Computer Technology', 'Electronics', 'Electrical Technology', 'Civil Technology', 'Mechanical Technology']
const BATCHES = ['2023–2025', '2024–2026', '2022–2024', '2021–2023']

export default function RegisterPage() {
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', password: '', rollNumber: '', department: '', batch: '', phone: ''
  })
  const [loading, setLoading] = useState(false)
const [error, setError] = useState('')
const [success, setSuccess] = useState('')

const handleRegister = async () => {
  if (!form.name || !form.email || !form.password || !form.rollNumber || !form.department || !form.batch) {
    setError('Please fill in all required fields!')
    return
  }
  setLoading(true)
  setError('')
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (data.error) {
      setError(data.error)
    } else {
      setSuccess(data.message || "Your registration is submitted and pending admin approval. You'll be able to log in once approved.")
      setTimeout(() => window.location.href = '/auth/login', 4000)
    }
  } catch {
    setError('Something went wrong — please try again!')
  } finally {
    setLoading(false)
  }
}

  const update = (field: string, value: string) => setForm(p => ({ ...p, [field]: value }))

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative" style={{ background: 'var(--bg-primary)' }}>
      <div className="fixed top-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-8 pointer-events-none"
           style={{ background: 'radial-gradient(circle, #fbbf24, transparent)' }} />

      <div className="w-full max-w-lg relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 hover:text-cyan-400 transition-colors"
              style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Back to Portal
        </Link>

        <div className="glass-card rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center mx-auto mb-4">
              <UserPlus size={28} className="text-white" />
            </div>
            <h1 className="font-display font-bold text-2xl text-slate-900">Create Account</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Join GTTI Smart Portal as a Student</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Full Name *</label>
                <input type="text" placeholder="Muhammad Ahmed" value={form.name}
                  onChange={e => update('name', e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Roll Number *</label>
                <input type="text" placeholder="GTTI-2024-001" value={form.rollNumber}
                  onChange={e => update('rollNumber', e.target.value)} className="input-field" />
              </div>
            </div>

            <div>
              <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Email Address *</label>
              <input type="email" placeholder="ahmed@email.com" value={form.email}
                onChange={e => update('email', e.target.value)} className="input-field" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Department *</label>
                <select value={form.department} onChange={e => update('department', e.target.value)}
                  className="input-field">
                  <option value="" style={{ background: '#040d2a' }}>Select Department</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d} style={{ background: '#040d2a' }}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Batch *</label>
                <select value={form.batch} onChange={e => update('batch', e.target.value)}
                  className="input-field">
                  <option value="" style={{ background: '#040d2a' }}>Select Batch</option>
                  {BATCHES.map(b => <option key={b} value={b} style={{ background: '#040d2a' }}>{b}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Phone (Optional)</label>
              <input type="tel" placeholder="03XX-XXXXXXX" value={form.phone}
                onChange={e => update('phone', e.target.value)} className="input-field" />
            </div>

            <div>
              <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Password *</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} placeholder="Create a strong password"
                  value={form.password} onChange={e => update('password', e.target.value)}
                  className="input-field pr-10" />
                <button onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-cyan-400 transition-colors"
                  style={{ color: 'var(--text-muted)' }}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
                <div className="text-red-400 text-xs text-center p-2 rounded-lg bg-red-400/10">
                  {error}
                </div>
              )}
              {success && (
                <div className="text-green-400 text-xs text-center p-2 rounded-lg bg-green-400/10">
                  {success}
                </div>
              )}
              <button onClick={handleRegister} disabled={loading}
                className="w-full btn-gold justify-center py-3 mt-2 disabled:opacity-50">
                {loading ? 'Creating...' : <><UserPlus size={16} /> Create My Account</>}
              </button>
          </div>

          <div className="mt-6 pt-6 text-center border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <Link href="/auth/login" className="text-cyan-400 font-medium hover:text-cyan-300 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
