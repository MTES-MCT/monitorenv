import { getTotalOfControls } from '../utils'

export function getNumberOfControlsCell(envActions) {
  const numberOfControls = getTotalOfControls(envActions)

  return numberOfControls > 0 ? numberOfControls : '-'
}
