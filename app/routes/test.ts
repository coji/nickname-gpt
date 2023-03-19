import { type LoaderArgs, json } from '@remix-run/node'
import { getMessageStore } from '~/services/message-store.server'

export const loader = ({ context }: LoaderArgs) => {
  const messageStore = getMessageStore(context)
  return json(messageStore)
}
