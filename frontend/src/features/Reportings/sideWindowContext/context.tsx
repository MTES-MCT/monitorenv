import { createContext } from 'react'

export enum SideWindowReportingFormVisibility {
  NONE = 'none',
  REDUCED = 'reduced',
  VISIBLE = 'visible'
}

export const SideWindowReportingsContext = createContext({
  contextVisibility: SideWindowReportingFormVisibility.NONE,
  setContextVisibility: visibility => visibility
})
