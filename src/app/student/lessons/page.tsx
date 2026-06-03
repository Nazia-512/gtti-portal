import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import {
  ArrowLeft, BookOpen, FileText, Image as ImageIcon, Video,
  Presentation, ExternalLink,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

function TypeIcon({ type }: { type: string }) {
  switch (type) {
    case 'image': return <ImageIcon size={20} className="text-green-500" />
    case 'video': return <Video size={20} className="text-purple-500" />
    case 'ppt': return <Presentation size={20} className="text-orange-500" />
    default: return <FileText size={20} className="text-red-500" />
  }
}

export default async function StudentLessonsPage() {
  // Logged-in student — wahi auth pattern jo student landing page mein hai
  const token = cookies().get('auth-token')?.value
  if (!token) {
    redirect('/auth/login')
  }

  const session = await prisma.session.findUnique({ where: { token } })
  if (!session || session.expiresAt < new Date()) {
    redirect('/auth/login')
  }

  const lessons = await prisma.lesson.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/student"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
            <BookOpen className="h-7 w-7 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Lessons</h1>
          <p className="mt-1 text-sm text-gray-600">
            View and download your lesson materials here.
          </p>
        </div>

        {lessons.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-sm text-gray-500">No lessons are available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {lessons.map((l) => (
              <div
                key={l.id}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50">
                    <TypeIcon type={l.fileType} />
                  </div>
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-blue-600">
                    {l.fileType}
                  </span>
                </div>

                <h2 className="text-base font-semibold text-gray-900">{l.title}</h2>
                {l.description && (
                  <p className="mt-1 flex-1 text-sm text-gray-600">{l.description}</p>
                )}

                <a
                  href={l.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <ExternalLink size={15} /> Open / Download
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
