'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  Star, Cpu, FileText, MessageSquare, Briefcase,
  Users, LayoutDashboard, QrCode, BookOpen,
  ChevronRight, ArrowRight, Award, TrendingUp, Shield,
  ChevronLeft, Upload, X, Play, Pause, Image as ImageIcon
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────
interface Slide {
  id: number
  image: string | null
  title: string
  subtitle: string
  badge: string
}

interface Feature {
  icon: React.ElementType
  title: string
  description: string
  color: string
  href: string
  badge: string | null
}

interface Stat {
  id: string
  value: string
  label: string
  icon: React.ElementType
}

interface NavLink {
  href: string
  label: string
}

// ─── Default slides ───────────────────────────────────────────────────────────
const DEFAULT_SLIDES: Slide[] = [
  {
    id: 0,
    image: null,
    title: 'Batch 2024 Placement Ceremony',
    subtitle: 'Government Technical Training Institute — D.G. Khan',
    badge: 'Placement 2024',
  },
  {
    id: 1,
    image: null,
    title: 'Top Companies Hiring Our Students',
    subtitle: 'Real jobs, real careers — powered by GTTI training',
    badge: 'Industry Partners',
  },
  {
    id: 2,
    image: null,
    title: 'Our Shining Stars — Batch 2023',
    subtitle: 'Exceptional graduates making us proud',
    badge: 'Shining Stars',
  },
  {
    id: 3,
    image: null,
    title: 'Industry Visit & Training Program',
    subtitle: 'Hands-on learning with leading tech companies',
    badge: 'Workshop',
  },
]

const SLIDE_GRADIENTS: string[] = [
  'from-blue-900 via-blue-800 to-sky-700',
  'from-emerald-900 via-emerald-800 to-teal-700',
  'from-purple-900 via-purple-800 to-pink-700',
  'from-orange-900 via-orange-800 to-amber-700',
]

const NAV_LINKS: NavLink[] = [
  { href: '/shining-stars', label: 'Shining Stars' },
  { href: '/cv-builder',    label: 'CV Builder'    },
  { href: '/jobs',          label: 'Jobs Board'    },
  { href: '/auth/login',    label: 'Student Login' },
]

const FEATURES: Feature[] = [
  { icon: Star,            title: 'Shining Stars',        description: 'Celebrating our top-performing students with verified achievement profiles visible to employers.', color: 'gold',   href: '/shining-stars',   badge: 'Featured'   },
  { icon: FileText,        title: 'AI CV Builder',        description: 'Generate ATS-optimized resumes tailored for your field using Claude AI in seconds.',              color: 'cyan',   href: '/cv-builder',      badge: 'AI Powered' },
  { icon: MessageSquare,   title: 'AI Chatbot',           description: 'Get instant answers about courses, careers, scholarships, and study guidance 24/7.',              color: 'cyan',   href: '/student/chat',    badge: 'AI Powered' },
  { icon: Briefcase,       title: 'Jobs & Internships',   description: 'Curated opportunities from verified employers looking specifically for GTTI graduates.',          color: 'green',  href: '/jobs',            badge: 'Live'       },
  { icon: QrCode,          title: 'QR Verified Profiles', description: 'Every student gets a unique QR-linked digital credential employers can verify instantly.',        color: 'purple', href: '/student/profile', badge: 'New'        },
  { icon: BookOpen,        title: 'AI Lesson Simplifier', description: 'Paste any complex topic and Claude AI breaks it down into simple, easy-to-understand notes.',    color: 'orange', href: '/student/lesson',  badge: 'AI Powered' },
  { icon: Users,           title: 'Student Profiles',     description: 'Manage your academic portfolio, skills, and achievements all in one professional space.',         color: 'blue',   href: '/auth/register',   badge: null         },
  { icon: LayoutDashboard, title: 'Admin Dashboard',      description: 'Full control for placement officers — manage students, jobs, announcements, and analytics.',      color: 'red',    href: '/admin',           badge: 'Admin'      },
]

