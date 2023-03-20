import { useState } from 'react'
import { typedjson } from 'remix-typedjson'
import { type LoaderArgs } from '@remix-run/node'
import {
  Container,
  Box,
  Text,
  Stack,
  HStack,
  FormControl,
  Input,
  Button,
} from '@chakra-ui/react'
import nl2br from 'react-nl2br'
import { getSession, sessionStorage } from '~/services/session.server'
import { createId } from '@paralleldrive/cuid2'
import { useGenerator } from '~/features/nickname/hooks/useGenerator'
import { AppHeader, AppFooter, AppLoginPane } from '~/components'

export const loader = async ({ request }: LoaderArgs) => {
  const session = await getSession(request)

  let userId: string | undefined = session.get('userId') as string | undefined
  if (!userId) {
    userId = createId()
    session.set('userId', userId)
  }

  return typedjson(
    { userId },
    { headers: { 'Set-Cookie': await sessionStorage.commitSession(session) } },
  )
}

export default function Index() {
  const { generate, isLoading, isError, data, error } = useGenerator()
  const [isFirstView, setIsFirstView] = useState(true)

  const handleFormSubmit = async (formData: FormData) => {
    setIsFirstView(false)
    await generate(String(formData.get('input')))
  }

  return (
    <>
      <Container
        maxW="container.md"
        display="grid"
        gridTemplateRows="auto auto 1fr auto"
        h="100vh"
      >
        <AppLoginPane py="2" />
        <AppHeader layout={isFirstView ? 'normal' : 'shrink'} />

        <Box h="full" p="2">
          <Stack spacing="16">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                void handleFormSubmit(formData)
              }}
              noValidate
              autoComplete="off"
            >
              <FormControl>
                <HStack>
                  <Input
                    name="input"
                    autoFocus
                    placeholder="あなたの名前、メールアドレス、ID などを入力してください"
                  />
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={isLoading}
                  >
                    Submit
                  </Button>
                </HStack>
              </FormControl>
            </form>

            {isError && (
              <Box textAlign="center" color="red.500">
                {error}
              </Box>
            )}

            <Box>
              {data === undefined && isLoading ? (
                <Box textAlign="center" color="gray.700">
                  Loading...
                </Box>
              ) : data === undefined ? (
                <Box textAlign="center" color="gray.700">
                  <Text>
                    AI がかっこいいニックネームを考えます。Email や ID
                    を入力して Submitしてください。
                  </Text>
                  <Text>入力されたデータはどこにも一切保存されません。</Text>
                </Box>
              ) : (
                nl2br(data)
              )}
            </Box>
          </Stack>
        </Box>

        <AppFooter />
      </Container>
    </>
  )
}
