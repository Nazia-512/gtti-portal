import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, rollNumber, department, batch, phone } = await req.json()

    // Check karo email already exist karta hai?
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Yeh email already registered hai!' }, { status: 400 })
    }

    // Check karo roll number already exist karta hai?
    const existingRoll = await prisma.student.findUnique({ where: { rollNumber } })
    if (existingRoll) {
      return NextResponse.json({ error: 'Yeh roll number already registered hai!' }, { status: 400 })
    }

    // Password hash karo
    const hashedPassword = await bcrypt.hash(password, 10)

    // User aur Student ek saath banao
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'STUDENT',
        student: {
          create: {
            rollNumber,
            department,
            batch,
            phone,
            skills: '[]',
            achievements: '[]',
          }
        }
      }
    })

    return NextResponse.json({ success: true, message: 'Account ban gaya! Ab login karo.' })

  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}