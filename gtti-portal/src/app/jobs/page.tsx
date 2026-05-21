'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Briefcase, MapPin, Clock, DollarSign, ArrowLeft, Search, Filter, ExternalLink, Calendar } from 'lucide-react'

const JOBS = [
  {
    id: '1', title: 'Junior Software Developer', company: 'TechVision Pvt Ltd', location: 'Lahore',
    type: 'FULL_TIME', salary: '40,000–60,000 PKR', deadline: '2024-02-28',
    description: 'We are looking for a passionate junior developer with knowledge of web technologies.',
    requirements: ['HTML/CSS', 'JavaScript', 'Basic React', 'Problem Solving'],
    tags: ['Computer Technology'],
  },
  {
    id: '2', title: 'Electrical Technician', company: 'WAPDA', location: 'D.G. Khan',
    type: 'FULL_TIME', salary: '35,000–50,000 PKR', deadline: '2024-03-15',
    description: 'Experienced electrical technician required for field operations and maintenance.',
    requirements: ['DAE Electrical', 'PLC Knowledge', 'Safety Protocols', 'Team Work'],
    tags: ['Electrical Technology'],
  },
  {
    id: '3', title: 'AutoCAD Draftsman', company: 'BuildPro Engineering', location: 'Multan',
    type: 'FULL_TIME', salary: '30,000–45,000 PKR', deadline: '2024-02-20',
    description: 'Civil department graduate required for drafting and design work.',
    requirements: ['AutoCAD', 'Civil Drawings', 'MS Office', 'Attention to Detail'],
    tags: ['Civil Technology'],
  },
  {
    id: '4', title: 'Web Development Intern', company: 'DigiPak Solutions', location: 'Remote',
    type: 'INTERNSHIP', salary: '15,000–25,000 PKR', deadline: '2024-03-10',
    description: '3-month paid internship for final year CS/IT students.',
    requirements: ['HTML/CSS', 'JavaScript', 'Eagerness to Learn'],
    tags: ['Computer Technology'],
  },
  {
    id: '5', title: 'Electronics Technician', company: 'Samsung Service Center', location: 'DG Khan',
    type: 'FULL_TIME', salary: '28,000–40,000 PKR', deadline: '2024-02-25',
    description: 'Repair and maintenance of consumer electronics products.',
    requirements: ['DAE Electronics', 'Circuit Testing', 'Soldering', 'Customer Service'],
    tags: ['Electronics'],
  },
  {
    id: '6', title: 'Network Admin Trainee', company: 'CyberNet Pvt Ltd', location: 'Lahore',
    type: 'INTERNSHIP', salary: '20,000 PKR', deadline: '2024-03-20',
    description: '6-month networking internship with potential for full-time conversion.',
    requirements: ['Basic Networking', 'Windows Server Basics', 'Problem Solving'],
    tags: ['Computer Technology'],
  },
]

const TYPE_COLORS: Record<string, string> = {
  FULL_TIME: 'badge-green',
  INTERNSHIP: 'badge-cyan',
  PART_TIME: 'badge-gold',
  CONTRACT: 'badge-red',
}

const TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'Full Time',
  INTERNSHIP: 'Internship',
  PART_TIME: 'Part Time',
  CONTRACT: 'Contract',
}

export default function JobsPage() {
  const [search, setSearch] = useState('')
  const [type, setType]     = useState('ALL')

  const filtered = JOBS.filter(j => {
    const matchType   = type === 'ALL' || j.type === type
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
                        j.company.toLowerCase().includes(search.toLowerCase()) ||
                        j.location.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 hover:text-cyan-400 transition-colors"
              style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Back to Portal
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400/20 to-emerald-600/20 border border-green-400/30 flex items-center justify-center">
            <Briefcase size={24} className="text-green-400" />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl text-white">Jobs & Internships</h1>
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
              Curated opportunities for GTTI graduates
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-2xl p-4 mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search jobs, companies, locations..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="input-field pl-10" />
          </div>
          <div className="flex gap-2">
            <Filter size={16} className="self-center flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
            {['ALL', 'FULL_TIME', 'INTERNSHIP', 'PART_TIME'].map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  type === t ? 'bg-green-400 text-gray-900' : 'hover:bg-green-400/10 hover:text-green-400'
                }`}
                style={type !== t ? { color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.04)' } : {}}>
                {t === 'ALL' ? 'All' : TYPE_LABELS[t]}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          <span className="text-green-400 font-semibold">{filtered.length}</span> opportunities available
        </p>

        {/* Jobs List */}
        <div className="space-y-4">
          {filtered.map(job => (
            <div key={job.id} className="glass-card rounded-2xl p-6 border border-green-500/10 hover:border-green-400/30 transition-all">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <h3 className="font-semibold text-white">{job.title}</h3>
                    <span className={`badge ${TYPE_COLORS[job.type]}`}>{TYPE_LABELS[job.type]}</span>
                  </div>
                  <p className="text-sm font-medium" style={{ color: 'var(--cyan)' }}>{job.company}</p>
                </div>
                <button className="btn-outline text-xs py-1.5 px-3 flex-shrink-0">
                  Apply Now <ExternalLink size={11} />
                </button>
              </div>

              <div className="flex flex-wrap gap-4 my-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <span className="flex items-center gap-1.5"><MapPin size={12} />{job.location}</span>
                <span className="flex items-center gap-1.5"><DollarSign size={12} />{job.salary}</span>
                <span className="flex items-center gap-1.5"><Calendar size={12} />Deadline: {job.deadline}</span>
              </div>

              <p className="text-sm mb-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {job.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {job.requirements.map(r => (
                  <span key={r} className="badge badge-cyan">{r}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Briefcase size={48} className="mx-auto mb-4 opacity-20 text-green-400" />
            <p style={{ color: 'var(--text-muted)' }}>No jobs found matching your search.</p>
          </div>
        )}

        {/* Post Job CTA for Admin */}
        <div className="mt-12 glass-card rounded-2xl p-6 text-center border border-dashed" style={{ borderColor: 'var(--border)' }}>
          <Clock size={24} className="mx-auto mb-3 text-green-400" />
          <p className="font-semibold text-white mb-1">Are you an Employer?</p>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            Post jobs specifically for GTTI graduates. Contact our Placement Officer.
          </p>
          <Link href="/admin" className="btn-primary text-sm">Contact Placement Office</Link>
        </div>
      </div>
    </div>
  )
}
