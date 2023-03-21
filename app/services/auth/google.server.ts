import { redirect } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { createHash } from 'crypto'
import { createId } from '@paralleldrive/cuid2'
import { getSession, sessionStorage } from '../session.server'
import { base64UrlEncode, createForwardedRequest } from './helpers'

invariant(process.env.GOOGLE_CLIENT_ID, 'GOOGLE_CLIENT_ID should be defined.')
invariant(
  process.env.GOOGLE_CLIENT_SECRET,
  'GOOGLE_CLIENT_SECRET should be defined.',
)
invariant(process.env.SESSION_SECRET, 'SESSION_SECRET should be defined.')

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const CODE_VERIFIER = process.env.SESSION_SECRET

/**
 * Google ユーザ情報
 *
 */
interface GoogleUser {
  /**
   * Google User ID
   */
  id: number
  /**
   * メールアドレス
   */
  email: string
  /**
   * メールアドレス確認済み (Google は常に true)
   */
  verified_email: boolean
  /**
   * 表示名
   */
  name: string
  /**
   * アバター画像URL
   */
  picture: string
  /**
   * 所属組織 (workspacesの場合)
   */
  hd: string
}

/**
 * Google User 型ガード
 */
const isGoogleUser = (user: unknown): user is GoogleUser => {
  return typeof user === 'object' && user !== null && 'email' in user
}

const buildRedirectUrl = (request: Request) => {
  return new URL(REDIRECT_URI, createForwardedRequest(request).url).toString()
}

export const REDIRECT_URI = '/api/auth/callback/google'

/**
 * Google 認証を行う
 */
export const authenticate = async (request: Request) => {
  const redirectUrl = buildRedirectUrl(request)
  const state = createId()

  const session = await getSession(request)
  session.set('state', state)

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    response_type: 'code',
    access_type: 'offline', // TODO: refresh_token を取得する場合は必要のはずだけど取れない
    scope: 'openid email profile',
    include_granted_scopes: 'true',
    redirect_uri: redirectUrl,
    nonce: '1',
    state,
    code_challenge: base64UrlEncode(
      createHash('sha256').update(CODE_VERIFIER).digest('base64'),
    ),
    code_challenge_method: 'S256',
    prompt: 'consent',
  })

  return redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    {
      headers: { 'Set-Cookie': await sessionStorage.commitSession(session) },
    },
  )
}

/**
 * アクセストークンの取得
 * @param request コールバックで認証コードパラメータが含まれる Request
 */
const fetchGoogleAccessToken = async (request: Request) => {
  const url = new URL(request.url)

  // state の検証
  const stateUrl = url.searchParams.get('state')
  if (!stateUrl) {
    throw new Error('No state found in the URL.')
  }
  const session = await getSession(request)
  const stateSession = session.get('state') as string | undefined
  if (!stateSession) {
    throw new Error('No state found in the session.')
  }
  if (stateUrl === stateSession) {
    session.unset('state')
  } else {
    throw new Error('Invalid state.')
  }

  // code の取得
  const codeUrl = url.searchParams.get('code')
  if (!codeUrl) {
    throw new Error('No code found in the URL.')
  }

  // アクセストークンの取得
  const ret = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: new URLSearchParams({
      code: codeUrl,
      code_verifier: CODE_VERIFIER,
      grant_type: 'authorization_code',
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: buildRedirectUrl(request),
      prompt: 'concent',
    }).toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
  if (!ret.ok) {
    throw new Error('Failed to get access token from Google.')
  }

  const json: unknown = await ret.json()
  const { access_token } = json as Record<string, string>
  return access_token
}

/**
 * Google ユーザ情報の取得
 * @param accessToken
 * @returns GoogleUser
 */
export const fetchGoogleUser = async (
  request: Request,
): Promise<GoogleUser> => {
  const accessToken = await fetchGoogleAccessToken(request)
  const ret = await fetch('https://www.googleapis.com/userinfo/v2/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!ret.ok) {
    throw new Error('Failed to get user from Google.')
  }
  const user: unknown = await ret.json()
  if (!isGoogleUser(user)) {
    throw new Error('Invalid google user.')
  }
  return user
}
