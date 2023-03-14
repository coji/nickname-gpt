import fs from 'fs/promises'
import path from 'path'

const prompts: Record<string, string> = {
  system: `
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
`,
} as const

interface PromptServiceOptions {
  promptsDir: string
}
export const createPromptService = (
  options: PromptServiceOptions = {
    promptsDir: path.join(__dirname, '..', 'assets'),
  },
) => {
  const getPrompt = async (promptName: string) => {
    // const promptPath = path.join(options.promptsDir, `${promptName}_prompt.txt`)
    // const prompt = await fs.readFile(promptPath, 'utf-8')
    return prompts[promptName] ?? 'nothing'
  }

  return {
    getPrompt,
  }
}
