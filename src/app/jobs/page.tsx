import Link from 'next/link'
import { PrismaClient } from '@prisma/client'
import { Briefcase, MapPin, DollarSign, ArrowLeft, Calendar, Clock } from 'lucide-react'

const prisma = new PrismaClient()

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

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
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

        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          <span className="text-green-400 font-semibold">{jobs.length}</span> opportunities available
        </p>

        {/* Jobs List */}
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <div className="text-center py-20">
              <Briefcase size={48} className="mx-auto mb-4 opacity-20 text-green-400" />
              <p style={{ color: 'var(--text-muted)' }}>Abhi koi job available nahi hai.</p>
            </div>
          ) : (
            jobs.map(job => (
              <div key={job.id} className="glass-card rounded-2xl p-6 border border-green-500/10 hover:border-green-400/30 transition-all">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <h3 className="font-semibold text-white">{job.title}</h3>
                      <span className={`badge ${TYPE_COLORS[job.type]}`}>{TYPE_LABELS[job.type]}</span>
                    </div>
                    <p className="text-sm font-medium" style={{ color: 'var(--cyan)' }}>{job.company}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 my-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span className="flex items-center gap-1.5"><MapPin size={12} />{job.location}</span>
                  {job.salary && <span className="flex items-center gap-1.5"><DollarSign size={12} />{job.salary}</span>}
                  {job.deadline && <span className="flex items-center gap-1.5"><Calendar size={12} />Deadline: {new Date(job.deadline).toLocaleDateString()}</span>}
                </div>

                <p className="text-sm mb-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {job.description}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Post Job CTA */}
        <div className="mt-12 glass-card rounded-2xl p-6 text-center border border-dashed" style={{ borderColor: 'var(--border)' }}>
          <Clock size={24} className="mx-auto mb-3 text-green-400" />
          <p className="font-semibold text-white mb-1">Are you an Employer?</p>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            Post jobs specifically for GTTI graduates.
          </p>
          <Link href="/admin" className="btn-primary text-sm">Contact Placement Office</Link>
        </div>
      </div>
    </div>
  )
}