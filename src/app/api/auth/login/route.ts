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
      return NextResponse.json({ error: 'Email ya password galat hai!' }, { status: 401 })
    }

    // Password check karo
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: 'Email ya password galat hai!' }, { status: 401 })
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