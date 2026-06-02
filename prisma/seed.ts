import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Neutral gray placeholder image (data-URI SVG) — name baked in taake
// admin pehchaan sake ke kaunsa card replace karna hai (Canva design se).
function placeholderImage(name: string, n: number): string {
  // Naam ko chote chunks mein todho taake SVG par fit ho
  const words = name.split(' ')
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    if ((line + ' ' + w).trim().length > 16) {
      if (line) lines.push(line.trim())
      line = w
    } else {
      line = (line + ' ' + w).trim()
    }
  }
  if (line) lines.push(line.trim())

  const startY = 250 - (lines.length - 1) * 16
  const tspans = lines
    .map((l, i) => `<tspan x='200' y='${startY + i * 32}'>${l.replace(/&/g, '&amp;')}</tspan>`)
    .join('')

  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'>` +
    `<rect width='400' height='500' fill='#e2e8f0'/>` +
    `<rect x='18' y='18' width='364' height='464' rx='22' fill='#f1f5f9' stroke='#cbd5e1' stroke-width='2'/>` +
    `<circle cx='200' cy='150' r='40' fill='#cbd5e1'/>` +
    `<text x='200' y='160' font-family='Arial, sans-serif' font-size='34' font-weight='bold' fill='#64748b' text-anchor='middle'>${n}</text>` +
    `<text font-family='Arial, sans-serif' font-size='22' font-weight='bold' fill='#334155' text-anchor='middle'>${tspans}</text>` +
    `<text x='200' y='430' font-family='Arial, sans-serif' font-size='13' fill='#94a3b8' text-anchor='middle'>Placeholder — replace in admin</text>` +
    `</svg>`

  return 'data:image/svg+xml,' + encodeURIComponent(svg)
}

async function main() {
  // Admin account banana
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@gtti.edu.pk' },
    update: {},
    create: {
      name: 'GTTI Admin',
      email: 'admin@gtti.edu.pk',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('Admin created:', admin.email)

  // Trades/Courses seed — sirf tab jab koi trade maujood na ho (idempotent)
  const TRADE_NAMES = [
    'Computer Technology',
    'Diploma in Electrical (Electrician)',
    'Diploma in Electronics Technology',
    'Diploma in Mechanical Draftsman Technology',
    'Diploma in Auto Mechanic Technology',
    'Diploma in Welding Technology',
    'Diploma in HVACR',
    'Welding (Short Courses)',
    'Plumbing Technology',
    'AutoCAD',
  ]

  const existingTrades = await prisma.trade.count()
  if (existingTrades === 0) {
    await prisma.trade.createMany({
      data: TRADE_NAMES.map((name, i) => ({
        imageUrl: placeholderImage(name, i + 1),
        cloudinaryPublicId: '', // placeholder — koi real Cloudinary asset nahi
        alt: name,
        order: i + 1,
      })),
    })
    console.log(`Seeded ${TRADE_NAMES.length} trades (placeholders).`)
  } else {
    console.log(`Trades already exist (${existingTrades}) — seed skip kiya.`)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())