import { ArrowLeftIcon } from 'lucide-react'
import { Button, HStack, Heading, Textarea } from '~/components/ui'
import { useForm } from '@conform-to/react'
import { parse } from '@conform-to/zod'
import {
  type ActionArgs,
  type LoaderArgs,
  json,
  redirect,
} from '@remix-run/node'
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
    <div className="container grid grid-rows-[auto,1fr] min-h-screen">
      <HStack className="py-4 gap-4">
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <Link to="/">
            <ArrowLeftIcon />
          </Link>
        </Button>
        <Heading>システムプロンプトの編集</Heading>
      </HStack>

      <Form method="POST" {...form.props}>
        <div className="flex flex-col h-full pb-4 gap-2">
          <fieldset className="flex flex-col flex-1">
            <Textarea
              className="flex-1"
              id="prompt"
              name="prompt"
              defaultValue={prompt.defaultValue}
            />
            <p className="text-destructive">{prompt.error}</p>
          </fieldset>

          <HStack>
            <Button type="button" asChild className="flex-1">
              <Link to="/">キャンセル</Link>
            </Button>
            <Button type="submit" variant="default" className="flex-1">
              更新
            </Button>
          </HStack>
        </div>
      </Form>
    </div>
  )
}
