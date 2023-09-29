/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'fs/promises'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
  const systemPrompt = await fs.readFile(
    `${__dirname}/fixtures/system-prompt.txt`,
    'utf-8',
  )
  await prisma.prompt.upsert({
    where: { type: 'system' },
    create: { type: 'system', text: systemPrompt },
    update: { type: 'system', text: systemPrompt },
  })
  console.log(`Database has been seeded. 🌱`)
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
