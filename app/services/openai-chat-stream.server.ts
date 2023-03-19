import type { ParsedEvent, ReconnectInterval } from 'eventsource-parser'
import { createParser } from 'eventsource-parser'

export type Role = 'system' | 'user' | 'assistant'

export type Message = {
  role: Role
  content: string
}

export interface OpenAIStreamPayload {
  messages: Message[]
  model?: string
  temperature?: number
  top_p?: number
  frequency_penalty?: number
  presence_penalty?: number
  max_tokens?: number
  n?: number
}

export interface ChatResponseData {
  id: string
  object: string
  created: string
  model: string
  choices: { delta: Partial<Message> }[]
}

interface OpenAIChatStreamOptions {
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
  }: OpenAIStreamPayload,
  options: OpenAIChatStreamOptions = {},
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
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === 'event') {
          const data = event.data
          if (data === '[DONE]') {
            controller.close()
            if (options.onComplete) {
              options.onComplete(message)
            }
            return
          }
          try {
            const json = JSON.parse(data)
            const responseData = json as ChatResponseData
            const text = responseData.choices[0].delta.content
            if (!text || (counter < 2 && (text.match(/\n/) || []).length)) {
              return
            }
            message += text
            const queue = encoder.encode(text)
            controller.enqueue(queue)
            counter++
          } catch (e) {
            controller.error(e)
          }
        }
      }

      const parser = createParser(onParse)
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
