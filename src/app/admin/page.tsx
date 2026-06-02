import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import {
  LayoutDashboard, Users, Briefcase, Star, Bell, ArrowLeft, PlusCircle
} from 'lucide-react'
import LogoutButton from './LogoutButton'

export const dynamic = "force-dynamic";

// Icon chip colors per stat
const colorMap: Record<string, string> = {
  cyan:  'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
  green: 'text-green-500 bg-green-500/10 border-green-500/20',
  gold:  'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
}

const priorityColor: Record<string, string> = {
  URGENT: 'badge-red',
  HIGH:   'badge-gold',
  NORMAL: 'badge-cyan',
  LOW:    'badge-green',
}

export default async function AdminDashboard() {
  const [totalStudents, activeJobs, shiningStars, announcements, recentStudents] = await Promise.all([
    prisma.student.count(),
    prisma.job.count({ where: { isActive: true } }),
    prisma.shinningStar.count(),
    prisma.announcement.findMany({ orderBy: { createdAt: 'desc' }, take: 3 }),
    prisma.student.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { user: true } }),
  ])

  const STATS = [
    { label: 'Total Students', value: totalStudents.toString(), change: 'Registered students', icon: Users,     color: 'cyan'  },
    { label: 'Active Jobs',    value: activeJobs.toString(),    change: 'Open positions',      icon: Briefcase, color: 'green' },
    { label: 'Shining Stars',  value: shiningStars.toString(),  change: 'Top performers',      icon: Star,      color: 'gold'  },
  ]

  // Cohesive card base — saare cards consistent dikhein
  const cardBase = 'rounded-2xl bg-white border shadow-sm'

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm mb-6 hover:text-cyan-500 transition-colors" style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Back to Portal
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-6 mb-8 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-400/20 to-rose-600/20 border border-red-400/30 flex items-center justify-center flex-shrink-0">
              <LayoutDashboard size={24} className="text-red-500" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">Admin Dashboard</h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>GTTI D.G. Khan — Placement Office</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link href="/admin/announcements" className="btn-outline text-sm flex items-center gap-2">
              <Bell size={15} /> Announcements
            </Link>
            <Link href="/admin/jobs/new" className="btn-primary text-sm flex items-center gap-2">
              <PlusCircle size={15} /> Post Job
            </Link>
            <LogoutButton />
          </div>
        </div>

        {/* Stats — 3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {STATS.map((s) => (
            <div
              key={s.label}
              className={`${cardBase} p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md`}
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-start justify-between">
                <p className="text-xs font-medium mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${colorMap[s.color]}`}>
                  <s.icon size={20} />
                </div>
              </div>
              <p className="font-display font-bold text-3xl mt-3 text-slate-900">{s.value}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Students */}
          <div className={`lg:col-span-2 ${cardBase} p-6`} style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <Users size={18} className="text-cyan-500" /> Recent Students
              </h2>
              <Link href="/admin/students" className="text-xs font-medium text-cyan-500 hover:text-cyan-600 transition-colors">View All →</Link>
            </div>
            <div>
              {recentStudents.length === 0 ? (
                <p className="text-center py-8" style={{ color: 'var(--text-muted)' }}>Abhi koi student registered nahi hai</p>
              ) : (
                recentStudents.map((s, i) => (
                  <div key={i} className="flex items-center gap-4 py-3 border-b last:border-0 last:pb-0" style={{ borderColor: 'var(--border)' }}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400/10 to-blue-600/10 border border-cyan-400/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-cyan-500">
                        {s.user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-slate-900 truncate">{s.user.name}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{s.department}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="badge badge-green">Active</span>
                      <span className="text-xs font-mono text-yellow-500 w-16 text-right">{s.gpa ?? 0} GPA</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Announcements */}
          <div className={`${cardBase} p-6`} style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <Bell size={18} className="text-yellow-500" /> Announcements
              </h2>
              <Link href="/admin/announcements/new" className="text-xs font-medium text-cyan-500 hover:text-cyan-600 transition-colors">+ Add</Link>
            </div>
            <div className="space-y-3">
              {announcements.length === 0 ? (
                <p className="text-center py-4" style={{ color: 'var(--text-muted)' }}>Koi announcement nahi hai</p>
              ) : (
                announcements.map((a, i) => (
                  <div key={i} className="rounded-xl border p-3" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`badge ${priorityColor[a.priority] ?? 'badge-cyan'}`}>{a.priority}</span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {new Date(a.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-900 font-medium leading-snug">{a.title}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
