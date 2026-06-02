import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ArrowLeft, Briefcase, Plus } from 'lucide-react'
import JobsManager, { JobRow } from '@/components/JobsManager'

// Prisma + cookies use ho rahe hain -> static render mat karo
export const dynamic = 'force-dynamic'

export default async function ManageJobsPage() {
  // Admin auth gate (wahi pattern jo manage-students page mein hai)
  const token = cookies().get('auth-token')?.value
  if (!token) redirect('/auth/login')

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  })
  if (!session || session.expiresAt < new Date() || session.user.role !== 'ADMIN') {
    redirect('/auth/login')
  }

  const jobs = await prisma.job.findMany({ orderBy: { createdAt: 'desc' } })

  const initialJobs: JobRow[] = jobs.map((j) => ({
    id: j.id,
    title: j.title,
    company: j.company,
    location: j.location,
    type: j.type,
    description: j.description,
    salary: j.salary ?? null,
    deadline: j.deadline ? j.deadline.toISOString() : null,
    isActive: j.isActive,
  }))

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm mb-8 hover:text-cyan-400 transition-colors"
              style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400/20 to-emerald-600/20 border border-green-400/30 flex items-center justify-center">
              <Briefcase size={24} className="text-green-400" />
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl text-slate-900">Manage Jobs</h1>
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm">Edit ya remove karein — saari posted jobs</p>
            </div>
          </div>
          <Link href="/admin/jobs/new" className="btn-primary text-sm flex items-center gap-2">
            <Plus size={15} /> Post Job
          </Link>
        </div>

        <JobsManager initialJobs={initialJobs} />
      </div>
    </div>
  )
}
