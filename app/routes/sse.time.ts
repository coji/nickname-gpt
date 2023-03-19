import { type LoaderArgs } from '@remix-run/node'
import { eventStream } from 'remix-utils'
import { getMessageStore } from '~/services/message-store.server'
import invariant from 'tiny-invariant'

export const loader = async ({ request, context }: LoaderArgs) => {
  const url = new URL(request.url)
  const userId = url.searchParams.get('userId')
  invariant(userId)

  const messages = getMessageStore(context)
  messages.push(userId, 'hoge')

  return eventStream(request.signal, (send) => {
    let timer = setInterval(() => {
      console.log('message', messages)

      //      if (message) {
      send({
        event: 'message',
        data: JSON.stringify(Object.fromEntries(messages.messages.entries())),
      })
      //      }
    }, 1000)

    return function clear() {
      clearInterval(timer)
    }
  })
}