const STATS: Stat[] = [
  { id: 'registered-students', value: '500+', label: 'Registered Students', icon: Users      },
  { id: 'jobs-posted',         value: '120+', label: 'Jobs Posted',          icon: Briefcase  },
  { id: 'placement-rate',      value: '85%',  label: 'Placement Rate',       icon: TrendingUp },
  { id: 'shining-stars-count', value: '50+',  label: 'Shining Stars',        icon: Award      },
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

// ─── Star Background ──────────────────────────────────────────────────────────
function StarBackground(): React.ReactElement {
  const stars = Array.from({ length: 60 }, (_: unknown, i: number) => i)
  return (
    <div className="stars-bg" aria-hidden="true">
      {stars.map((i: number) => (
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

// ─── Hero Placement Slider (Slider + Hero dono ek saath, TOP pe) ──────────────
function HeroPlacementSlider(): React.ReactElement {
  const [slides, setSlides]       = useState<Slide[]>(DEFAULT_SLIDES)
  const [current, setCurrent]     = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const [showAdmin, setShowAdmin] = useState<boolean>(false)
  const [drafts, setDrafts]       = useState<Slide[]>(DEFAULT_SLIDES)
  const [saved, setSaved]         = useState<boolean>(false)
  const timerRef                  = useRef<ReturnType<typeof setInterval> | null>(null)
  const fileRefs                  = useRef<Array<HTMLInputElement | null>>([])

  const goTo = useCallback(
    (n: number): void => setCurrent((n + slides.length) % slides.length),
    [slides.length]
  )

  useEffect((): (() => void) => {
    if (isPlaying) {
      timerRef.current = setInterval(() => goTo(current + 1), 4500)
    }
    return (): void => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying, current, goTo])

  const handleFileChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev: ProgressEvent<FileReader>): void => {
      const base64 = ev.target?.result as string
      setDrafts((prev: Slide[]) => prev.map((s: Slide, i: number) => (i === idx ? { ...s, image: base64 } : s)))
    }
    reader.readAsDataURL(file)
  }

  const handleDraftText = (idx: number, field: 'title' | 'subtitle' | 'badge', val: string): void => {
    setDrafts((prev: Slide[]) => prev.map((s: Slide, i: number) => (i === idx ? { ...s, [field]: val } : s)))
  }

  const removeImage = (idx: number): void => {
    setDrafts((prev: Slide[]) => prev.map((s: Slide, i: number) => (i === idx ? { ...s, image: null } : s)))
    const ref = fileRefs.current[idx]
    if (ref) ref.value = ''
  }

  const applyChanges = (): void => {
    setSlides(drafts.map((d: Slide) => ({ ...d })))
    setSaved(true)
    setTimeout((): void => setSaved(false), 2000)
  }

  const slide = slides[current]

  return (
    <div className="w-full">
      {/* ── Full-screen Hero Slider ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: 'calc(100vh - 0px)', minHeight: '600px' }}
      >
        {/* Background layer */}
        <div
          key={current}
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            backgroundImage:    slide.image ? `url(${slide.image})` : undefined,
            backgroundSize:     'cover',
            backgroundPosition: 'center',
          }}
        >
          {!slide.image && (
            <div className={`absolute inset-0 bg-gradient-to-br ${SLIDE_GRADIENTS[current % SLIDE_GRADIENTS.length]}`} />
          )}
          {/* Dark overlay for text readability */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(2,6,23,0.90) 0%, rgba(2,6,23,0.60) 50%, rgba(2,6,23,0.30) 100%)' }}
          />
        </div>

        {/* ── Hero Content — center mein ── */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6" style={{ paddingTop: '80px' }}>

          {/* Institute badge */}
          <div
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full"
            style={{ border: '1px solid rgba(34,211,238,0.35)', background: 'rgba(34,211,238,0.08)', backdropFilter: 'blur(8px)' }}
          >
            <Shield size={13} className="text-cyan-400" />
            <span className="text-xs font-medium" style={{ color: '#67e8f9' }}>
              Government Technical Training Institute — D.G. Khan
            </span>
          </div>

          {/* Main heading */}
          <h1
            className="font-display font-bold leading-tight mb-4 text-white"
            style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)' }}
          >
            Empowering{' '}
            <span style={{ color: '#fbbf24' }}>Future</span>
            <br />
            <span style={{ color: '#22d3ee' }}>Tech Leaders</span>
          </h1>

          {/* Slide subtitle */}
          <p
            className="text-base md:text-lg max-w-2xl mx-auto mb-3 leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.72)' }}
          >
            Pakistan&apos;s most advanced technical institute portal — AI-powered CV building,
            verified student profiles, real-time job matching, and intelligent career guidance,
            all in one place.
          </p>

          {/* Slide badge */}
          <div
            className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.3)', color: '#67e8f9' }}
          >
            <Star size={11} />
            {slide.badge} — {slide.title}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register" className="btn-gold text-sm px-7 py-3">
              <Star size={15} /> Join as Student
            </Link>
            <Link href="/shining-stars" className="btn-outline text-sm px-7 py-3">
              View Shining Stars <ChevronRight size={15} />
            </Link>
          </div>
        </div>

        {/* Prev arrow */}
        <button
          type="button"
          onClick={(): void => { goTo(current - 1); setIsPlaying(false) }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full transition-all"
          style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)' }}
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>

        {/* Next arrow */}
        <button
          type="button"
          onClick={(): void => { goTo(current + 1); setIsPlaying(false) }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full transition-all"
          style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)' }}
          aria-label="Next slide"
        >
          <ChevronRight size={20} className="text-white" />
        </button>

        {/* Bottom controls */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-4"
          style={{ background: 'linear-gradient(to top, rgba(2,6,23,0.75), transparent)' }}
        >
          {/* Dots */}
          <div className="flex items-center gap-2">
            {slides.map((_: Slide, i: number) => (
              <button
                key={i}
                type="button"
                onClick={(): void => { goTo(i); setIsPlaying(false) }}
                className="rounded-full transition-all duration-300"
                style={{
                  width:      i === current ? '24px' : '8px',
                  height:     '8px',
                  background: i === current ? '#22d3ee' : 'rgba(255,255,255,0.35)',
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {current + 1} / {slides.length}
            </span>
            <button
              type="button"
              onClick={(): void => setIsPlaying((p: boolean) => !p)}
              className="flex items-center justify-center w-8 h-8 rounded-full"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying
                ? <Pause size={13} className="text-white" />
                : <Play  size={13} className="text-white" />
              }
            </button>
          </div>
        </div>

        {/* Gallery label */}
        <div className="absolute top-20 right-6 z-20">
          <div
            className="text-xs font-medium px-3 py-1 rounded-full"
            style={{ background: 'rgba(2,6,23,0.5)', color: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Placement Gallery
          </div>
        </div>
      </div>

      {/* Admin toggle button */}
      <div
        className="flex justify-end px-4 py-2"
        style={{ background: 'rgba(4,13,42,0.6)', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <button
          type="button"
          onClick={(): void => setShowAdmin((p: boolean) => !p)}
          className="flex items-center gap-2 text-xs px-4 py-2 rounded-lg transition-all"
          style={{
            background: showAdmin ? 'rgba(34,211,238,0.15)' : 'rgba(255,255,255,0.06)',
            border:     `1px solid ${showAdmin ? 'rgba(34,211,238,0.4)' : 'rgba(255,255,255,0.1)'}`,
            color:      showAdmin ? '#67e8f9' : 'rgba(255,255,255,0.5)',
          }}
        >
          <ImageIcon size={13} />
          {showAdmin ? 'Admin Panel Band Karein' : 'Admin: Slider Manage Karein'}
        </button>
      </div>

      {/* Admin panel */}
      {showAdmin && (
        <div
          className="glass-card rounded-none border-t-0 p-6"
          style={{ borderTop: '2px solid rgba(34,211,238,0.4)' }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <ImageIcon size={16} className="text-cyan-400" />
              <span className="font-semibold text-white text-sm">Placement Slider Admin Panel</span>
            </div>
            <span
              className="text-xs px-2 py-1 rounded-full"
              style={{ background: 'rgba(34,197,94,0.15)', color: '#86efac', border: '1px solid rgba(34,197,94,0.3)' }}
            >
              ● Live
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            {drafts.map((draft: Slide, idx: number) => (
              <div
                key={draft.id}
                className="rounded-xl overflow-hidden"
                style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}
              >
                <div className="relative h-24 overflow-hidden">
                  {draft.image ? (
                    <>
                      <img src={draft.image} alt={draft.title} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(): void => removeImage(idx)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(239,68,68,0.85)' }}
                        aria-label="Remove image"
                      >
                        <X size={11} className="text-white" />
                      </button>
                    </>
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${SLIDE_GRADIENTS[idx % SLIDE_GRADIENTS.length]} flex flex-col items-center justify-center gap-1`}
                    >
                      <ImageIcon size={18} className="text-white/50" />
                      <span className="text-xs text-white/50">Slide {idx + 1}</span>
                    </div>
                  )}
                </div>

                <div className="p-3 flex flex-col gap-2">
                  <input
                    type="text"
                    value={draft.badge}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => handleDraftText(idx, 'badge', e.target.value)}
                    placeholder="Badge text..."
                    className="w-full text-xs rounded-md px-2 py-1.5 outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#67e8f9' }}
                  />
                  <input
                    type="text"
                    value={draft.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => handleDraftText(idx, 'title', e.target.value)}
                    placeholder="Slide heading..."
                    className="w-full text-xs rounded-md px-2 py-1.5 outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)' }}
                  />
                  <input
                    type="text"
                    value={draft.subtitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => handleDraftText(idx, 'subtitle', e.target.value)}
                    placeholder="Sub text..."
                    className="w-full text-xs rounded-md px-2 py-1.5 outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}
                  />
                  <button
                    type="button"
                    onClick={(): void => fileRefs.current[idx]?.click()}
                    className="flex items-center justify-center gap-1.5 w-full text-xs py-1.5 rounded-md transition-all"
                    style={{ background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.3)', color: '#67e8f9' }}
                  >
                    <Upload size={11} />
                    {draft.image ? 'Photo Badlein' : 'Photo Upload Karein'}
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={(el: HTMLInputElement | null): void => { fileRefs.current[idx] = el }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => handleFileChange(idx, e)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={applyChanges}
              className="btn-primary text-sm"
              style={saved ? { background: 'rgba(34,197,94,0.8)' } : {}}
            >
              {saved ? '✓ Changes Apply Ho Gayi!' : 'Changes Apply Karein'}
            </button>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Photos sirf is session mein save hongi. Backend ke liye API connect karein.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HomePage(): React.ReactElement {
  const [scrolled, setScrolled] = useState<boolean>(false)

  useEffect((): (() => void) => {
    const handler = (): void => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return (): void => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div className="relative min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <StarBackground />

      {/* ── Navbar (fixed, transparent jab tak scroll na ho) ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass border-b border-white/5 py-3' : 'py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 opacity-20 blur-sm" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-700 flex items-center justify-center">
                <Cpu size={20} className="text-white" />
              </div>
            </div>
            <div>
              <span className="font-display font-bold text-lg" style={{ color: '#1d4ed8' }}>GTTI</span>
              <span className="hidden sm:inline font-display text-lg ml-1" style={{ color: 'var(--cyan)' }}>
                Smart Portal
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l: NavLink) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.currentTarget.style.color = 'var(--cyan)'
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.currentTarget.style.color = 'var(--text-secondary)'
                }}
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

      {/* ══════════════════════════════════════════════════
          HERO SLIDER — Bilkul TOP pe, navbar ke neeche
          (Hero section aur Placement Slider ek hi jagah)
         ══════════════════════════════════════════════════ */}
      <section className="relative z-10" style={{ marginTop: 0, paddingTop: 0 }}>
        <HeroPlacementSlider />
      </section>

      {/* Stats */}
      <section className="relative z-10 px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map((stat: Stat) => (
              <div key={stat.id} className="glass-card rounded-xl p-4 text-center">
                <stat.icon size={20} className="text-cyan-400 mx-auto mb-2" />
                <div className="font-display font-bold text-2xl text-white">{stat.value}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="star-badge inline-flex mb-4">
              <Star size={12} /> Platform Features
            </div>
            <h2 className="font-display font-bold text-4xl mb-4">
              Everything You Need to <span className="gold-text">Succeed</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)' }} className="max-w-xl mx-auto">
              Comprehensive tools designed specifically for GTTI students and faculty.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f: Feature, i: number) => (
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

      {/* AI Highlight */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card rounded-3xl p-10 text-center relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-5"
              style={{ background: 'radial-gradient(circle at 50% 50%, #22d3ee, transparent 70%)' }}
            />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mx-auto mb-6">
                <Cpu size={28} className="text-white" />
              </div>
              <h2 className="font-display font-bold text-3xl text-white mb-4">
                Powered by <span className="cyan-text">Claude AI</span>
              </h2>
              <p className="max-w-2xl mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
                Our portal integrates Anthropic&apos;s Claude AI to give every GTTI student access to
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

      {/* Footer */}
      <footer
        className="relative z-10 border-t py-10 px-6"
        style={{ borderColor: 'var(--border)', background: 'rgba(4,13,42,0.8)' }}
      >
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
