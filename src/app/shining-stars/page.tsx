import Link from 'next/link'
import { PrismaClient } from '@prisma/client'
import { Star, Award, GraduationCap, ArrowLeft } from 'lucide-react'

export const dynamic = "force-dynamic";

const prisma = new PrismaClient()

export default async function ShiningStarsPage() {
  const stars = await prisma.shinningStar.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--bg-primary)' }}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:text-cyan-400"
              style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Back to Portal
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
               style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.1))', border: '1px solid rgba(251,191,36,0.3)' }}>
            <Star size={28} className="text-yellow-400 fill-yellow-400/30" />
          </div>
          <h1 className="font-display font-bold text-4xl text-slate-900 mb-3">
            Shining <span className="gold-text">Stars</span>
          </h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Our best and brightest — students who exemplify excellence in academics, skills, and character.
          </p>
        </div>

        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          Showing <span className="text-yellow-400 font-semibold">{stars.length}</span> Shining Stars
        </p>

        {stars.length === 0 ? (
          <div className="text-center py-20">
            <Star size={48} className="mx-auto mb-4 opacity-20 text-yellow-400" />
            <p style={{ color: 'var(--text-muted)' }}>No Shining Stars yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {stars.map(star => {
              const initials = star.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)
              const skills = star.skills ? star.skills.split(',').map((s: string) => s.trim()) : []
              return (
                <div key={star.id} className="glass-card rounded-2xl overflow-hidden border border-yellow-500/20 hover:border-yellow-400/50 transition-all duration-300">
                  <div className="h-2 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600" />
                  <div className="p-6">

                    {/* Photo + Name */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative flex-shrink-0">
                        {star.photo ? (
                          <img src={star.photo} alt={star.name}
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-yellow-400/30" />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-amber-600/20 border border-yellow-400/30 flex items-center justify-center">
                            <span className="font-display font-bold text-lg text-yellow-400">{initials}</span>
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center">
                          <Star size={10} style={{ color: '#020818' }} className="fill-current" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 text-sm leading-tight truncate">{star.name}</h3>
                        {star.rollNumber && (
                          <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--cyan)' }}>{star.rollNumber}</p>
                        )}
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{star.department}</p>
                      </div>
                      {star.gpa && (
                        <div className="text-right flex-shrink-0">
                          <div className="font-display font-bold text-yellow-400 text-lg">{star.gpa}</div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>GPA</div>
                        </div>
                      )}
                    </div>

                    {/* Position + Company */}
                    {(star.position || star.company) && (
                      <div className="rounded-lg p-3 mb-4" style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)' }}>
                        <div className="flex items-start gap-2">
                          <Award size={14} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            {star.position}{star.position && star.company ? ' at ' : ''}{star.company}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Story */}
                    {star.story && (
                      <p className="text-xs mb-4 leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                        {star.story}
                      </p>
                    )}

                    {/* Skills */}
                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {skills.slice(0, 3).map((s: string) => (
                          <span key={s} className="badge badge-cyan">{s}</span>
                        ))}
                        {skills.length > 3 && (
                          <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                            +{skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Batch */}
                    <div className="flex items-center pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <GraduationCap size={12} />
                        {star.batch}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}