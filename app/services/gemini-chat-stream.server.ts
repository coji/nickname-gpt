import { GoogleGenerativeAI, type InputContent } from '@google/generative-ai'

const api = new GoogleGenerativeAI(process.env.GEMINIPRO_API_KEY!)
const model = api.getGenerativeModel({ model: 'models/gemini-pro' })

interface GeminiChatStreamOptions {
  prompt: string
  history: InputContent[]
  temperature: number
  maxOutputTokens: number
}
export const GeminiChatStream = async ({
  prompt,
  history,
  temperature,
  maxOutputTokens,
}: GeminiChatStreamOptions) => {
  const chat = model.startChat({
    generationConfig: { candidateCount: 1, maxOutputTokens, temperature },
    history,
  })

  const result = await chat.sendMessageStream(prompt)
  const response = await result.response
  return response
}
