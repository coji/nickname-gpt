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
  stop?: null | string
}

interface AzureOpenAIChatResponseData {
  created: number
  model: string
  choices: {
    index: number
    finish_reason: 'stop' | null
    delta: { content?: string }
  }[]
  usage: null
}

interface AzureOpenAIChatStreamOptions {
  onComplete?: (message: string, start?: Date, finish?: Date) => void
}

export const AzureOpenAIChatStream = async (
  {
    temperature = 0,
    frequency_penalty = 0,
    presence_penalty = 0,
    max_tokens = 800,
    messages,
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
      frequency_penalty,
      presence_penalty,
      max_tokens,
      n: 1,
      stream: true,
      messages,
    }),
  })

  if (!res.ok) {
    throw new Error(res.statusText)
  }

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  let message = ''
  const start = new Date()

  const stream = new ReadableStream({
    async start(controller) {
      function onEvent(event: ParsedEvent | ReconnectInterval) {
        if (event.type === 'event') {
          const data = event.data
          try {
            const { choices } = JSON.parse(data) as AzureOpenAIChatResponseData
            const text = choices[0].delta.content
            if (text === undefined && choices[0].finish_reason === 'stop') {
              // 完了
              const finish = new Date()
              controller.close()
              options.onComplete?.(message, start, finish)
              return
            }

            message += text
            controller.enqueue(encoder.encode(text))
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
