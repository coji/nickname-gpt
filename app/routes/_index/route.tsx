import { Stack } from '~/components/ui'
import { useState } from 'react'
import { AppShell, AppFooter, AppHeader, AppLoginPane } from '~/components'
import { useGenerator } from '~/features/nickname/hooks/useGenerator'
import {
  NicknameInputForm,
  BodyCopy,
  GenerateLayout,
  GenerateHeader,
  GenerateError,
  GenerateContent,
} from './components'

export default function Index() {
  const [isFirstView, setIsFirstView] = useState(true)
  const openaiGenerator = useGenerator()

  const isLoading = openaiGenerator.isLoading

  const handleFormSubmit = (formData: FormData) => {
    setIsFirstView(false)
    const input = String(formData.get('input'))
    void openaiGenerator.generate(input)
  }

  return (
    <AppShell>
      <AppLoginPane className="text-right py-2" />
      <AppHeader layout={isFirstView ? 'normal' : 'shrink'} />

      <main className="w-96 p-2">
        <Stack gap="16" className="w-full">
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
              <Stack>
                <GenerateHeader provider="OpenAI" model="gpt-3.5-turbo" />
                {openaiGenerator.isError && (
                  <GenerateError> {openaiGenerator.error}</GenerateError>
                )}

                <div>
                  {openaiGenerator.data === undefined &&
                    openaiGenerator.isLoading && (
                      <div className="text-center text-slate-700">
                        Loading...
                      </div>
                    )}

                  {openaiGenerator.data && (
                    <GenerateContent content={openaiGenerator.data} />
                  )}
                </div>
              </Stack>
            </GenerateLayout>
          )}
        </Stack>
      </main>

      <AppFooter />
    </AppShell>
  )
}
