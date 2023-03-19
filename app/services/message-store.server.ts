import type { AppLoadContext } from '@remix-run/node'

export type MessageStore = ReturnType<typeof createMessagesStore>

export const getMessageStore = (context: AppLoadContext) => {
  return context.messageStore as MessageStore
}

export const createMessagesStore = () => {
  const messages = new Map<string, string[]>()

  const push = (userId: string, message: string) => {
    const current = messages.get(userId) || []
    messages.set(userId, [...current, message])
  }

  const pop = (userId: string) => {
    const current = messages.get(userId) || []
    const ret = current.at(-1)
    messages.set(userId, current.slice(1))
    return ret
  }

  return {
    push,
    pop,
    messages,
  }
}
