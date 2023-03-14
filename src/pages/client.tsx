import { NextPage } from 'next'
import { trpc } from '../utils/trpc'

const Client: NextPage = () => {
  const hello = trpc.hello.useQuery({ text: 'tRPC' })

  return <main>{hello.data?.greeting}</main>
}

export default Client
