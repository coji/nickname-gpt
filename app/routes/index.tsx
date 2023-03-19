import { useState } from 'react'
import { typedjson } from 'remix-typedjson'
import { type LoaderArgs } from '@remix-run/node'
import {
  Container,
  Box,
  Link,
  Heading,
  Stack,
  HStack,
  FormControl,
  Input,
  Button,
} from '@chakra-ui/react'
import nl2br from 'react-nl2br'
import { LoginPane } from '~/components/LoginPane'
import { getSession, sessionStorage } from '~/services/session.server'
import { createId } from '@paralleldrive/cuid2'

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
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleFormSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setResult('')

    const response = await fetch('/api/generate', {
      method: 'POST',
      body: formData,
    })

    setIsLoading(false)
    if (!response.ok) {
      throw new Error(response.statusText)
    }

    const data = response.body
    if (!data) {
      return
    }

    const reader = data.getReader()
    const decoder = new TextDecoder()
    let done = false

    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const chunkValue = decoder.decode(value)
      setResult((prev) => prev + chunkValue)
    }

    setIsLoading(false)
  }

  return (
    <>
      <Container
        maxW="container.md"
        display="grid"
        gridTemplateRows="auto auto 1fr auto"
        h="100vh"
      >
        <LoginPane py="2" />

        <Box>
          <Heading py="16" textAlign="center">
            Nickname GPT
          </Heading>
        </Box>

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

            <Box>
              {false
                ? 'Loading...'
                : result === ''
                ? 'AI があなたの Email や ID から、かっこいいニックネームを考えてくれます。入力して Submit してください。入力されたデータはどこにも一切保存されません。'
                : nl2br(result)}
            </Box>
          </Stack>
        </Box>

        <Box textAlign="center" p="2">
          <Box>
            Copyright &copy;{' '}
            <Link href="https://twitter.com/techtalkjp" color="blue.500">
              coji
            </Link>{' '}
          </Box>
          <Box>
            <Link href="https://github.com/coji/nickname-gpt" color="blue.500">
              GitHub
            </Link>
          </Box>
        </Box>
      </Container>
    </>
  )
}
