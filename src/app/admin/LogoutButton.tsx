'use client'
import { useState } from 'react'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // ignore — phir bhi login page par bhej do
    }
    window.location.href = '/auth/login'
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="btn-outline text-sm flex items-center gap-2 disabled:opacity-50"
    >
      <LogOut size={15} /> {loading ? 'Logging out...' : 'Logout'}
    </button>
  )
}
