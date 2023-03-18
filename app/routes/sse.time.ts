import { type LoaderArgs } from '@remix-run/node'
import { eventStream } from 'remix-utils'

export const loader = ({ request }: LoaderArgs) => {
  return eventStream(request.signal, (send) => {
    let timer = setInterval(() => {
      send({ event: 'time', data: new Date().toISOString() })
    }, 1000)

    return function clear() {
      clearInterval(timer)
    }
  })
}
