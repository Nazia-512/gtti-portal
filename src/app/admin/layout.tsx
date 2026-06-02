import React from 'react'
import AdminSidebar from '@/components/AdminSidebar'

// Saare /admin pages par left sidebar — content sidebar ke right mein
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <AdminSidebar />
      {/* Desktop par sidebar (w-64) ke liye left padding; mobile par full width */}
      <div className="lg:pl-64">{children}</div>
    </div>
  )
}
