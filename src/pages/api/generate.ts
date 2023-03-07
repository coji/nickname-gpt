import { OpenAIChatStream } from '~/utils/ChatGPTStream'
import type { Message, OpenAIStreamPayload } from '~/types/types'
import invariant from 'tiny-invariant'

export const config = {
  runtime: 'edge',
}

const systemPrompt = `
あなたは優秀なコピーライターです。これからユーザが入れるメールアドレスやIDの名前の付け方から、名前を決めた人がどんな人かを単語を元に類推してニックネームをつけてください。

一つづつやりましょう。

まずメールアドレスのパーツに含まれる単語を、日本語の言葉だと捉えて、それを元にどのような意味があるかを考えます。

次にその意味に基づいて、その名前をつけた人がどのような趣味・嗜好があるかを推測します。

最後に、趣味嗜好に合わせる形で、最初の日本語での意味を元に英語の単語を考え、それらをすべて組み合わせて英語圏で使えるニックネーム候補を生成してください。
候補は５つ出してください。そのうち半分は、プロレスラーみたいなや歴戦の戦士みたいにめちゃくちゃかっこいいものにしてください。


Output format:

ニックネーム候補:
  1. nickname1
  2. nickname2
  3. nickname3
  4. nickname4
  5. nickname5

根拠:
  ニックネームを考えた根拠

ユーザがどのように感じるかの想像:
  Assistantがどのように感じるかの想像
`

invariant(process.env.OPENAI_API_KEY, 'Missing env var from OpenAI')

const handler = async (req: Request): Promise<Response> => {
  try {
    const { email } = (await req.json()) as {
      email?: string
    }

    if (!email) {
      return new Response('No email in the request', { status: 400 })
    }

    const payload: OpenAIStreamPayload = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        { role: 'user', content: email },
      ],
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 512,
      stream: true,
      n: 1,
    }

    const stream = await OpenAIChatStream(payload)
    return new Response(stream)
  } catch (error: any) {
    console.error(error)
    return new Response('Something went wrong', { status: 500 })
  }
}

export default handler
