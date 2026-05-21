'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Star, Award, GraduationCap, ArrowLeft, Search, ExternalLink, QrCode } from 'lucide-react'

// Mock data — replace with DB fetch in production
const SHINING_STARS = [
  {
    id: '1', name: 'Muhammad Ahmed Khan', rollNumber: 'GTTI-2024-001',
    department: 'Computer Technology', batch: '2022–2024', gpa: 3.92,
    skills: ['Python', 'React', 'Machine Learning', 'SQL'],
    achievement: 'First Position in Provincial Technical Skills Competition 2024',
    bio: 'Passionate developer who built an AI-based irrigation system for local farmers.',
    image: null,
  },
  {
    id: '2', name: 'Fatima Zara Malik', rollNumber: 'GTTI-2024-002',
    department: 'Electronics', batch: '2022–2024', gpa: 3.88,
    skills: ['Circuit Design', 'Arduino', 'PCB Design', 'IoT'],
    achievement: 'Best Final Year Project — Smart Home Automation',
    bio: 'Electronics enthusiast bridging hardware and software for smart solutions.',
    image: null,
  },
  {
    id: '3', name: 'Ali Hassan Bhatti', rollNumber: 'GTTI-2023-015',
    department: 'Computer Technology', batch: '2021–2023', gpa: 3.75,
    skills: ['Web Development', 'Node.js', 'MongoDB', 'UI/UX'],
    achievement: 'Gold Medal — National Vocational Skills Competition',
    bio: 'Full-stack developer currently working at a leading Lahore tech firm.',
    image: null,
  },
  {
    id: '4', name: 'Ayesha Noor', rollNumber: 'GTTI-2024-008',
    department: 'Civil Technology', batch: '2022–2024', gpa: 3.95,
    skills: ['AutoCAD', 'Structural Design', 'Project Management', 'Estimating'],
    achievement: 'Top of Batch — Highest GPA in Civil Department',
    bio: 'Passionate about sustainable construction and infrastructure development in Pakistan.',
    image: null,
  },
  {
    id: '5', name: 'Usman Tariq', rollNumber: 'GTTI-2023-022',
    department: 'Electrical Technology', batch: '2021–2023', gpa: 3.80,
    skills: ['PLC Programming', 'Industrial Automation', 'SCADA', 'Electrical Wiring'],
    achievement: 'Secured Job at WAPDA within 2 months of graduation',
    bio: 'Electrical engineer specializing in industrial automation and power systems.',
    image: null,
  },
  {
    id: '6', name: 'Sana Rehman', rollNumber: 'GTTI-2024-011',
    department: 'Computer Technology', batch: '2022–2024', gpa: 3.70,
    skills: ['Graphic Design', 'Adobe Suite', 'Video Editing', 'Social Media'],
    achievement: 'Won National Youth Innovation Award 2024',
    bio: 'Creative technologist merging design thinking with digital technology.',
    image: null,
  },
]

const DEPARTMENTS = ['All', 'Computer Technology', 'Electronics', 'Electrical Technology', 'Civil Technology']

function StarCard({ star }: { star: typeof SHINING_STARS[0] }) {
  const initials = star.name.split(' ').map(n => n[0]).join('').slice(0, 2)
  return (
    <div className="glass-card rounded-2xl overflow-hidden group border border-yellow-500/20 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10">
      {/* Top banner */}
      <div className="h-2 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600" />

      <div className="p-6">
        {/* Avatar + name */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-amber-600/20 border border-yellow-400/30 flex items-center justify-center">
              <span className="font-display font-bold text-lg text-yellow-400">{initials}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center">
              <Star size={10} className="text-navy-900 fill-current" style={{ color: '#020818' }} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-sm leading-tight truncate">{star.name}</h3>
            <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--cyan)' }}>{star.rollNumber}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{star.department}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="font-display font-bold text-yellow-400 text-lg">{star.gpa}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>GPA</div>
          </div>
        </div>

        {/* Achievement */}
        <div className="rounded-lg p-3 mb-4" style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)' }}>
          <div className="flex items-start gap-2">
            <Award size={14} className="text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{star.achievement}</p>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs mb-4 leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>{star.bio}</p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {star.skills.slice(0, 3).map(s => (
            <span key={s} className="badge badge-cyan">{s}</span>
          ))}
          {star.skills.length > 3 && (
            <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
              +{star.skills.length - 3}
            </span>
          )}
        </div>

        {/* Batch + Actions */}
        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
            <GraduationCap size={12} />
            {star.batch}
          </div>
          <div className="flex items-center gap-2">
            <button title="View QR" className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-cyan-400/10 hover:text-cyan-400"
                    style={{ color: 'var(--text-muted)' }}>
              <QrCode size={14} />
            </button>
            <Link href={`/student/profile/${star.id}`}
                  className="flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
              Profile <ExternalLink size={11} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ShiningStarsPage() {
  const [search,     setSearch]     = useState('')
  const [department, setDepartment] = useState('All')

  const filtered = SHINING_STARS.filter(s => {
    const matchDept   = department === 'All' || s.department === department
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                        s.skills.some(sk => sk.toLowerCase().includes(search.toLowerCase()))
    return matchDept && matchSearch
  })

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--bg-primary)' }}>
      {/* Background glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-5"
             style={{ background: 'radial-gradient(circle, #fbbf24, transparent)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* Back */}
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
          <h1 className="font-display font-bold text-4xl text-white mb-3">
            Shining <span className="gold-text">Stars</span>
          </h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Our best and brightest — students who exemplify excellence in academics, skills, and character.
          </p>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-2xl p-4 mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by name or skill..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {DEPARTMENTS.map(d => (
              <button
                key={d}
                onClick={() => setDepartment(d)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  department === d
                    ? 'bg-yellow-400 text-gray-900'
                    : 'hover:bg-yellow-400/10 hover:text-yellow-400'
                }`}
                style={department !== d ? { color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.04)' } : {}}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          Showing <span className="text-yellow-400 font-semibold">{filtered.length}</span> Shining Stars
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(star => <StarCard key={star.id} star={star} />)}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Star size={48} className="mx-auto mb-4 opacity-20 text-yellow-400" />
            <p style={{ color: 'var(--text-muted)' }}>No stars found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
