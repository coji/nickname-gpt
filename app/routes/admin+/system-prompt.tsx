import { getFormProps, getTextareaProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@remix-run/node'
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react'
import { ArrowLeftIcon } from 'lucide-react'
import { z } from 'zod'
import { Button, HStack, Heading, Textarea } from '~/components/ui'
import { getSystemPrompt, upsertSystemPrompt } from '~/models/prompts.server'
import { authenticator } from '~/services/auth.server'

const schema = z.object({
  prompt: z
    .string()
    .min(1, "Prompt can't be empty")
    .max(2000, "Prompt can't be longer than 2000 characters"),
})

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticator.isAuthenticated(request, { failureRedirect: '/' })
  const prompt = await getSystemPrompt()
  return json({ prompt })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticator.isAuthenticated(request, { failureRedirect: '/' })

  const formData = await request.formData()
  const submission = parseWithZod(formData, { schema })
  if (submission.status !== 'success') {
    return json(submission.reply())
  }

  await upsertSystemPrompt(submission.value.prompt)
  return redirect('/')
}

export default function AdminIndexPage() {
  const loaderData = useLoaderData<typeof loader>()
  const lastResult = useActionData<typeof action>()
  const [form, { prompt }] = useForm({
    lastResult,
    defaultValue: loaderData,
    shouldValidate: 'onBlur',
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })

  return (
    <div className="container grid min-h-screen grid-rows-[auto,1fr]">
      <HStack className="gap-4 py-4">
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <Link to="/">
            <ArrowLeftIcon />
          </Link>
        </Button>
        <Heading>システムプロンプトの編集</Heading>
      </HStack>

      <Form method="POST" {...getFormProps(form)}>
        <div className="flex h-full flex-col gap-2 pb-4">
          <fieldset className="flex flex-1 flex-col">
            <Textarea className="flex-1" {...getTextareaProps(prompt)} />
            <p className="text-destructive">{prompt.errors}</p>
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
