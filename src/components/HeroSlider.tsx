'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Star, ChevronRight, ChevronLeft, Play, Pause } from 'lucide-react'

interface Slide {
  id: number
  image: string | null
  title: string
  subtitle: string
  badge: string
}

interface Announcement {
  id: number
  title: string
  content: string
  priority: string
}

const SLIDE_GRADIENTS: string[] = [
  'from-blue-900 via-blue-800 to-sky-700',
  'from-emerald-900 via-emerald-800 to-teal-700',
  'from-purple-900 via-purple-800 to-pink-700',
  'from-orange-900 via-orange-800 to-amber-700',
]

const DEFAULT_SLIDES: Slide[] = [
  { id: 0, image: null, title: 'Batch 2024 Placement Ceremony',    subtitle: 'Government Technical Training Institute — D.G. Khan', badge: 'Placement 2024'   },
  { id: 1, image: null, title: 'Top Companies Hiring Our Students', subtitle: 'Real jobs, real careers — powered by GTTI training',  badge: 'Industry Partners' },
  { id: 2, image: null, title: 'Our Shining Stars — Batch 2023',   subtitle: 'Exceptional graduates making us proud',                badge: 'Shining Stars'    },
  { id: 3, image: null, title: 'Industry Visit & Training Program', subtitle: 'Hands-on learning with leading tech companies',        badge: 'Workshop'         },
]

