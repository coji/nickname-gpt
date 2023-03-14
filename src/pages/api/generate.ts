import type { NextApiRequest, NextApiResponse } from 'next'
import { OpenAIChatStream } from '~/utils/ChatGPTStream'
import type { OpenAIStreamPayload } from '~/types/types'
import { createPromptService } from '~/services/prompts.server'
import invariant from 'tiny-invariant'
invariant(process.env.OPENAI_API_KEY, 'Missing env var from OpenAI')
// import { getServerSession } from 'next-auth/next'
// import { authOptions } from './auth/[...nextauth]'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<Response> => {
  // const session = await getServerSession(req, res, authOptions)
  // console.log(session)

  const prompts = createPromptService()

  try {
    const { input } = req.body as {
      input?: string
    }

    if (!input) {
      return new Response('No input in the request', { status: 400 })
    }

    const payload: OpenAIStreamPayload = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: await prompts.getPrompt('system'),
        },
        { role: 'user', content: input },
      ],
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 800,
      stream: true,
      n: 1,
    }

    const stream = await OpenAIChatStream(payload, {
      onComplete: (message) => {
        console.log({ prompt, input, message })
      },
    })

    return new Response(stream)
  } catch (error: any) {
    console.error(error)
    return new Response('Something went wrong', { status: 500 })
  }
}

export default handler
