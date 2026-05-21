'use client'
import Link from 'next/link'
import {
  LayoutDashboard, Users, Briefcase, Star, Bell, TrendingUp, ArrowLeft,
  UserCheck, AlertCircle, PlusCircle, Settings, BarChart3, Award
} from 'lucide-react'

const STATS = [
  { label: 'Total Students', value: '487', change: '+12 this month', icon: Users, color: 'cyan' },
  { label: 'Active Jobs', value: '24', change: '+3 this week', icon: Briefcase, color: 'green' },
  { label: 'Shining Stars', value: '52', change: '+5 this term', icon: Star, color: 'gold' },
  { label: 'Placements', value: '156', change: '32% rate', icon: TrendingUp, color: 'purple' },
]

const RECENT_STUDENTS = [
  { name: 'Muhammad Ahmed', dept: 'Computer Technology', status: 'active',  gpa: 3.9 },
  { name: 'Fatima Zara',    dept: 'Electronics',         status: 'active',  gpa: 3.8 },
  { name: 'Ali Hassan',     dept: 'Electrical',          status: 'placed',  gpa: 3.7 },
  { name: 'Ayesha Noor',    dept: 'Civil Technology',    status: 'active',  gpa: 3.95 },
  { name: 'Usman Tariq',    dept: 'Electrical',          status: 'placed',  gpa: 3.8 },
]

const ANNOUNCEMENTS = [
  { title: 'Final Exam Schedule Released', priority: 'HIGH',   time: '2 hours ago' },
  { title: 'Job Fair on March 15th',       priority: 'URGENT', time: '1 day ago'   },
  { title: 'New Scholarship Applications Open', priority: 'NORMAL', time: '3 days ago' },
]

const colorMap: Record<string, string> = {
  cyan:   'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  green:  'text-green-400 bg-green-400/10 border-green-400/20',
  gold:   'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
}

const priorityColor: Record<string, string> = {
  URGENT: 'badge-red',
  HIGH:   'badge-gold',
  NORMAL: 'badge-cyan',
}

const statusColor: Record<string, string> = {
  active: 'badge-cyan',
  placed: 'badge-green',
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 hover:text-cyan-400 transition-colors"
              style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Back to Portal
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-400/20 to-rose-600/20 border border-red-400/30 flex items-center justify-center">
              <LayoutDashboard size={24} className="text-red-400" />
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl text-white">Admin Dashboard</h1>
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm">GTTI D.G. Khan — Placement Office</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="btn-outline text-sm"><Bell size={15} /> Announcements</button>
            <button className="btn-primary text-sm"><PlusCircle size={15} /> Post Job</button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map(s => (
            <div key={s.label} className={`glass-card rounded-2xl p-5 border ${colorMap[s.color]}`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colorMap[s.color]}`}>
                  <s.icon size={18} />
                </div>
              </div>
              <p className="font-display font-bold text-3xl text-white mb-1">{s.value}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Students */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Users size={18} className="text-cyan-400" /> Recent Students
              </h2>
              <Link href="/admin/students" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {RECENT_STUDENTS.map((s, i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b last:border-0"
                     style={{ borderColor: 'var(--border)' }}>
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400/10 to-blue-600/10 border border-cyan-400/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-cyan-400">{s.name.split(' ').map(n=>n[0]).join('')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-white truncate">{s.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.dept}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`badge ${statusColor[s.status]} mb-1`}>{s.status}</span>
                    <p className="text-xs font-mono text-yellow-400">{s.gpa} GPA</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Announcements */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <Bell size={18} className="text-yellow-400" /> Announcements
                </h2>
                <button className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">+ Add</button>
              </div>
              <div className="space-y-3">
                {ANNOUNCEMENTS.map((a, i) => (
                  <div key={i} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`badge ${priorityColor[a.priority]}`}>{a.priority}</span>
                    </div>
                    <p className="text-sm text-white font-medium leading-tight">{a.title}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{a.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Settings size={18} className="text-red-400" /> Quick Actions
              </h2>
              <div className="space-y-2">
                {[
                  { icon: UserCheck, label: 'Approve Students',      color: 'text-cyan-400'  },
                  { icon: Star,       label: 'Assign Shining Stars',  color: 'text-yellow-400' },
                  { icon: Award,      label: 'Manage Certificates',   color: 'text-green-400' },
                  { icon: BarChart3,  label: 'View Analytics',        color: 'text-purple-400' },
                  { icon: AlertCircle,label: 'Pending Applications',  color: 'text-red-400'   },
                ].map(action => (
                  <button key={action.label}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium text-left transition-all hover:bg-white/5"
                    style={{ color: 'var(--text-secondary)' }}>
                    <action.icon size={16} className={action.color} />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
