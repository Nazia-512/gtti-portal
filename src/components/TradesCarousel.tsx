'use client'
import React, { useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react'

export interface TradeItem {
  id: string
  imageUrl: string
  alt: string | null
}

export default function TradesCarousel({ trades }: { trades: TradeItem[] }): React.ReactElement {
  const trackRef = useRef<HTMLDivElement>(null)
  // Two independent pause reasons; auto-scroll only runs when both are false.
  const hoverRef = useRef(false)   // pointer is over the carousel
  const manualRef = useRef(false)  // an arrow-triggered smooth scroll is in flight
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Ek card (+ gap) jitna slide karo, smooth
  const slide = (dir: 1 | -1): void => {
    const el = trackRef.current
    if (!el) return
    // Pause the auto-scroll while the native smooth scroll runs, otherwise the
    // rAF loop overwrites scrollLeft each frame and cancels the animation.
    manualRef.current = true
    const card = el.querySelector('[data-card]') as HTMLElement | null
    const gap = 20 // gap-5
    const amount = card ? card.offsetWidth + gap : el.clientWidth
    el.scrollBy({ left: dir * amount, behavior: 'smooth' })
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
    // Resume drifting once the smooth scroll has settled (unless still hovered).
    resumeTimer.current = setTimeout(() => { manualRef.current = false }, 700)
  }

  // Slow continuous auto-scroll (marquee-style). The track renders the
  // cards twice, so we can loop seamlessly by wrapping at the halfway point.
  useEffect(() => {
    const el = trackRef.current
    if (!el || trades.length === 0) return
    let raf = 0
    const tick = (): void => {
      if (!hoverRef.current && !manualRef.current) {
        el.scrollLeft += 0.4
        const half = el.scrollWidth / 2
        if (half > 0 && el.scrollLeft >= half) el.scrollLeft -= half
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      if (resumeTimer.current) clearTimeout(resumeTimer.current)
    }
  }, [trades.length])

  return (
    <section className="relative z-10 pt-10 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="star-badge inline-flex mb-4"><GraduationCap size={12} /> Programs</div>
          <h2 className="font-display font-bold text-4xl mb-4">
            Trades &amp; Courses <span className="gold-text">Offered</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)' }} className="max-w-xl mx-auto">
            Skill-based programs designed to launch your technical career.
          </p>
        </div>

        {trades.length === 0 ? (
          /* Empty state */
          <div className="glass-card rounded-2xl text-center py-16 max-w-xl mx-auto">
            <GraduationCap size={48} className="mx-auto mb-4 opacity-20 text-blue-500" />
            <p style={{ color: 'var(--text-muted)' }}>Trades will be added here soon.</p>
          </div>
        ) : (
          <div
            className="relative"
            onMouseEnter={() => { hoverRef.current = true }}
            onMouseLeave={() => { hoverRef.current = false }}
          >
            {/* Prev arrow */}
            <button
              type="button"
              onClick={() => slide(-1)}
              aria-label="Previous"
              className="hidden sm:flex absolute -left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center rounded-full bg-white border shadow-md hover:bg-blue-50 hover:-translate-y-1/2 transition-colors"
              style={{ borderColor: 'var(--border)', color: '#1d4ed8' }}
            >
              <ChevronLeft size={20} />
            </button>

            {/* Track */}
            <div
              ref={trackRef}
              className="trades-track flex gap-5 overflow-x-auto pb-2"
              style={{ scrollbarWidth: 'none' }}
            >
              {[...trades, ...trades].map((t, i) => (
                <div
                  key={`${t.id}-${i}`}
                  data-card
                  className="shrink-0 basis-full sm:basis-[calc(50%-10px)] lg:basis-[calc(33.333%-14px)]"
                >
                  <div className="rounded-2xl bg-white border shadow-sm overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                       style={{ borderColor: 'var(--border)' }}>
                    <div className="bg-slate-50 aspect-[4/5] flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={t.imageUrl} alt={t.alt ?? 'GTTI Trade / Course'} className="w-full h-full object-contain" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Next arrow */}
            <button
              type="button"
              onClick={() => slide(1)}
              aria-label="Next"
              className="hidden sm:flex absolute -right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center rounded-full bg-white border shadow-md hover:bg-blue-50 hover:-translate-y-1/2 transition-colors"
              style={{ borderColor: 'var(--border)', color: '#1d4ed8' }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        .trades-track::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  )
}
