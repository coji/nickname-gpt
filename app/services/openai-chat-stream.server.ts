import { createParser } from 'eventsource-parser'
import type { ParsedEvent, ReconnectInterval } from 'eventsource-parser'

type Role = 'system' | 'user' | 'assistant'

interface Message {
  role: Role
  content: string
}

interface StreamPayload {
  messages: Message[]
  model?: string
  temperature?: number
  top_p?: number
  frequency_penalty?: number
  presence_penalty?: number
  max_tokens?: number
}

interface ChatResponseData {
  choices: { delta: Partial<Message> }[]
}

interface ChatStreamOptions {
  onComplete?: (message: string) => void
}

export const OpenAIChatStream = async (
  {
    model = 'gpt-3.5-turbo',
    temperature = 0.7,
    top_p = 1,
    frequency_penalty = 0,
    presence_penalty = 0,
    max_tokens = 800,
    messages,
  }: StreamPayload,
  options: ChatStreamOptions = {},
) => {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
    },
    method: 'POST',
    body: JSON.stringify({
      model,
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
            const { choices } = JSON.parse(data) as ChatResponseData
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
      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk))
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
