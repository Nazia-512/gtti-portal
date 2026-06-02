import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/adminAuth'
import { prisma } from '@/lib/prisma'
import LessonsManager, { type LessonRow } from './LessonsManager'

export const dynamic = 'force-dynamic'

export default async function AdminLessonsPage() {
  // Admin-only — wahi pattern jo baqi admin pages mein hai
  const admin = await getAdminUser()
  if (!admin) {
    redirect('/auth/login')
  }

  const lessons = await prisma.lesson.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const rows: LessonRow[] = lessons.map((l) => ({
    id: l.id,
    title: l.title,
    description: l.description,
    fileUrl: l.fileUrl,
    fileType: l.fileType,
    fileName: l.fileName,
    createdAt: l.createdAt.toISOString(),
  }))

  return <LessonsManager initialLessons={rows} />
}
