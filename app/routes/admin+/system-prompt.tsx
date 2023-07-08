import { ArrowBackIcon } from '@chakra-ui/icons'
import {
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  HStack,
  Heading,
  IconButton,
  Stack,
  Textarea,
} from '@chakra-ui/react'
import { useForm } from '@conform-to/react'
import { parse } from '@conform-to/zod'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link, useLoaderData } from '@remix-run/react'
import { z } from 'zod'
import { getSystemPrompt, upsertSystemPrompt } from '~/models/prompts.server'
import { authenticator } from '~/services/auth.server'

const schema = z.object({
  prompt: z
    .string()
    .min(1, "Prompt can't be empty")
    .max(2000, "Prompt can't be longer than 2000 characters"),
})

export const loader = async ({ request }: LoaderArgs) => {
  await authenticator.isAuthenticated(request, { failureRedirect: '/' })
  const prompt = await getSystemPrompt()
  return json({ prompt })
}

export const action = async ({ request }: ActionArgs) => {
  await authenticator.isAuthenticated(request, { failureRedirect: '/' })

  const formData = await request.formData()
  const submission = parse(formData, { schema })
  if (!submission.value) {
    return json({ ...submission }, { status: 400 })
  }

  await upsertSystemPrompt(submission.value.prompt)
  return redirect('/')
}

export default function AdminIndexPage() {
  const loaderData = useLoaderData<typeof loader>()
  const [form, { prompt }] = useForm({
    defaultValue: loaderData,
    shouldValidate: 'onBlur',
    onValidate({ formData }) {
      return parse(formData, { schema })
    },
  })

  return (
    <Container
      maxW="container.md"
      display="grid"
      minH="100dvh"
      gridTemplateRows="auto 1fr"
    >
      <HStack align="center" py="4" gap="4">
        <IconButton
          as={Link}
          to="/"
          aria-label="back"
          icon={<ArrowBackIcon />}
          colorScheme="gray"
          rounded="full"
          variant="ghost"
        />
        <Heading size={['md', 'lg']}>システムプロンプトの編集</Heading>
      </HStack>

      <Form method="POST" {...form.props}>
        <Flex direction="column" h="full" pb="4" gap="2">
          <FormControl
            isInvalid={!!prompt.error}
            flex="1"
            flexDirection="column"
            display="flex"
          >
            <Textarea
              id="prompt"
              name="prompt"
              defaultValue={prompt.defaultValue}
              flex="1"
            />
            <FormErrorMessage>{prompt.error}</FormErrorMessage>
          </FormControl>

          <Stack display="grid" gridTemplateColumns="1fr 1fr">
            <Button as={Link} to="/">
              キャンセル
            </Button>
            <Button type="submit" colorScheme="blue">
              更新
            </Button>
          </Stack>
        </Flex>
      </Form>
    </Container>
  )
}
