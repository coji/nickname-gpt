import { typedjson, useTypedLoaderData } from 'remix-typedjson'
import { type LoaderArgs } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { useEventSource } from 'remix-utils'
import {
  Container,
  Box,
  Heading,
  Stack,
  HStack,
  FormControl,
  Input,
  Link,
  Button,
} from '@chakra-ui/react'
import nl2br from 'react-nl2br'
import { LoginPane } from '~/components/LoginPane'
import { getSession, sessionStorage } from '~/services/session.server'
import { createId } from '@paralleldrive/cuid2'

export const loader = async ({ request }: LoaderArgs) => {
  const session = await getSession(request)

  let userId: string | undefined = session.get('userId')
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
  const { userId } = useTypedLoaderData<typeof loader>()
  const fetcher = useFetcher()
  const result =
    useEventSource(`/api/sse/message?userId=${userId}`, { event: 'message' }) ??
    'nothing'

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
            <fetcher.Form
              method="post"
              action="/api/push_message"
              noValidate
              autoComplete="off"
            >
              <input type="hidden" name="userId" value={userId} />
              <FormControl id="message">
                <HStack>
                  <Input
                    name="message"
                    autoFocus
                    placeholder="あなたの名前、メールアドレス、ID などを入力してください"
                  />
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={fetcher.state !== 'idle'}
                  >
                    Submit
                  </Button>
                </HStack>
              </FormControl>
            </fetcher.Form>

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
