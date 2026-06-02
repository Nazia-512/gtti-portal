'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  UserCheck, Star, Briefcase, Bell, Image as ImageIcon,
  ClipboardList, BookOpen, Images, Menu, X, Cpu,
} from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  color: string
}

// Wahi links jo pehle Quick Actions mein the (Pending Approvals hata diya gaya)
const NAV: NavItem[] = [
  { href: '/admin/students',      label: 'Manage Students', icon: UserCheck,     color: 'text-cyan-400'   },
  { href: '/admin/shining-stars', label: 'Shining Stars',   icon: Star,          color: 'text-yellow-400' },
  { href: '/admin/jobs',          label: 'Manage Jobs',     icon: Briefcase,     color: 'text-green-400'  },
  { href: '/admin/announcements', label: 'Announcements',   icon: Bell,          color: 'text-orange-400' },
  { href: '/admin/slider',        label: 'Manage Slider',   icon: ImageIcon,     color: 'text-cyan-400'   },
  { href: '/admin/trades',        label: 'Manage Trades',   icon: Images,        color: 'text-rose-400'   },
  { href: '/admin/career-tests',  label: 'Career Tests',    icon: ClipboardList, color: 'text-purple-400' },
  { href: '/admin/lessons',       label: 'Manage Lessons',  icon: BookOpen,      color: 'text-blue-400'   },
]

export default function AdminSidebar(): React.ReactElement {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string): boolean =>
    pathname === href || pathname.startsWith(href + '/')

  const Brand = (
    <Link href="/admin" onClick={() => setOpen(false)}
      className="flex items-center gap-3 h-16 px-5 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-700 flex items-center justify-center">
        <Cpu size={18} className="text-white" />
      </div>
      <div>
        <span className="font-display font-bold text-base" style={{ color: '#1d4ed8' }}>GTTI</span>
        <span className="font-display text-base ml-1" style={{ color: 'var(--cyan)' }}>Admin</span>
      </div>
    </Link>
  )

  const NavLinks = (
    <nav className="flex-1 px-3 py-5 overflow-y-auto">
      <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
        Menu
      </p>
      <div className="space-y-1">
        {NAV.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={active ? 'page' : undefined}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                active
                  ? 'bg-cyan-500/10 text-cyan-700 font-semibold'
                  : 'font-medium hover:bg-slate-100 hover:text-slate-900'
              }`}
              style={active ? undefined : { color: 'var(--text-secondary)' }}
            >
              {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-cyan-600" />}
              <item.icon size={18} className={active ? 'text-cyan-600' : item.color} />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )

  const SidebarInner = (
    <div className="flex flex-col h-full">
      {Brand}
      {NavLinks}
    </div>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-white border-b"
           style={{ borderColor: 'var(--border)' }}>
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-700 flex items-center justify-center">
            <Cpu size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-sm" style={{ color: '#1d4ed8' }}>GTTI <span style={{ color: 'var(--cyan)' }}>Admin</span></span>
        </Link>
        <button onClick={() => setOpen(true)} aria-label="Open menu"
          className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
          style={{ color: 'var(--text-secondary)' }}>
          <Menu size={22} />
        </button>
      </div>

      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 bg-white border-r shadow-sm z-40"
             style={{ borderColor: 'var(--border)' }}>
        {SidebarInner}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-white shadow-2xl">
            <button onClick={() => setOpen(false)} aria-label="Close menu"
              className="absolute top-3 right-3 w-9 h-9 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors z-10"
              style={{ color: 'var(--text-secondary)' }}>
              <X size={18} />
            </button>
            {SidebarInner}
          </aside>
        </div>
      )}
    </>
  )
}
