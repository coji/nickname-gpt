import { type LoaderArgs } from '@remix-run/node'
import { eventStream } from 'remix-utils'
import {
  getMessageStore,
  type MessageStore,
} from '~/services/message-store.server'
import invariant from 'tiny-invariant'

export const loader = async ({ request, context }: LoaderArgs) => {
  const userId = getUserIdFromRequest(request)
  invariant(userId)

  const messageStore = getMessageStore(context)

  return createEventStream(request.signal, messageStore, userId)
}

function getUserIdFromRequest(request: Request): string | null {
  const url = new URL(request.url)
  return url.searchParams.get('userId')
}

function createEventStream(
  signal: AbortSignal,
  messageStore: MessageStore,
  userId: string,
) {
  return eventStream(signal, (send) => {
    const timer = setInterval(() => {
      const message = messageStore.pop(userId)

      if (message) {
        send({
          event: 'message',
          data: message,
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  })
}
