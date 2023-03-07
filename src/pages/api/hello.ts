// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'
import invariant from 'tiny-invariant'

invariant(process.env.OPENAI_API_KEY, 'OPENAI_API_KEY is not set')
const conf = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(conf)

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

export type Data = {
  request: string
  result: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  invariant(req.method === 'POST', 'Only POST is allowed')
  invariant(req.body, 'No request body')
  invariant('request' in req.body, 'No "request" in request body')
  const { request } = req.body

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      { role: 'user', content: request },
    ],
  })

  res.status(200).json({
    request,
    result: response.data.choices[0].message?.content ?? 'No response',
  })
}
