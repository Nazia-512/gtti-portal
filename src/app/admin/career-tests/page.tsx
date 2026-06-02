import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import CareerTestsView, { type CareerTestRow } from './CareerTestsView'

// Prisma + cookies use ho rahe hain -> static render mat karo
export const dynamic = 'force-dynamic'

export default async function CareerTestsAdminPage() {
  // Role-based auth: auth-token cookie -> Session -> User.role === ADMIN
  // (wahi session tareeqa jo career-test route mein hai)
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

  const tests = await prisma.careerTest.findMany({
    orderBy: { testDate: 'desc' },
    select: {
      id: true,
      studentName: true,
      rollNo: true,
      trade: true,
      year: true,
      recommendedPathway: true,
      testDate: true,
    },
  })

  // Date ko client ke liye serialize kar do
  const rows: CareerTestRow[] = tests.map((t) => ({
    ...t,
    testDate: t.testDate.toISOString(),
  }))

  return <CareerTestsView rows={rows} />
}
