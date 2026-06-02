import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ArrowLeft, Users } from 'lucide-react'
import StudentsManager, { StudentRow } from '@/components/StudentsManager'

// Prisma + cookies use ho rahe hain -> static render mat karo
export const dynamic = 'force-dynamic'

export default async function ManageStudentsPage() {
  // Role-based auth: auth-token cookie -> Session -> User.role === ADMIN
  // (wahi pattern jo app/admin/career-tests/page.tsx mein hai)
  const token = cookies().get('auth-token')?.value

  if (!token) {
    redirect('/auth/login')
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!session || session.expiresAt < new Date() || session.user.role !== 'ADMIN') {
    redirect('/auth/login')
  }

  // Saare registered students (Student model + linked User) — client manager ko plain data do
  const students = await prisma.student.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  })

  const initialStudents: StudentRow[] = students.map((s) => ({
    studentId: s.id,
    userId: s.userId,
    name: s.user.name,
    email: s.user.email,
    approved: s.user.approved ?? null,
    rollNumber: s.rollNumber,
    department: s.department,
    batch: s.batch,
    phone: s.phone ?? null,
  }))

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm mb-8 hover:text-cyan-400 transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 border border-cyan-400/30 flex items-center justify-center">
            <Users size={24} className="text-cyan-500" />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl text-slate-900">Manage Students</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Approve, edit ya remove karein — saare students ek jagah
            </p>
          </div>
        </div>

        <StudentsManager initialStudents={initialStudents} />
      </div>
    </div>
  )
}
