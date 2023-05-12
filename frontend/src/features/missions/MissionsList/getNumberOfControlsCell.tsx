import _ from 'lodash'

export function getNumberOfControlsCell(envActions) {
  const numberOfControls = _.reduce(envActions, (sum, action) => sum + (action.actionNumberOfControls || 0), 0)

  return numberOfControls
}
