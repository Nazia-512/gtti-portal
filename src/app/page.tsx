import React from 'react'
import Link from 'next/link'
import {
  Star, FileText, MessageSquare, Briefcase,
  Users, ChevronRight, Award
} from 'lucide-react'
import HeroSlider from '@/components/HeroSlider'
import HomeNav from '@/components/HomeNav'
import ShiningStarsSlider from '@/components/ShiningStarsSlider'
import TradesCarousel, { type TradeItem } from '@/components/TradesCarousel'
import { prisma } from '@/lib/prisma'

// Prisma server-side counts use ho rahe hain — static prerender mat karo
export const dynamic = 'force-dynamic'

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
  value: number
  suffix: string
  label: string
  icon: React.ElementType
}

const FEATURES: Feature[] = [
  { icon: Star,            title: 'Shining Stars',        description: 'Celebrating our top-performing students with verified achievement profiles visible to employers.', color: 'gold',   href: '/shining-stars',   badge: 'Featured'   },
  { icon: FileText,        title: 'AI CV Builder',        description: 'Generate ATS-optimized resumes tailored for your field using Claude AI in seconds.',              color: 'cyan',   href: '/cv-builder',      badge: 'AI Powered' },
  { icon: MessageSquare,   title: 'AI Chatbot',           description: 'Get instant answers about courses, careers, scholarships, and study guidance 24/7.',              color: 'cyan',   href: '/student/chat',    badge: 'AI Powered' },
  { icon: Briefcase,       title: 'Jobs & Internships',   description: 'Curated opportunities from verified employers looking specifically for GTTI graduates.',          color: 'green',  href: '/jobs',            badge: 'Live'       },
]

const colorMap: Record<string, string> = {
  gold: 'border-yellow-500/30 hover:border-yellow-400/60', cyan: 'border-cyan-500/30 hover:border-cyan-400/60',
  green: 'border-green-500/30 hover:border-green-400/60', purple: 'border-purple-500/30 hover:border-purple-400/60',
  orange: 'border-orange-500/30 hover:border-orange-400/60', blue: 'border-blue-500/30 hover:border-blue-400/60',
  red: 'border-red-500/30 hover:border-red-400/60',
}
const iconColorMap: Record<string, string> = {
  gold: 'text-yellow-400', cyan: 'text-cyan-400', green: 'text-green-400',
  purple: 'text-purple-400', orange: 'text-orange-400', blue: 'text-blue-400', red: 'text-red-400',
}
const bgGlowMap: Record<string, string> = {
  gold: 'bg-yellow-500/10', cyan: 'bg-cyan-500/10', green: 'bg-green-500/10',
  purple: 'bg-purple-500/10', orange: 'bg-orange-500/10', blue: 'bg-blue-500/10', red: 'bg-red-500/10',
}

function StarBackground(): React.ReactElement {
  const stars = Array.from({ length: 60 }, (_: unknown, i: number) => i)
  return (
    <div className="stars-bg" aria-hidden="true">
      {stars.map((i: number) => (
        <div key={i} className="star-dot" style={{
          left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
          width: `${Math.random() * 2 + 1}px`, height: `${Math.random() * 2 + 1}px`,
          animationDelay: `${Math.random() * 4}s`, animationDuration: `${Math.random() * 3 + 3}s`,
          opacity: Math.random() * 0.5 + 0.1,
        }} />
      ))}
    </div>
  )
}

export default async function HomePage(): Promise<React.ReactElement> {
  // ── Real live stats DB se (server-side) ──
  const [studentCount, jobCount, starCount, starRecords, tradeRecords] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.job.count(),
    prisma.shinningStar.count(),
    prisma.shinningStar.findMany({
      // Sirf public-safe fields — wahi jo public shining-stars page par dikhte hain
      select: {
        id: true, name: true, photo: true, department: true, batch: true,
        position: true, company: true, story: true, skills: true,
        rollNumber: true, gpa: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    prisma.trade.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] }),
  ])

  const STATS: Stat[] = [
    { id: 'students', value: studentCount, suffix: '+', label: 'Registered Students', icon: Users     },
    { id: 'jobs',     value: jobCount,     suffix: '+', label: 'Jobs Posted',          icon: Briefcase },
    { id: 'stars',    value: starCount,    suffix: '+', label: 'Shining Stars',        icon: Award     },
  ]

  const tradeItems: TradeItem[] = tradeRecords.map((t) => ({
    id: t.id,
    imageUrl: t.imageUrl,
    alt: t.alt ?? null,
  }))


  return (
    <div className="relative min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <StarBackground />

      {/* ── Navbar — solid fixed header (client component), slider iske neeche shuru hota hai ── */}
      <HomeNav />

      {/* ══════════════════════════════════════════════
          HERO SLIDER — text slider ke background par
         ══════════════════════════════════════════════ */}
      <section className="relative z-10" style={{ paddingTop: '64px' }}>
        {/* HeroSlider mein hero text bhi hai — neeche dekho HeroSlider.tsx */}
        <HeroSlider />
      </section>

      {/* ── Stats — 3 live cards DB se ── */}
      <section className="relative z-10 px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STATS.map((stat: Stat) => (
              <div key={stat.id} className="glass-card rounded-xl p-5 text-center">
                <stat.icon size={20} className="text-cyan-400 mx-auto mb-2" />
                <div className="font-display font-bold text-2xl text-slate-900">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative z-10 pt-8 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="star-badge inline-flex mb-4"><Star size={12} /> Platform Features</div>
            <h2 className="font-display font-bold text-4xl mb-4">
              Everything You Need to <span className="gold-text">Succeed</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)' }} className="max-w-xl mx-auto">
              Comprehensive tools designed specifically for GTTI students and faculty.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f: Feature, i: number) => (
              <Link key={f.title} href={f.href}
                className={`glass-card rounded-2xl p-6 flex flex-col gap-4 cursor-pointer group border ${colorMap[f.color]}`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgGlowMap[f.color]}`}>
                    <f.icon size={22} className={iconColorMap[f.color]} />
                  </div>
                  {f.badge && <span className="badge badge-cyan text-xs">{f.badge}</span>}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-cyan-400 transition-colors">{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.description}</p>
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium mt-auto ${iconColorMap[f.color]} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Explore <ChevronRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Shining Stars — circular auto-scrolling slider (click -> read-only details) ── */}
      <ShiningStarsSlider stars={starRecords} />

      {/* ── Trades & Courses — image carousel (DB se, admin managed) ── */}
      <TradesCarousel trades={tradeItems} />

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t py-10 px-6" style={{ borderColor: 'var(--border)', background: 'rgba(4,13,42,0.8)' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="font-display font-bold text-white">GTTI Smart Portal</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Government Technical Training Institute, D.G. Khan, Punjab, Pakistan</p>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} GTTI D.G. Khan. Built with ❤️ for our students.
          </p>
        </div>
      </footer>
    </div>
  )
}
