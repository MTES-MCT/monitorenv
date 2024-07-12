import { sha256 } from '@utils/sha256'
import { getOIDCConfig } from 'auth/getOIDCConfig'
import { getOIDCUser } from 'auth/getOIDCUser'

const AUTHORIZATION_HEADER = 'authorization'
const CORRELATION_HEADER = 'X-Correlation-Id'

export const setAuthorizationHeader = async headers => {
  const { IS_OIDC_ENABLED } = getOIDCConfig()
  const user = getOIDCUser()
  const token = user?.access_token

  // If we have a token set in state, we pass it.
  if (IS_OIDC_ENABLED && token) {
    headers.set(AUTHORIZATION_HEADER, `Bearer ${token}`)

    if (crypto?.subtle) {
      const hashedToken = await sha256(token)

      headers.set(CORRELATION_HEADER, hashedToken)
    }
  }

  return headers
}