export default function HeroSlider(): React.ReactElement {
  const [slides, setSlides]               = useState<Slide[]>(DEFAULT_SLIDES)
  const [current, setCurrent]             = useState<number>(0)
  const [isPlaying, setIsPlaying]         = useState<boolean>(true)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const timerRef                          = useRef<ReturnType<typeof setInterval> | null>(null)

  // Slides API se fetch karo
  useEffect((): void => {
    fetch('/api/slider')
      .then((r) => r.json())
      .then((data: Slide[]) => { if (data?.length) setSlides(data) })
      .catch(() => {})
  }, [])

  // Announcements fetch karo ticker ke liye
  useEffect((): void => {
    fetch('/api/admin/announcements')
      .then((r) => r.json())
      .then((data: Announcement[]) => { if (data?.length) setAnnouncements(data) })
      .catch(() => {})
  }, [])

  const goTo = useCallback(
    (n: number): void => setCurrent((n + slides.length) % slides.length),
    [slides.length]
  )

  useEffect((): (() => void) => {
    if (isPlaying) {
      timerRef.current = setInterval(() => goTo(current + 1), 4500)
    }
    return (): void => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isPlaying, current, goTo])

  const slide = slides[current]

  interface TickerItem { icon: string; title: string; details: string }

  const tickerItems: TickerItem[] = announcements.length > 0
    ? announcements.map((a: Announcement) => ({
        icon:    a.priority === 'URGENT' ? '🔴' : a.priority === 'HIGH' ? '🟡' : '🔵',
        title:   a.title,
        details: a.content,
      }))
    : [
        { icon: '🔵', title: 'GTTI Smart Portal', details: 'Welcome — explore AI tools, jobs, and shining stars.' },
        { icon: '🟡', title: 'Placement Ceremony', details: 'Our next placement ceremony is coming soon.' },
        { icon: '🔵', title: 'AI CV Builder', details: 'Now available — build your ATS-optimized CV.' },
      ]

  // Title (bold) + details ek saath marquee mein — do dafa render taake loop seamless rahe
  const TickerSequence = (): React.ReactElement => (
    <>
      {tickerItems.map((item: TickerItem, i: number) => (
        <span key={i} className="inline-flex items-center">
          <span className="mr-1.5">{item.icon}</span>
          <span className="font-bold text-white">{item.title}</span>
          <span className="mx-1.5" style={{ color: '#22d3ee' }}>—</span>
          <span style={{ color: 'rgba(255,255,255,0.75)' }}>{item.details}</span>
          <span className="mx-5" style={{ color: 'rgba(34,211,238,0.6)' }}>•••</span>
        </span>
      ))}
    </>
  )

  return (
    <div className="w-full">
      {/* ══════════════════════════════════════════════════════
          FULL SCREEN HERO — slider photo background par
          "Empowering Future Tech Leaders" text upar likha
         ══════════════════════════════════════════════════════ */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: 'min(78vh, 680px)', minHeight: '440px' }}
      >
        {/* Slider background photo */}
        <div
          key={current}
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            backgroundImage:    slide.image ? `url(${slide.image})` : undefined,
            backgroundSize:     'cover',
            // Balanced centered crop (wide images chosen to suit this)
            backgroundPosition: 'center',
          }}
        >
          {/* Gradient fallback jab photo nahi ho */}
          {!slide.image && (
            <div className={`absolute inset-0 bg-gradient-to-br ${SLIDE_GRADIENTS[current % SLIDE_GRADIENTS.length]}`} />
          )}
          {/* Dark overlay — center (text ke peeche) gehra, edges par halka taake photo dikhe */}
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at center, rgba(2,6,23,0.78) 0%, rgba(2,6,23,0.55) 55%, rgba(2,6,23,0.28) 100%)' }}
          />
        </div>

        {/* ── Hero Text — bilkul center mein ── */}
        <div
          className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 py-12"
        >
          {/* Main heading — Institute name */}
          <h1
            className="font-display font-bold leading-tight mb-3 text-white max-w-3xl text-balance"
            style={{ fontSize: 'clamp(1.15rem, 3.2vw, 2.4rem)' }}
          >
            Government Technical Training Institute — D.G. Khan
          </h1>

          {/* Subtitle — tagline */}
          <p
            className="font-medium leading-snug mb-5"
            style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.35rem)', color: 'rgba(255,255,255,0.85)' }}
          >
            Empowering Future Tech Leaders
          </p>

          {/* Description */}
          <p
            className="text-sm max-w-xl mx-auto mb-4 leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.75)' }}
          >
            Pakistan&apos;s most advanced technical institute portal — AI-powered CV building,
            verified student profiles, real-time job matching, and intelligent career guidance,
            all in one place.
          </p>

          {/* Current slide badge */}
          <div
            className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.3)', color: '#67e8f9' }}
          >
            <Star size={11} />
            {slide.badge} — {slide.title}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register" className="btn-gold text-sm px-8 py-3">
              <Star size={15} /> Join as Student
            </Link>
            <Link href="/shining-stars" className="btn-outline text-sm px-8 py-3">
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
          style={{ background: 'linear-gradient(to top, rgba(2,6,23,0.8), transparent)' }}
        >
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
                aria-label={`Slide ${i + 1}`}
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

        {/* Placement Gallery label */}
        <div className="absolute top-4 right-6 z-20">
          <div
            className="text-xs font-medium px-3 py-1 rounded-full"
            style={{ background: 'rgba(2,6,23,0.6)', color: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Placement Gallery
          </div>
        </div>
      </div>

      {/* ── Announcements Ticker ── */}
      <div
        className="w-full overflow-hidden flex items-center"
        style={{
          background:   'rgba(2,6,23,0.97)',
          borderTop:    '1px solid rgba(34,211,238,0.2)',
          borderBottom: '1px solid rgba(34,211,238,0.2)',
          height:       '40px',
        }}
      >
        {/* LIVE label */}
        <div
          className="flex-shrink-0 flex items-center gap-2 px-4 h-full text-xs font-bold tracking-wider"
          style={{ background: 'rgba(34,211,238,0.15)', color: '#22d3ee', borderRight: '1px solid rgba(34,211,238,0.2)' }}
        >
          📢 LIVE
        </div>

        {/* Scrolling announcements */}
        <div className="flex-1 overflow-hidden">
          <div
            className="inline-flex items-center whitespace-nowrap text-xs font-medium"
            style={{ color: 'rgba(255,255,255,0.8)', animation: 'ticker-scroll 35s linear infinite' }}
          >
            <TickerSequence />
            <TickerSequence />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
