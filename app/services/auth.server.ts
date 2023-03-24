import { Authenticator } from 'remix-auth'
import { GoogleStrategy } from 'remix-auth-google'
import { sessionStorage } from '~/services/session.server'
import invariant from 'tiny-invariant'
import { prisma } from './database.server'

invariant(process.env.GOOGLE_CLIENT_ID, 'GOOGLE_CLIENT_ID should be defined.')
invariant(
  process.env.GOOGLE_CLIENT_SECRET,
  'GOOGLE_CLIENT_SECRET should be defined.',
)

interface SessionUser {
  uid: number
}

const authenticator = new Authenticator<SessionUser>(sessionStorage)
const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/login/google',
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    const user = await prisma.user.findUnique({
      where: {
        email: profile.emails[0].value,
      },
    })
    if (!user) {
      throw new Error('User not found')
    }
    return { uid: user.id }
  },
)

authenticator.use(googleStrategy)
export { authenticator }
