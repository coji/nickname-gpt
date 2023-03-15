import { NextPage } from 'next'
import { trpc } from '../utils/trpc'

const Client: NextPage = () => {
  const hello = trpc.hello.useQuery({ text: '' })

  return (
    <main>
      {hello.data?.greeting}
      <div>{JSON.stringify(hello.error?.message)}</div>
    </main>
  )
}

export default Client
