export const base64UrlEncode = (str: string) =>
  str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
