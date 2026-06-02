export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value

    // Session DB se hata do (agar mojood ho)
    if (token) {
      try {
        await prisma.session.deleteMany({ where: { token } })
      } catch {
        // session delete fail ho to bhi cookie to clear karni hi hai
      }
    }

    const response = NextResponse.json({ success: true })

    // auth-token cookie clear karo
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
