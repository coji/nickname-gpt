import Head from 'next/head'
import {
  Container,
  Box,
  Heading,
  Stack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Link,
  Button,
} from '@chakra-ui/react'
import { Inter } from 'next/font/google'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import nl2br from 'react-nl2br'

const inter = Inter({ subsets: ['latin'] })

interface FormProps {
  input: string
}
export default function Home() {
  const { register, handleSubmit } = useForm<FormProps>()
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFormSubmit = async (form: FormProps) => {
    setLoading(true)
    setResult('')

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: form.input,
      }),
    })

    setLoading(false)
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

    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Nickname GPT</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container
        maxW="container.md"
        display="grid"
        gridTemplateRows="auto 1fr auto"
        h="100vh"
      >
        <Heading py="16" textAlign="center">
          Nickname GPT
        </Heading>

        <Box h="full" p="2">
          <Stack spacing="16">
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <FormControl id="input">
                <HStack>
                  <Input
                    autoFocus
                    {...register('input')}
                    placeholder="Your Email or ID"
                  />
                  <Button type="submit" colorScheme="blue" isLoading={loading}>
                    Submit
                  </Button>
                </HStack>
              </FormControl>
            </form>

            <Box>
              {loading
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
