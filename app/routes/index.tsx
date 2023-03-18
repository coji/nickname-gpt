import { typedjson, useTypedLoaderData } from 'remix-typedjson'
import { type LoaderArgs } from '@remix-run/node'
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

export const loader = async ({ request }: LoaderArgs) => {
  return typedjson({ time: new Date().toString() })
}

export default function Index() {
  const loaderData = useTypedLoaderData<{ time: string }>()
  const result =
    useEventSource('/sse/time', { event: 'time' }) ?? loaderData.time

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
            <form noValidate autoComplete="off">
              <FormControl id="input">
                <HStack>
                  <Input
                    autoFocus
                    placeholder="あなたの名前、メールアドレス、ID などを入力してください"
                  />
                  <Button type="submit" colorScheme="blue">
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
