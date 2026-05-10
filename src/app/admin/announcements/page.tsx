import Link from 'next/link'
import { PrismaClient } from '@prisma/client'
import { Bell, Plus, ArrowLeft } from 'lucide-react'

const prisma = new PrismaClient()

const priorityColor: Record<string, string> = {
  URGENT: 'badge-red',
  HIGH: 'badge-gold',
  NORMAL: 'badge-cyan',
  LOW: 'badge-green',
}

export default async function AnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' }
  })

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
              <h1 className="font-display font-bold text-3xl text-white">Announcements</h1>
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm">Manage all announcements</p>
            </div>
          </div>
          <Link href="/admin/announcements/new" className="btn-primary text-sm flex items-center gap-2">
            <Plus size={15} /> New Announcement
          </Link>
        </div>

        <div className="space-y-4">
          {announcements.length === 0 ? (
            <div className="text-center py-20 glass-card rounded-2xl">
              <Bell size={48} className="mx-auto mb-4 opacity-20 text-yellow-400" />
              <p style={{ color: 'var(--text-muted)' }}>Koi announcement nahi hai</p>
              <Link href="/admin/announcements/new" className="btn-primary mt-4 text-sm">
                Pehli Announcement Add Karo
              </Link>
            </div>
          ) : (
            announcements.map((a) => (
              <div key={a.id} className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`badge ${priorityColor[a.priority]}`}>{a.priority}</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {new Date(a.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-semibold text-white mb-2">{a.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{a.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}