/**
 * User error thrown or returned for expected errors coming from an impossible human action.
 *
 * @example
 * - Attempting to delete a DB entity that has existing uncascaded relations with other entities.
 */
export type UserError = {
  name: 'UserError'
  /** User-friendly message explaining why the operation couldn't be processed. */
  userMessage: string
}

/**
 * @param userMessage - User-friendly message explaining why the operation couldn't be processed.
 */
export function newUserError(userMessage: string): UserError {
  return {
    name: 'UserError',
    userMessage
  }
}

export function isUserError(error: any): error is UserError {
  return error && error.name === 'UserError'
}
