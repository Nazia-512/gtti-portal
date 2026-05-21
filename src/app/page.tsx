'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  Star, Cpu, FileText, MessageSquare, Briefcase,
  Users, LayoutDashboard, QrCode, BookOpen,
  ChevronRight, ArrowRight, Award, TrendingUp, Shield
} from 'lucide-react'

const NAV_LINKS = [
  { href: '/shining-stars',  label: 'Shining Stars' },
  { href: '/cv-builder',     label: 'CV Builder'    },
  { href: '/jobs',           label: 'Jobs Board'    },
  { href: '/auth/login',     label: 'Student Login' },
]

const FEATURES = [
  {
    icon: Star,
    title: 'Shining Stars',
    description: 'Celebrating our top-performing students with verified achievement profiles visible to employers.',
    color: 'gold',
    href: '/shining-stars',
    badge: 'Featured',
  },
  {
    icon: FileText,
    title: 'AI CV Builder',
    description: 'Generate ATS-optimized resumes tailored for your field using Claude AI in seconds.',
    color: 'cyan',
    href: '/cv-builder',
    badge: 'AI Powered',
  },
  {
    icon: MessageSquare,
    title: 'AI Chatbot',
    description: 'Get instant answers about courses, careers, scholarships, and study guidance 24/7.',
    color: 'cyan',
    href: '/student/chat',
    badge: 'AI Powered',
  },
  {
    icon: Briefcase,
    title: 'Jobs & Internships',
    description: 'Curated opportunities from verified employers looking specifically for GTTI graduates.',
    color: 'green',
    href: '/jobs',
    badge: 'Live',
  },
  {
    icon: QrCode,
    title: 'QR Verified Profiles',
    description: 'Every student gets a unique QR-linked digital credential employers can verify instantly.',
    color: 'purple',
    href: '/student/profile',
    badge: 'New',
  },
  {
    icon: BookOpen,
    title: 'AI Lesson Simplifier',
    description: 'Paste any complex topic and Claude AI breaks it down into simple, easy-to-understand notes.',
    color: 'orange',
    href: '/student/lesson',
    badge: 'AI Powered',
  },
  {
    icon: Users,
    title: 'Student Profiles',
    description: 'Manage your academic portfolio, skills, and achievements all in one professional space.',
    color: 'blue',
    href: '/auth/register',
    badge: null,
  },
  {
    icon: LayoutDashboard,
    title: 'Admin Dashboard',
    description: 'Full control for placement officers — manage students, jobs, announcements, and analytics.',
    color: 'red',
    href: '/admin',
    badge: 'Admin',
  },
]

const STATS = [
  { value: '500+', label: 'Registered Students', icon: Users },
  { value: '120+', label: 'Jobs Posted',          icon: Briefcase },
  { value: '85%',  label: 'Placement Rate',       icon: TrendingUp },
  { value: '50+',  label: 'Shining Stars',        icon: Award },
]

const colorMap: Record<string, string> = {
  gold:   'border-yellow-500/30 hover:border-yellow-400/60',
  cyan:   'border-cyan-500/30 hover:border-cyan-400/60',
  green:  'border-green-500/30 hover:border-green-400/60',
  purple: 'border-purple-500/30 hover:border-purple-400/60',
  orange: 'border-orange-500/30 hover:border-orange-400/60',
  blue:   'border-blue-500/30 hover:border-blue-400/60',
  red:    'border-red-500/30 hover:border-red-400/60',
}

const iconColorMap: Record<string, string> = {
  gold:   'text-yellow-400',
  cyan:   'text-cyan-400',
  green:  'text-green-400',
  purple: 'text-purple-400',
  orange: 'text-orange-400',
  blue:   'text-blue-400',
  red:    'text-red-400',
}

const bgGlowMap: Record<string, string> = {
  gold:   'bg-yellow-500/10',
  cyan:   'bg-cyan-500/10',
  green:  'bg-green-500/10',
  purple: 'bg-purple-500/10',
  orange: 'bg-orange-500/10',
  blue:   'bg-blue-500/10',
  red:    'bg-red-500/10',
}

