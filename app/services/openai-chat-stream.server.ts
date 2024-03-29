import type { ParsedEvent, ReconnectInterval } from 'eventsource-parser'
import { createParser } from 'eventsource-parser'
import invariant from 'tiny-invariant'
invariant(process.env.OPENAI_API_KEY, 'OPENAI_API_KEY should defined')

type Role = 'system' | 'user' | 'assistant'

export interface OpenAIMessage {
  role: Role
  content: string
}

interface OpenAIStreamPayload {
  messages: OpenAIMessage[]
  model?: string
  temperature?: number
  top_p?: number
  frequency_penalty?: number
  presence_penalty?: number
  max_tokens?: number
  stop?: null | string
}

interface OpenAIChatResponseData {
  choices: {
    index: number
    finish_reason: 'stop' | null
    delta: { content?: string }
  }[]
}

interface OpenAIChatStreamOptions {
  onComplete?: (message: string, start?: Date, finish?: Date) => void
}

export const OpenAIChatStream = async (
  {
    model = 'gpt-3.5-turbo',
    temperature = 0,
    frequency_penalty = 0,
    presence_penalty = 0,
    max_tokens = 800,
    messages,
  }: OpenAIStreamPayload,
  options: OpenAIChatStreamOptions = {},
) => {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
      'OpenAI-Organization': `${process.env.OPENAI_API_ORGANIZATION_ID ?? ''}`,
    },
    method: 'POST',
    body: JSON.stringify({
      model,
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
            const { choices } = JSON.parse(data) as OpenAIChatResponseData
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
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
