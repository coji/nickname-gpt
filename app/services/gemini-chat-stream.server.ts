import {
  GoogleGenerativeAI,
  type EnhancedGenerateContentResponse,
} from '@google/generative-ai'

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const api = new GoogleGenerativeAI(process.env.GEMINIPRO_API_KEY!)
const model = api.getGenerativeModel({ model: 'models/gemini-pro' })

interface GeminiChatStreamOptions {
  prompt: string
}
export const GeminiChatStream = async ({ prompt }: GeminiChatStreamOptions) => {
  const result = await model.generateContentStream(prompt)

  const stream = new ReadableStream({
    async pull(controller) {
      const { value, done } = await result.stream.next()

      if (done) {
        controller.close()
      } else {
        const chunk = value as EnhancedGenerateContentResponse
        controller.enqueue(chunk.text())
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
