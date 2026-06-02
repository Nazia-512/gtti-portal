export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const slides = await prisma.sliderImage.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(slides)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: Request) {
  try {
    const slides = await req.json()

    if (!Array.isArray(slides)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i]

      if (slide.id) {
        await prisma.sliderImage.update({
          where: { id: slide.id },
          data: {
            image:    slide.image    ?? null,
            caption:  slide.caption  ?? '',
            subtitle: slide.subtitle ?? '',
            order:    i,
          },
        })
      } else {
        await prisma.sliderImage.create({
          data: {
            image:    slide.image    ?? null,
            caption:  slide.caption  ?? '',
            subtitle: slide.subtitle ?? '',
            order:    i,
          },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}