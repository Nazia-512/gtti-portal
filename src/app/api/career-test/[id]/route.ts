import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const careerTest = await prisma.careerTest.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        studentName: true,
        rollNo: true,
        trade: true,
        institute: true,
        testDate: true,
        sectionA: true,
        sectionB: true,
        scores: true,
        recommendedPathway: true,
      },
    })

    if (!careerTest) {
      return NextResponse.json(
        { error: 'Career test not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ careerTest })
  } catch (error) {
    console.error('Error fetching career test:', error)
    return NextResponse.json(
      { error: 'Failed to fetch career test' },
      { status: 500 }
    )
  }
}
