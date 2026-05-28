import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET — sirf visible slides return karo (home page ke liye)
export async function GET() {
  try {
    const slides = await prisma.sliderImage.findMany({
      where: { isVisible: true },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(slides)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

// POST — sab slides save karo (admin se)
export async function POST(req: Request) {
  try {
    const slides = await req.json()

    if (!Array.isArray(slides)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i]

      if (slide.id) {
        // Update existing
        await prisma.sliderImage.update({
          where: { id: slide.id },
          data: {
            image:     slide.image     ?? null,
            caption:   slide.caption   ?? '',
            subtitle:  slide.subtitle  ?? '',
            isVisible: slide.isVisible ?? true,
            order:     i,
          },
        })
      } else {
        // Create new
        await prisma.sliderImage.create({
          data: {
            image:     slide.image     ?? null,
            caption:   slide.caption   ?? '',
            subtitle:  slide.subtitle  ?? '',
            isVisible: slide.isVisible ?? true,
            order:     i,
          },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('Slider POST error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
