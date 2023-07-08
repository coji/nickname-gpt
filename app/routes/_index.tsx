import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  HStack,
  Heading,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import nl2br from 'react-nl2br'
import { AppFooter, AppHeader, AppLoginPane } from '~/components'
import { useGenerator } from '~/features/nickname/hooks/useGenerator'

export default function Index() {
  const [isFirstView, setIsFirstView] = useState(true)
  const openai = useGenerator('openai')
  const azure = useGenerator('azure')

  const isLoading = openai.isLoading || azure.isLoading

  const handleFormSubmit = (formData: FormData) => {
    setIsFirstView(false)
    const input = String(formData.get('input'))
    void openai.generate(input)
    void azure.generate(input)
  }

  return (
    <>
      <Container
        maxW="container.md"
        display="grid"
        gridTemplateRows="auto auto 1fr auto"
        h="100dvh"
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

            {isFirstView ? (
              <Box textAlign="center" color="gray.700">
                <Text>
                  AI がかっこいいニックネームを考えます。Email や ID を入力して
                  Submitしてください。
                </Text>
                <Text>入力されたデータはどこにも一切保存されません。</Text>
              </Box>
            ) : (
              <Grid gridTemplateColumns="1fr 1fr" gap="4">
                <Stack>
                  <Heading size="md">
                    OpenAI{' '}
                    <Text color="gray.500" fontSize="xs" display="inline">
                      gpt-3.5-turbo-0613
                    </Text>
                  </Heading>
                  {openai.isError && (
                    <Box textAlign="center" color="red.500">
                      {openai.error}
                    </Box>
                  )}

                  <Box>
                    {openai.data === undefined && openai.isLoading ? (
                      <Box textAlign="center" color="gray.700">
                        Loading...
                      </Box>
                    ) : (
                      openai.data && nl2br(openai.data)
                    )}
                  </Box>
                </Stack>

                <Stack>
                  <Heading size="md">
                    Azure{' '}
                    <Text color="gray.500" fontSize="xs" display="inline">
                      gpt-35-turbo 0613
                    </Text>
                  </Heading>
                  {azure.isError && (
                    <Box textAlign="center" color="red.500">
                      {azure.error}
                    </Box>
                  )}

                  <Box>
                    {azure.data === undefined && azure.isLoading ? (
                      <Box textAlign="center" color="gray.700">
                        Loading...
                      </Box>
                    ) : (
                      azure.data && nl2br(azure.data)
                    )}
                  </Box>
                </Stack>
              </Grid>
            )}
          </Stack>
        </Box>

        <AppFooter />
      </Container>
    </>
  )
}
