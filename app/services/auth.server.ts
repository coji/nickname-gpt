import { Authenticator } from 'remix-auth'
import { GoogleStrategy } from 'remix-auth-google'
import invariant from 'tiny-invariant'
import { sessionStorage, type SessionUser } from '~/services/session.server'
import { prisma } from './database.server'

invariant(process.env.GOOGLE_CLIENT_ID, 'GOOGLE_CLIENT_ID should be defined.')
invariant(
  process.env.GOOGLE_CLIENT_SECRET,
  'GOOGLE_CLIENT_SECRET should be defined.',
)

const authenticator = new Authenticator<SessionUser>(sessionStorage)
const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/callback/google',
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    const user = await prisma.user.upsert({
      where: {
        email: profile.emails[0].value,
      },
      create: {
        email: profile.emails[0].value,
        displayName: profile.displayName,
        photoUrl: profile.photos[0].value,
      },
      update: {
        displayName: profile.displayName,
        photoUrl: profile.photos[0].value,
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        photoUrl: true,
      },
    })
    return { ...user, photoUrl: user.photoUrl ?? undefined }
  },
)

authenticator.use(googleStrategy)
export { authenticator }
