import { type ActionArgs } from '@remix-run/node'
import { OpenAIChatStream } from '~/services/openai-chat-stream.server'
import invariant from 'tiny-invariant'
import { getSystemPrompt } from '~/models/prompts.server'

export const action = async ({ request }: ActionArgs) => {
  try {
    const formData = await request.formData()
    const input = formData.get('input')?.toString()
    invariant(input, 'Missing input')

    const systemPrompt = await getSystemPrompt()
    const stream = await OpenAIChatStream(
      {
        max_tokens: 2000,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: input },
        ],
      },
      {
        onComplete: (message) => {
          console.log({ input, message })
        },
      },
    )
    return stream
  } catch (error) {
    console.error('nickname generate action error: ', error)
    return new Response('Something went wrong', { status: 500 })
  }
}