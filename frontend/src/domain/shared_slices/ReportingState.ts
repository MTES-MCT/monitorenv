export enum ReportingContext {
  MAP = 'map',
  SIDE_WINDOW = 'sideWindow'
}

export enum VisibilityState {
  NONE = 'none',
  REDUCED = 'reduced',
  VISIBLE = 'visible',
  VISIBLE_LEFT = 'visible_left'
}

export type ReportingFormVisibilityProps = {
  context: ReportingContext
  visibility: VisibilityState
}
