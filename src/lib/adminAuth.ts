import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export type SessionUser = { id: string; name: string; role: string }

/**
 * Server-side admin check — wahi pattern jo admin pages/APIs mein use hota hai.
 * Returns the admin user if a valid ADMIN session exists, warna null.
 *
 * Cookie request se bhi diya ja sakta hai (API routes ke liye),
 * warna next/headers cookies() se padha jaata hai (server components).
 */
export async function getAdminUser(
  token?: string | null
): Promise<SessionUser | null> {
  const authToken = token ?? cookies().get('auth-token')?.value

  if (!authToken) return null

  const session = await prisma.session.findUnique({
    where: { token: authToken },
    include: { user: true },
  })

  if (!session || session.expiresAt < new Date() || session.user.role !== 'ADMIN') {
    return null
  }

  return {
    id: session.user.id,
    name: session.user.name,
    role: session.user.role,
  }
}

/**
 * Sirf logged-in check (koi bhi role) — students ke liye.
 * Returns userId agar valid session hai, warna null.
 */
export async function getSessionUserId(
  token?: string | null
): Promise<string | null> {
  const authToken = token ?? cookies().get('auth-token')?.value

  if (!authToken) return null

  const session = await prisma.session.findUnique({ where: { token: authToken } })

  if (!session || session.expiresAt < new Date()) return null

  return session.userId
}
