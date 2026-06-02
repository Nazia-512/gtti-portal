import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import {
  calculatePathway,
  type SectionAAnswer,
  type SectionBAnswer,
} from '@/lib/careerScoring'

export const dynamic = 'force-dynamic'

const sectionASchema = z.record(
  z.string(),
  z.enum(['always', 'sometimes', 'rarely'])
)

const sectionBSchema = z.record(z.string(), z.enum(['yes', 'notsure', 'no']))

const bodySchema = z.object({
  studentName: z.string().min(1),
  rollNo: z.string().min(1),
  trade: z.string().min(1),
  institute: z.string().min(1),
  year: z.string().min(1),
  sectionA: sectionASchema,
  sectionB: sectionBSchema,
})

export async function POST(request: NextRequest) {
  try {
    // Auth: 'auth-token' cookie se Session lookup karke logged-in user nikaalo
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const session = await prisma.session.findUnique({ where: { token } })

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const studentId = session.userId

    // Body validate karo
    const body = await request.json()
    const parsed = bodySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { studentName, rollNo, trade, institute, year, sectionA, sectionB } =
      parsed.data

    // Ek student sirf ek baar test de sakta hai
    const existing = await prisma.careerTest.findUnique({
      where: { studentId },
      select: { id: true },
    })

    if (existing) {
      return NextResponse.json(
        {
          error: 'Test already submitted',
          alreadySubmitted: true,
          id: existing.id,
        },
        { status: 409 }
      )
    }

    // Scores aur recommended pathway calculate karo
    const { scores, recommendedPathway } = calculatePathway(
      sectionA as Record<string, SectionAAnswer>,
      sectionB as Record<string, SectionBAnswer>
    )

    // CareerTest record banao
    const careerTest = await prisma.careerTest.create({
      data: {
        studentId,
        studentName,
        rollNo,
        trade,
        institute,
        year,
        sectionA,
        sectionB,
        scores,
        recommendedPathway,
      },
    })

    return NextResponse.json(
      { success: true, id: careerTest.id, recommendedPathway },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating career test:', error)
    return NextResponse.json(
      { error: 'Failed to submit career test' },
      { status: 500 }
    )
  }
}
