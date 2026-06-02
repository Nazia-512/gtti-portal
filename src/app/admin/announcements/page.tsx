import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Bell, Plus, ArrowLeft } from 'lucide-react'
import AnnouncementsManager, { AnnouncementRow } from '@/components/AnnouncementsManager'

export const dynamic = 'force-dynamic'

export default async function AnnouncementsPage() {
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

  const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: 'desc' } })

  const initialAnnouncements: AnnouncementRow[] = announcements.map((a) => ({
    id: a.id,
    title: a.title,
    content: a.content,
    priority: a.priority,
    createdAt: a.createdAt.toISOString(),
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
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-amber-600/20 border border-yellow-400/30 flex items-center justify-center">
              <Bell size={24} className="text-yellow-400" />
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl text-slate-900">Announcements</h1>
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm">Manage all announcements</p>
            </div>
          </div>
          <Link href="/admin/announcements/new" className="btn-primary text-sm flex items-center gap-2">
            <Plus size={15} /> New Announcement
          </Link>
        </div>

        <AnnouncementsManager initialAnnouncements={initialAnnouncements} />
      </div>
    </div>
  )
}
