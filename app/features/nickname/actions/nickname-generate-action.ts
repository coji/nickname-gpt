import { type ActionArgs } from '@remix-run/node'
import { getSystemPrompt } from '~/models/prompts.server'
import { AzureOpenAIChatStream } from '~/services/azure-chat-stream.server'
import { OpenAIChatStream } from '~/services/openai-chat-stream.server'

export const action = async ({ request }: ActionArgs) => {
  try {
    const formData = await request.formData()
    const input = formData.get('input')?.toString()
    if (!input) {
      throw new Response('Missing input', { status: 400 })
    }
    const provider = formData.get('provider')?.toString() ?? 'azure'

    const systemPrompt = await getSystemPrompt()

    let stream = null
    if (provider === 'azure') {
      stream = await AzureOpenAIChatStream(
        {
          temperature: 0,
          top_p: 0,
          frequency_penalty: 0,
          presence_penalty: 0,
          max_tokens: 800,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: input },
          ],
        },
        {
          onComplete: (message, start, stop) => {
            console.log({ input, message, start, stop })
          },
        },
      )
    } else {
      stream = await OpenAIChatStream(
        {
          temperature: 0,
          top_p: 0,
          frequency_penalty: 0,
          presence_penalty: 0,
          max_tokens: 800,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: input },
          ],
        },
        {
          onComplete: (message, start, stop) => {
            console.log({ input, message, start, stop })
          },
        },
      )
    }

    return stream
  } catch (error) {
    console.error('nickname generate action error: ', error)
    return new Response('Something went wrong', { status: 500 })
  }
}
