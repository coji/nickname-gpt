import { prisma } from '~/services/database.server'

export const getSystemPrompt = async () => {
  const prompt = await prisma.prompt.findFirstOrThrow({
    where: { type: 'system' },
    select: { text: true },
  })
  return prompt.text
}

export const upsertSystemPrompt = async (prompt: string) => {
  return await prisma.prompt.upsert({
    where: { type: 'system' },
    create: { type: 'system', text: prompt },
    update: { text: prompt },
  })
}
