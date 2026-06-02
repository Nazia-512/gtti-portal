import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { FileText, MessageSquare, BookOpen, Sparkles, ArrowRight, GraduationCap } from 'lucide-react'
import LogoutButton from '@/app/admin/LogoutButton'

// Prisma + cookies use ho rahe hain, isliye static render mat karo
export const dynamic = 'force-dynamic'

export default async function StudentLandingPage() {
  // Auth: wahi tareeqa jo career-test route mein use hua
  // ('auth-token' cookie -> Session lookup -> userId)
  const token = cookies().get('auth-token')?.value

  if (!token) {
    redirect('/auth/login')
  }

  const session = await prisma.session.findUnique({ where: { token } })

  if (!session || session.expiresAt < new Date()) {
    redirect('/auth/login')
  }

  const studentId = session.userId

  // Student ka naam aur uska CareerTest record ek saath nikaal lo
  const [user, careerTest] = await Promise.all([
    prisma.user.findUnique({
      where: { id: studentId },
      select: { name: true },
    }),
    prisma.careerTest.findUnique({
      where: { studentId },
      select: { id: true },
    }),
  ])

  const firstName = user?.name?.trim().split(/\s+/)[0] || null
  const hasTaken = Boolean(careerTest)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
      {/* Top header bar */}
      <header className="sticky top-0 z-20 border-b border-blue-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/student" className="group flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-sm shadow-blue-600/30">
              <GraduationCap className="h-6 w-6" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-base font-bold tracking-tight text-gray-900 sm:text-lg">
                GTTI Smart Portal
              </span>
              <span className="text-[11px] font-medium uppercase tracking-wider text-blue-600">
                Student Dashboard
              </span>
            </span>
          </Link>
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
        {/* Welcome header */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {firstName ? `Welcome, ${firstName}!` : 'Welcome!'}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-gray-600 sm:text-base">
            Take the first step toward discovering your career path here.
          </p>
        </div>

        {/* Career Test status card */}
        {hasTaken ? (
          /* Test de chuke hain */
          <div className="overflow-hidden rounded-2xl border border-green-200 bg-white shadow-sm">
            <div className="flex flex-col items-center gap-5 p-8 text-center sm:flex-row sm:text-left">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-green-100">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900">
                  You have completed your Career Pathway Test
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Your result has been saved. View your result using the button below.
                </p>
              </div>
              <Link
                href={`/student/test/result?id=${careerTest!.id}`}
                className="inline-flex w-full items-center justify-center rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 sm:w-auto"
              >
                View My Result
              </Link>
            </div>
          </div>
        ) : (
          /* Test nahi diya */
          <div className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
            <div className="flex flex-col items-center gap-5 p-8 text-center sm:flex-row sm:text-left">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-100">
                <svg
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900">
                  Career Pathway Personality Test
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Answer a few short questions to discover which career path
                  best matches your personality.
                </p>
              </div>
              <Link
                href="/student/test"
                className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
              >
                Start Test
              </Link>
            </div>
          </div>
        )}

        {/* Tools / quick links */}
        <div className="mt-12">
          <div className="mb-5 flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Tools</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-blue-100 to-transparent" />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${tool.iconBg}`}
                >
                  <tool.icon className={`h-6 w-6 ${tool.iconColor}`} />
                </div>
                <h3 className="text-base font-semibold text-gray-900">{tool.title}</h3>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-gray-600">
                  {tool.desc}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition-all group-hover:gap-2">
                  Open <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

// Student tools — mojooda features ke links
const TOOLS = [
  {
    title: 'CV Builder',
    desc: 'Build an ATS-optimized professional CV with AI.',
    href: '/cv-builder',
    icon: FileText,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    title: 'Chatbot',
    desc: 'Get answers to your career and study questions from AI.',
    href: '/student/chat',
    icon: MessageSquare,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    title: 'Lessons',
    desc: 'View and download your lesson materials.',
    href: '/student/lessons',
    icon: BookOpen,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    title: 'AI Lesson Simplifier',
    desc: 'Paste any topic and get simple, easy-to-understand notes powered by AI.',
    href: '/student/lesson',
    icon: Sparkles,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
]
