// Don't forget to mirror any update here in the backend enum.
export enum ApiErrorCode {
  /** Thrown when attempting to attach a mission to a reporting that has already a mission attached. */
  DUPLICATE_ATTACHED_MISSION = 'DUPLICATE_ATTACHED_MISSION',
  /** Thrown when attempting to attach a reporting to a mission that has already a mission attached. */
  DUPLICATE_ATTACHED_REPORTING = 'DUPLICATE_ATTACHED_REPORTING',
  FOREIGN_KEY_CONSTRAINT = 'FOREIGN_KEY_CONSTRAINT',

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