function StarBackground() {
  return (
    <div className="stars-bg" aria-hidden="true">
      {[...Array(60)].map((_, i) => (
        <div
          key={i}
          className="star-dot"
          style={{
            left:              `${Math.random() * 100}%`,
            top:               `${Math.random() * 100}%`,
            width:             `${Math.random() * 2 + 1}px`,
            height:            `${Math.random() * 2 + 1}px`,
            animationDelay:    `${Math.random() * 4}s`,
            animationDuration: `${Math.random() * 3 + 3}s`,
            opacity:           Math.random() * 0.5 + 0.1,
          }}
        />
      ))}
    </div>
  )
}

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div className="relative min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <StarBackground />

      {/* ── Navbar ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass border-b border-white/5 py-3' : 'py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 opacity-20 blur-sm" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-700 flex items-center justify-center">
                <Cpu size={20} className="text-white" />
              </div>
            </div>
            <div>
              <span className="font-display font-bold text-lg text-white">GTTI</span>
              <span className="hidden sm:inline font-display text-lg ml-1" style={{ color: 'var(--cyan)' }}>
                Smart Portal
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--cyan)')}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--text-secondary)')}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <Link href="/auth/login" className="btn-primary text-sm">
            Get Started <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 min-h-screen flex items-center justify-center pt-20 px-6">
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
            style={{ background: 'radial-gradient(circle, #bfdbfe, transparent)' }}/>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-8"
             style={{ background: 'radial-gradient(circle, #f5f7ec, transparent)' }} />

        <div className="max-w-4xl mx-auto text-center">
          {/* Institute badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full"
               style={{ border: '1px solid rgba(34,211,238,0.3)', background: 'rgba(34,211,238,0.05)' }}>
            <Shield size={14} className="text-cyan-400" />
            <span className="text-xs font-medium" style={{ color: 'var(--cyan)' }}>
              Government Technical Training Institute — D.G. Khan
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-bold leading-tight mb-6"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
           <span style={{ color: '#0f172a' }}>Empowering</span>
            <span className="gold-text">Future</span>
            <br />
            <span className="cyan-text">Tech Leaders</span>
          </h1>

          <p className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
             style={{ color: 'var(--text-secondary)' }}>
            Pakistan's most advanced technical institute portal — AI-powered CV building, verified student
            profiles, real-time job matching, and intelligent career guidance, all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register" className="btn-gold text-base px-8 py-3">
              <Star size={16} /> Join as Student
            </Link>
            <Link href="/shining-stars" className="btn-outline text-base px-8 py-3">
              View Shining Stars <ChevronRight size={16} />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16">
            {STATS.map(stat => (
              <div key={stat.label} className="glass-card rounded-xl p-4 text-center">
                <stat.icon size={20} className="text-cyan-400 mx-auto mb-2" />
                <div className="font-display font-bold text-2xl text-white">{stat.value}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="star-badge inline-flex mb-4">
              <Star size={12} /> Platform Features
            </div>
            <h2 className="font-display font-bold text-4xl text-white mb-4">
              Everything You Need to{' '}
              <span className="gold-text">Succeed</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)' }} className="max-w-xl mx-auto">
              Comprehensive tools designed specifically for GTTI students and faculty.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <Link
                key={f.title}
                href={f.href}
                className={`glass-card rounded-2xl p-6 flex flex-col gap-4 cursor-pointer group border ${colorMap[f.color]}`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgGlowMap[f.color]}`}>
                    <f.icon size={22} className={iconColorMap[f.color]} />
                  </div>
                  {f.badge && (
                    <span className="badge badge-cyan text-xs">{f.badge}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {f.description}
                  </p>
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium mt-auto ${iconColorMap[f.color]} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Explore <ChevronRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Highlight ── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card rounded-3xl p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5"
                 style={{ backgroundImage: 'var(--tw-gradient-stops)', background: 'radial-gradient(circle at 50% 50%, #22d3ee, transparent 70%)' }} />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mx-auto mb-6">
                <Cpu size={28} className="text-white" />
              </div>
              <h2 className="font-display font-bold text-3xl text-white mb-4">
                Powered by <span className="cyan-text">Claude AI</span>
              </h2>
              <p className="max-w-2xl mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
                Our portal integrates Anthropic's Claude AI to give every GTTI student access to
                world-class career guidance, resume optimization, and learning assistance — completely free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/cv-builder"   className="btn-primary">Try AI CV Builder</Link>
                <Link href="/student/chat" className="btn-outline">Chat with AI</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t py-10 px-6"
              style={{ borderColor: 'var(--border)', background: 'rgba(4,13,42,0.8)' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="font-display font-bold text-white">GTTI Smart Portal</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Government Technical Training Institute, D.G. Khan, Punjab, Pakistan
            </p>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} GTTI D.G. Khan. Built with ❤️ for our students.
          </p>
        </div>
      </footer>
    </div>
  )
}
