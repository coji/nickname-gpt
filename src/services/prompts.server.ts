import { prisma } from './database.server'

export const getSystemPrompt = async () => {
  return prisma.prompt.findFirstOrThrow({ where: { type: 'system' } })
}
