import { FrontendError } from '@libs/FrontendError'
import { isObject, nullify, undefine } from '@mtes-mct/monitor-ui'

import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'

export const normalizeRtkBaseQuery =
  (
    baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>
  ): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =>
  async (args, api, extraOptions) => {
    try {
      const argsWithNullifiedBody =
        typeof args === 'object' && isObject((args as FetchArgs).body)
          ? {
              ...(args as FetchArgs),
              body: nullify((args as FetchArgs).body)
            }
          : args

      const result = await baseQuery(argsWithNullifiedBody, api, extraOptions)

      const normalizedResult = result.data
        ? ({
            ...result,
            data: undefine((result as any).data)
          } as any)
        : result

      return normalizedResult
    } catch (err) {
      throw new FrontendError('An unexpected error happened.', err)
    }
  }
