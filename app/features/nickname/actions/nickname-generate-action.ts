import { type ActionFunctionArgs } from '@remix-run/node'
import { z } from 'zod'
import { zx } from 'zodix'
import { getSystemPrompt } from '~/models/prompts.server'
import { AzureOpenAIChatStream } from '~/services/azure-chat-stream.server'
import { OpenAIChatStream } from '~/services/openai-chat-stream.server'

export const action = async ({ request }: ActionFunctionArgs) => {
  const { input, provider } = await zx.parseForm(request, {
    input: z.string().nonempty('Missing input'),
    provider: z.enum(['azure', 'openai']),
  })

  try {
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
            { role: 'system', content: '出力は日本語です' },
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
