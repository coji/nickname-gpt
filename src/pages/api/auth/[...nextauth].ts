import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import invariant from 'tiny-invariant'

invariant(process.env.GOOGLE_CLIENT_ID, 'Missing env var from Google')
invariant(process.env.GOOGLE_CLIENT_SECRET, 'Missing env var from Google')

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
