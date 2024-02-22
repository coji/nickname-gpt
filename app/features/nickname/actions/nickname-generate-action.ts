import { type ActionFunctionArgs } from '@remix-run/node'
import { z } from 'zod'
import { zx } from 'zodix'
import { getSystemPrompt } from '~/models/prompts.server'
import { GeminiChatStream } from '~/services/gemini-chat-stream.server'
import { OpenAIChatStream } from '~/services/openai-chat-stream.server'

export const action = async ({ request }: ActionFunctionArgs) => {
  const { input, provider } = await zx.parseForm(request, {
    input: z.string({ required_error: 'missing input' }).min(1),
    provider: z.union([z.literal('openai'), z.literal('google')]),
  })

  try {
    const systemPrompt = await getSystemPrompt()
    if (provider === 'openai') {
      const stream = await OpenAIChatStream(
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
      return stream
    }
    if (provider === 'google') {
      const stream = await GeminiChatStream({
        prompt: `${systemPrompt}\nuser input: ${input}\n\n output:`,
      })
      return stream
    }
  } catch (error) {
    console.error('nickname generate action error: ', error)
    return new Response('Something went wrong', { status: 500 })
  }
}
