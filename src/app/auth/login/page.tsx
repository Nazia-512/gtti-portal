'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Cpu, Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
const [error, setError] = useState('')

const handleLogin = async () => {
  setLoading(true)
  setError('')
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, password: form.password })
    })
    const data = await res.json()
    if (data.error) {
      setError(data.error)
    } else {
      // Role ke hisaab se redirect karo
      if (data.role === 'ADMIN') {
        window.location.href = '/admin'
      } else {
        window.location.href = '/student'
      }
    }
  } catch {
    setError('Kuch ghalat hua — dobara try karo!')
  } finally {
    setLoading(false)
  }
}
  const [form, setForm] = useState({ email: '', password: '', remember: false })

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative" style={{ background: 'var(--bg-primary)' }}>
      {/* bg orbs */}
      <div className="fixed top-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-8 pointer-events-none"
           style={{ background: 'radial-gradient(circle, #22d3ee, transparent)' }} />
      <div className="fixed bottom-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-6 pointer-events-none"
           style={{ background: 'radial-gradient(circle, #fbbf24, transparent)' }} />

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 hover:text-cyan-400 transition-colors"
              style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Back to Portal
        </Link>

        <div className="glass-card rounded-3xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-700 flex items-center justify-center mx-auto mb-4">
              <Cpu size={28} className="text-white" />
            </div>
            <h1 className="font-display font-bold text-2xl text-slate-900">Welcome Back</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Sign in to GTTI Smart Portal</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
              <input type="email" placeholder="your.email@gtti.edu.pk"
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="input-field" />
            </div>

            <div>
              <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} placeholder="Enter your password"
                  value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="input-field pr-10" />
                <button onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-cyan-400 transition-colors"
                  style={{ color: 'var(--text-muted)' }}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.remember}
                  onChange={e => setForm(p => ({ ...p, remember: e.target.checked }))}
                  className="w-4 h-4 accent-cyan-400" />
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                Forgot password?
              </Link>
            </div>
                {error && (
                  <div className="text-red-400 text-xs text-center p-2 rounded-lg bg-red-400/10">
                    {error}
                  </div>
                )}
                            <button onClick={handleLogin} disabled={loading}
                  className="w-full btn-primary justify-center py-3 mt-2 disabled:opacity-50">
                  {loading ? 'Signing in...' : <><LogIn size={16} /> Sign In</>}
                </button>
          </div>

          <div className="mt-6 pt-6 text-center border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-cyan-400 font-medium hover:text-cyan-300 transition-colors">
                Register here
              </Link>
            </p>
          </div>

          {/* Demo credentials hint */}
          <div className="mt-4 rounded-xl p-3 text-xs" style={{ background: 'rgba(34,211,238,0.05)', border: '1px solid rgba(34,211,238,0.15)' }}>
            <p className="font-medium text-cyan-400 mb-1">Demo Access</p>
            <p style={{ color: 'var(--text-muted)' }}>Student: student@gtti.edu.pk / pass: demo123</p>
            <p style={{ color: 'var(--text-muted)' }}>Admin: admin@gtti.edu.pk / pass: admin123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
