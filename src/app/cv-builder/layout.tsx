import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

// Server-side gate: CV Builder Grok API key use karta hai (limited),
// isliye sirf logged-in students hi yeh route access kar sakein.
// Wahi auth-token cookie + Session wala tareeqa jo career-test route mein hai.
export const dynamic = 'force-dynamic'

export default async function CVBuilderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const token = cookies().get('auth-token')?.value

  if (!token) {
    redirect('/auth/login')
  }

  const session = await prisma.session.findUnique({ where: { token } })

  if (!session || session.expiresAt < new Date()) {
    redirect('/auth/login')
  }

  // Valid session -> CV Builder page render hone do
  return <>{children}</>
}
