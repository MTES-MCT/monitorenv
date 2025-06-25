// Don't forget to mirror any update here in the backend enum.
export enum ApiErrorCode {
  AUTHENTICATION_REQUIRED = 'AUTHENTICATION_REQUIRED',

  /** Thrown when an entity could not be deleted. */
  CANNOT_DELETE_ENTITY = 'CANNOT_DELETE_ENTITY',

  /** Thrown when attempting to attach a mission to a reporting that has already a mission attached. */
  CHILD_ALREADY_ATTACHED = 'CHILD_ALREADY_ATTACHED',

  /** Thrown when attempting to find an entity that has does not exist. */
  ENTITY_NOT_FOUND = 'ENTITY_NOT_FOUND',

  /** Thrown when an entity could not be saved. */
  ENTITY_NOT_SAVED = 'ENTITY_NOT_SAVED',

  /** Thrown when attempting to delete a mission that has actions created by other applications. */
  EXISTING_MISSION_ACTION = 'EXISTING_MISSION_ACTION',

  /** Thrown when attempting to archive an entity linked to non-archived child(ren). */
  UNARCHIVED_CHILD = 'UNARCHIVED_CHILD',

  /** Thrown when an entity contain an unvalid property. */
  UNVALID_PROPERTY = 'UNVALID_PROPERTY'
}

export interface BackendApiErrorResponse {
  code: ApiErrorCode | null
  data: any
  type: ApiErrorCode | null
}

export interface BackendApiBooleanResponse {
  value: boolean
}

export interface CustomRTKErrorResponse {
  data: BackendApiErrorResponse
  status: number | 'FETCH_ERROR' | 'PARSING_ERROR' | 'TIMEOUT_ERROR' | 'CUSTOM_ERROR'
}

export interface Meta {
  response?: {
    headers: Headers
  }
}
