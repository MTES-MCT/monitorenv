// Don't forget to mirror any update here in the backend enum.
export enum ApiErrorCode {
  FOREIGN_KEY_CONSTRAINT = 'FOREIGN_KEY_CONSTRAINT',
  /** Thrown when attempting to attach a mission to a reporting that has already a mission attached. */
  REPORTING_ALREADY_ATTACHED = 'REPORTING_ALREADY_ATTACHED',

  /** Thrown when attempting to archive an entity linked to non-archived child(ren). */
  UNARCHIVED_CHILD = 'UNARCHIVED_CHILD'
}

export interface BackendApiErrorResponse {
  type: ApiErrorCode | null
}

export interface BackendApiBooleanResponse {
  value: boolean
}

export interface CustomRTKErrorResponse {
  data: BackendApiErrorResponse
  status: number | 'FETCH_ERROR' | 'PARSING_ERROR' | 'TIMEOUT_ERROR' | 'CUSTOM_ERROR'
}
