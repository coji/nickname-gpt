import { Button, HStack, Heading, Input, Stack } from '~/components/ui'
import { useState } from 'react'
import nl2br from 'react-nl2br'
import { AppFooter, AppHeader, AppLoginPane } from '~/components'
import { useGenerator } from '~/features/nickname/hooks/useGenerator'

export default function Index() {
  const [isFirstView, setIsFirstView] = useState(true)
  const openai = useGenerator()

  const isLoading = openai.isLoading

  const handleFormSubmit = (formData: FormData) => {
    setIsFirstView(false)
    const input = String(formData.get('input'))
    void openai.generate(input)
  }

  return (
    <div className="container grid grid-rows-[auto,auto,1fr,auto] h-screen justify-center">
      <AppLoginPane className="text-right py-2" />
      <AppHeader layout={isFirstView ? 'normal' : 'shrink'} />

      <main className="w-96 p-2">
        <Stack gap="16" className="w-full">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              void handleFormSubmit(formData)
            }}
            noValidate
            autoComplete="off"
          >
            <fieldset>
              <HStack>
                <Input
                  name="input"
                  autoFocus
                  placeholder="あなたの名前、メールアドレス、ID などを入力してください"
                />
                <Button type="submit" disabled={isLoading}>
                  Submit
                </Button>
              </HStack>
            </fieldset>
          </form>

          {isFirstView ? (
            <div className="text-center text-slate-700">
              <p>
                AI がかっこいいニックネームを考えます。Email や ID を入力して
                Submitしてください。
              </p>
              <p>入力されたデータはどこにも一切保存されません。</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <Stack>
                <Heading size="md">
                  <span>OpenAI</span>
                  <span className="ml-2 text-slate-500 text-xs">
                    gpt-3.5-turbo
                  </span>
                </Heading>
                {openai.isError && (
                  <div className="text-center text-destructive">
                    {openai.error}
                  </div>
                )}

                <div>
                  {openai.data === undefined && openai.isLoading ? (
                    <div className="text-center text-slate-700">Loading...</div>
                  ) : (
                    openai.data && nl2br(openai.data)
                  )}
                </div>
              </Stack>
            </div>
          )}
        </Stack>
      </main>

      <AppFooter />
    </div>
  )
}
