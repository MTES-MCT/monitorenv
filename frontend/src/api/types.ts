// Don't forget to mirror any update here in the backend enum.
export enum ApiErrorCode {
  FOREIGN_KEY_CONSTRAINT = 'FOREIGN_KEY_CONSTRAINT'
}

export interface BackendApiErrorResponse {
  type: ApiErrorCode | null
}

export interface CustomRTKErrorResponse {
  data: BackendApiErrorResponse
  status: number | 'FETCH_ERROR' | 'PARSING_ERROR' | 'TIMEOUT_ERROR' | 'CUSTOM_ERROR'
}
