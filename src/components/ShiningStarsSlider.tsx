'use client'
import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Star, X, GraduationCap, Award, Hash, Sparkles } from 'lucide-react'

export interface PublicStar {
  id: string
  name: string
  photo: string | null
  department: string
  batch: string
  position: string | null
  company: string | null
  story: string | null
  skills: string
  rollNumber: string | null
  gpa: number | null
}

// Default avatar — jab Shining Star ke paas photo na ho (inline SVG, kabhi 404 nahi hoga)
const PLACEHOLDER_AVATAR =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='#dbeafe'/><circle cx='50' cy='38' r='17' fill='#93c5fd'/><path d='M22 84c0-15 13-25 28-25s28 10 28 25z' fill='#93c5fd'/></svg>"
  )

const initials = (name: string): string =>
  name.split(' ').map((n) => n[0]).join('').slice(0, 2)

export default function ShiningStarsSlider({ stars }: { stars: PublicStar[] }): React.ReactElement | null {
  const [selected, setSelected] = useState<PublicStar | null>(null)

  // Modal khula ho to: Esc se band karo + page scroll lock karo (sirf modal scroll kare)
  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent): void => { if (e.key === 'Escape') setSelected(null) }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [selected])

  if (stars.length === 0) return null

  // Thode records hon to set ko repeat karo taake row bhari lage,
  // phir x2 duplicate taake marquee seamless loop kare.
  let filled: PublicStar[] = stars
  while (filled.length < 8) filled = [...filled, ...stars]
  const loop: PublicStar[] = [...filled, ...filled]

  const slider = (
    <section className="relative z-10 px-6 pt-2 pb-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="star-badge inline-flex mb-3"><Star size={12} /> Our Shining Stars</div>
          <h2 className="font-display font-bold text-3xl">
            Our <span className="gold-text">Shining Stars</span>
          </h2>
        </div>

        {/* Marquee — edges par soft fade taake polished lage */}
        <div
          className="relative overflow-hidden"
          style={{ maskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)' }}
        >
          <div
            className="flex w-max items-center gap-6 sm:gap-8 py-2"
            // Modal khula ho to autoplay pause — warna chalta rahe
            style={{ animation: 'star-marquee 35s linear infinite', animationPlayState: selected ? 'paused' : 'running' }}
          >
            {loop.map((star: PublicStar, i: number) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelected(star)}
                aria-label={`View ${star.name} details`}
                className="flex-shrink-0 h-20 w-20 sm:h-28 sm:w-28 rounded-full overflow-hidden border-4 border-white shadow-lg ring-1 ring-blue-500/20 transition-transform duration-300 hover:scale-110 hover:ring-blue-500/50 cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={star.photo || PLACEHOLDER_AVATAR} alt={star.name} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes star-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes modal-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modal-pop {
          from { opacity: 0; transform: translateY(8px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

    </section>
  )

  return (
    <>
      {slider}

      {/* ── Read-only Detail Modal — document.body par portal taake koi ancestor
          transform/filter ise viewport se na hataye; centering reliable rahe ── */}
      {selected && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60"
          style={{ backdropFilter: 'blur(4px)', animation: 'modal-fade 0.2s ease-out' }}
          onClick={() => setSelected(null)}
        >
          <div
            className="glass-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
            style={{ animation: 'modal-pop 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky header — gold bar + photo/name + close X hamesha top par pinned, body scroll ho to bhi */}
            <div className="sticky top-0 z-10 rounded-t-2xl" style={{ background: '#ffffff' }}>
              <div className="h-2 rounded-t-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600" />
              <div className="flex items-start justify-between gap-4 px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-4 min-w-0">
                  {selected.photo ? (
                    <img src={selected.photo} alt={selected.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-yellow-400/30 flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-amber-600/20 border border-yellow-400/30 flex items-center justify-center flex-shrink-0">
                      <span className="font-display font-bold text-xl text-yellow-400">{initials(selected.name)}</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <h2 className="font-display font-bold text-xl text-slate-900 truncate">{selected.name}</h2>
                    {(selected.position || selected.department) && (
                      <p className="text-sm mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
                        {selected.position || selected.department}
                      </p>
                    )}
                  </div>
                </div>
                <button onClick={() => setSelected(null)}
                  className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center hover:bg-black/5 transition-colors"
                  style={{ color: 'var(--text-secondary)' }} aria-label="Close">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Body — scrollable jab content lamba ho (Success Story) */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <DetailItem icon={<GraduationCap size={14} className="text-cyan-400" />} label="Department" value={selected.department} />
                <DetailItem icon={<Hash size={14} className="text-cyan-400" />} label="Batch" value={selected.batch} />
                {selected.gpa != null && (
                  <DetailItem icon={<Star size={14} className="text-yellow-400" />} label="GPA" value={String(selected.gpa)} />
                )}
                {(selected.position || selected.company) && (
                  <DetailItem
                    icon={<Award size={14} className="text-yellow-400" />}
                    label="Position"
                    value={`${selected.position ?? ''}${selected.position && selected.company ? ' at ' : ''}${selected.company ?? ''}`}
                  />
                )}
              </div>

              {selected.skills && (
                <div className="mb-4">
                  <p className="text-xs mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                    <Sparkles size={13} className="text-cyan-400" /> Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.skills.split(',').map((s) => s.trim()).filter(Boolean).map((s) => (
                      <span key={s} className="badge badge-cyan">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {selected.story && (
                <div className="mb-5">
                  <p className="text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Success Story</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{selected.story}</p>
                </div>
              )}

              <div className="flex pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <button onClick={() => setSelected(null)} className="btn-outline text-sm ml-auto">Close</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg p-3" style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid var(--border)' }}>
      <p className="text-xs flex items-center gap-1.5 mb-1" style={{ color: 'var(--text-secondary)' }}>{icon} {label}</p>
      <p className="text-sm font-medium text-slate-900 break-words">{value}</p>
    </div>
  )
}
