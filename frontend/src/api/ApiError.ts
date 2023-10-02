import type { ApiErrorCode } from './types'

export class ApiError extends Error {
  constructor(public override message: string, public type: ApiErrorCode | undefined) {
    super(message)
  }
}
