import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const before = await prisma.careerTest.count()
  console.log(`CareerTest records before delete: ${before}`)

  const result = await prisma.careerTest.deleteMany({})
  console.log(`Deleted ${result.count} CareerTest records.`)

  const after = await prisma.careerTest.count()
  console.log(`CareerTest records after delete: ${after}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
