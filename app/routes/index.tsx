import { typedjson, useTypedLoaderData } from 'remix-typedjson'
import { type LoaderArgs } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { useEventSource } from '~/hooks/useEventSource'
import {
  Container,
  Box,
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
import { AppHeader, AppFooter } from '~/components'

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
  const result =
    useEventSource(`/api/sse/message?userId=${userId}`, {
      event: 'message',
      init: { withCredentials: true },
    }) ?? 'nothing'

  return (
    <>
      <Container
        maxW="container.md"
        display="grid"
        gridTemplateRows="auto auto 1fr auto"
        h="100vh"
      >
        <LoginPane py="2" />
        <AppHeader />
        <MainContent userId={userId} result={result.data} />
        <AppFooter />
      </Container>
    </>
  )
}

function MainContent({ userId, result }: { userId: string; result?: string }) {
  return (
    <Box h="full" p="2">
      <Stack spacing="16">
        <MessageForm userId={userId} />
        <MessageBox result={result} />
      </Stack>
    </Box>
  )
}

function MessageForm({ userId }: { userId: string }) {
  const fetcher = useFetcher()
  return (
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
  )
}

function MessageBox({ result }: { result?: string }) {
  return (
    <Box>
      {false
        ? 'Loading...'
        : result === ''
        ? 'AI があなたの Email や ID から、かっこいいニックネームを考えてくれます。入力して Submit してください。入力されたデータはどこにも一切保存されません。'
        : nl2br(result)}
    </Box>
  )
}
