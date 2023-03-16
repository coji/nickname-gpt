import { initTRPC } from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import { z } from 'zod'

export const t = initTRPC.create()
export const router = t.router
export const publicProcedure = t.procedure

export const appRouter = t.router({
  hello: t.procedure
    .input(z.object({ text: z.string().min(1, "Can't be empty") }))
    .query(({ input }) => {
      return { greeting: `Hello ${input.text}` }
    }),
})

export type AppRouter = typeof appRouter

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
})
