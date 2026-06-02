'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cpu, ArrowRight, Menu, X } from 'lucide-react'

interface NavLink {
  href: string
  label: string
}

const NAV_LINKS: NavLink[] = [
  { href: '/shining-stars', label: 'Shining Stars' },
  { href: '/cv-builder',    label: 'CV Builder'    },
  { href: '/jobs',          label: 'Jobs Board'    },
  { href: '/auth/login',    label: 'Student Login' },
]

export default function HomeNav(): React.ReactElement {
  const [scrolled, setScrolled] = useState<boolean>(false)
  const [menuOpen, setMenuOpen] = useState<boolean>(false)

  useEffect((): (() => void) => {
    const handler = (): void => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return (): void => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" onClick={(): void => setMenuOpen(false)}>
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 opacity-20 blur-sm" />
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-700 flex items-center justify-center">
              <Cpu size={20} className="text-white" />
            </div>
          </div>
          <div>
            <span className="font-display font-bold text-lg" style={{ color: '#1d4ed8' }}>GTTI</span>
            <span className="hidden sm:inline font-display text-lg ml-1" style={{ color: 'var(--cyan)' }}>Smart Portal</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((l: NavLink) => (
            <Link key={l.href} href={l.href}
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
            >{l.label}</Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/auth/login" className="btn-primary text-sm">
            Get Started <ArrowRight size={14} />
          </Link>
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={(): void => setMenuOpen((o: boolean) => !o)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col">
            {NAV_LINKS.map((l: NavLink) => (
              <Link key={l.href} href={l.href}
                onClick={(): void => setMenuOpen(false)}
                className="py-3 text-sm font-medium text-slate-700 hover:text-blue-600 border-b border-slate-100 last:border-0 transition-colors"
              >{l.label}</Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
