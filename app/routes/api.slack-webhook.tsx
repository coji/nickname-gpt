import { json, type ActionArgs } from '@remix-run/node'
import { useActionData } from '@remix-run/react'

export const action = async ({ request }: ActionArgs) => {
  const data = (await request.json()) as {
    token: string
    challenge: string
    type: string
  }

  return json({
    challenge: data.challenge,
  })
}

export default function SlackWebhook() {
  const actionData = useActionData<typeof action>()
  return (
    <form method="post">
      <input type="text" name="message" />
      {actionData && <p>{JSON.stringify(actionData)}</p>}
      <button type="submit">Send</button>
    </form>
  )
}
