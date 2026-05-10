import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

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
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())