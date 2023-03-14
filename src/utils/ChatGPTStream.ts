import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser'
import { OpenAIStreamPayload, ChatResponseData } from '~/types/types'

interface OpenAIChatStreamOptions {
  onComplete?: (message: string) => void
}
export async function OpenAIChatStream(
  payload: OpenAIStreamPayload,
  options: OpenAIChatStreamOptions = {},
) {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  let message = ''
  let counter = 0

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
    },
    method: 'POST',
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error(res.statusText)
  }

  const stream = new ReadableStream({
    async start(controller) {
      // callback
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === 'event') {
          const data = event.data
          // https://platform.openai.com/docs/api-reference/chat/create
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
              // this is a prefix character (i.e., "\n\n"), do nothing
              return
            }
            message += text
            const queue = encoder.encode(text)
            controller.enqueue(queue)
            counter++
          } catch (e) {
            // maybe parse error
            controller.error(e)
          }
        }
      }

      // stream response (SSE) from OpenAI may be fragmented into multiple chunks
      // this ensures we properly read chunks and invoke an event for each SSE event stream
      const parser = createParser(onParse)
      // https://web.dev/streams/#asynchronous-iteration
      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk))
      }
    },
  })

  return stream
}
