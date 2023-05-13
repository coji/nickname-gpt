import type { ParsedEvent, ReconnectInterval } from 'eventsource-parser'
import { createParser } from 'eventsource-parser'
import invariant from 'tiny-invariant'
import type { OpenAIMessage } from './openai-chat-stream.server'
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT
const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY
invariant(AZURE_OPENAI_ENDPOINT, 'AZURE_OPENAI_ENDPOINT should defined')
invariant(AZURE_OPENAI_API_KEY)

interface AzureOpenAIStreamPayload {
  messages: OpenAIMessage[]
  temperature?: number
  top_p?: number
  frequency_penalty?: number
  presence_penalty?: number
  max_tokens?: number
  stop: null | string
}

interface AzureOpenAIChatResponseData {
  choices: { delta: Partial<OpenAIMessage> }[]
}

interface AzureOpenAIChatStreamOptions {
  onComplete?: (message: string) => void
}

export const AzureOpenAIChatStream = async (
  {
    temperature = 0.7,
    top_p = 0.95,
    frequency_penalty = 0,
    presence_penalty = 0,
    max_tokens = 800,
    messages,
    stop = null,
  }: AzureOpenAIStreamPayload,
  options: AzureOpenAIChatStreamOptions = {},
) => {
  const res = await fetch(AZURE_OPENAI_ENDPOINT, {
    headers: {
      'Content-Type': 'application/json',
      'api-key': AZURE_OPENAI_API_KEY,
    },
    method: 'POST',
    body: JSON.stringify({
      temperature,
      top_p,
      frequency_penalty,
      presence_penalty,
      max_tokens,
      n: 1,
      stream: true,
      messages,
    }),
  })

  if (!res.ok) {
    console.log(res)
    throw new Error(res.statusText)
  }

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  let message = ''
  let counter = 0

  const stream = new ReadableStream({
    async start(controller) {
      function onEvent(event: ParsedEvent | ReconnectInterval) {
        if (event.type === 'event') {
          const data = event.data
          if (data === '[DONE]') {
            controller.close()
            options.onComplete?.(message)
            return
          }
          try {
            const { choices } = JSON.parse(data) as AzureOpenAIChatResponseData
            const text = choices[0].delta.content
            if (!text || (counter < 2 && (text.match(/\n/) || []).length)) {
              return
            }
            message += text
            controller.enqueue(encoder.encode(text))
            counter++
          } catch (e) {
            controller.error(e)
          }
        }
      }

      const parser = createParser(onEvent)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk as BufferSource | undefined))
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
