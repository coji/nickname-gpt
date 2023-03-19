import { type ActionArgs, json } from '@remix-run/node'
import { getMessageStore } from '~/services/message-store.server'
import { z } from 'zod'

const schema = z.object({
  userId: z.string().min(1),
  message: z.string().min(1),
})

export const action = async ({ request, context }: ActionArgs) => {
  const form = await request.formData()
  const { userId, message } = schema.parse(Object.fromEntries(form.entries()))
  const messageStore = getMessageStore(context)

  messageStore.push(userId, message)
  return json({ messageStore })
}
