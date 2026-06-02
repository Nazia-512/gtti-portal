export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // User dhundho
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Email or password is incorrect!' }, { status: 401 })
    }

    // Password check karo
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: 'Email or password is incorrect!' }, { status: 401 })
    }

    // Approval gate: students jo abhi tak approved nahi (approved === false) login na kar saken.
    // Admins (aur legacy users jinka approved null hai) normal login karte hain.
    if (user.role === 'STUDENT' && user.approved === false) {
      return NextResponse.json(
        { error: 'Your account is pending admin approval.' },
        { status: 403 }
      )
    }

    // Session banao
    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    await prisma.session.create({
      data: { userId: user.id, token, expiresAt }
    })

    // Response mein token aur role bhejo
    const response = NextResponse.json({
      success: true,
      role: user.role,
      name: user.name
    })

    // Cookie set karo
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      expires: expiresAt,
      path: '/'
    })

    return response

  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}