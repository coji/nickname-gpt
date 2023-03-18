import { prisma } from '~/services/database.server'

export const getSystemPrompt = async () => {
  const prompt = await prisma.prompt.findFirstOrThrow({
    where: { type: 'system' },
  })
  return prompt.text
}
