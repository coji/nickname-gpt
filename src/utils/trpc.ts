import { createTRPCNext } from '@trpc/next'
import { httpBatchLink } from '@trpc/client'
import { AppRouter } from '../pages/api/trpc/[trpc]'

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
    }
  },
})
