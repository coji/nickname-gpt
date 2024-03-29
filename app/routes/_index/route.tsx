import { useState } from 'react'
import { AppFooter, AppHeader, AppLoginPane, AppShell } from '~/components'
import { Stack } from '~/components/ui'
import { useGenerator } from '~/features/nickname/hooks/useGenerator'
import {
  BodyCopy,
  GenerateContent,
  GenerateError,
  GenerateHeader,
  GenerateLayout,
  NicknameInputForm,
} from './components'

export default function Index() {
  const [isFirstView, setIsFirstView] = useState(true)
  const openaiGenerator = useGenerator()

  const isLoading = openaiGenerator.isLoading

  const handleFormSubmit = (formData: FormData) => {
    setIsFirstView(false)
    const input = String(formData.get('input'))
    void openaiGenerator.generate('openai', input)
  }

  return (
    <AppShell>
      <AppLoginPane className="py-2 text-right" />
      <AppHeader layout={isFirstView ? 'normal' : 'shrink'} />

      <main className="container w-full max-w-2xl">
        <Stack>
          <NicknameInputForm
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              void handleFormSubmit(formData)
            }}
            isLoading={isLoading}
          />

          {isFirstView ? (
            <BodyCopy />
          ) : (
            <GenerateLayout>
              <Stack className="w-full">
                <GenerateHeader provider="OpenAI" model="gpt-3.5-turbo" />
                {openaiGenerator.isError && (
                  <GenerateError> {openaiGenerator.error}</GenerateError>
                )}

                {openaiGenerator.data === undefined &&
                  openaiGenerator.isLoading && (
                    <div className="text-center text-slate-700">Loading...</div>
                  )}

                {openaiGenerator.data && (
                  <GenerateContent content={openaiGenerator.data} />
                )}
              </Stack>
            </GenerateLayout>
          )}
        </Stack>
      </main>

      <AppFooter />
    </AppShell>
  )
}
