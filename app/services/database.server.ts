import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var __db__: PrismaClient
}
let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.__db__) {
    const prisma = new PrismaClient({
      log: [{ emit: 'event', level: 'query' }],
    })
    prisma.$on('query', (e) => {
      console.log(`${e.query} ${e.params}`)
    })
    global.__db__ = prisma
  }
  prisma = global.__db__
  void prisma.$connect()
}

export { prisma }
