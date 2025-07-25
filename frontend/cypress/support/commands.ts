import { registerMonitorUiCustomCommands } from '@mtes-mct/monitor-ui/cypress'

import { getFeaturesFromLayer } from './commands/getFeaturesFromLayer'

registerMonitorUiCustomCommands()
function unquote(str: string): string {
  return str.replace(/(^")|("$)/g, '')
}

Cypress.Commands.add('getFeaturesFromLayer', getFeaturesFromLayer)
Cypress.Commands.add(
  'before',
  {
    prevSubject: 'element'
  },
  (el: JQuery<Element>, property: string): string => {
    if (!el[0]) {
      throw new Error('`el[0]` is undefined.')
    }

    const win = el[0].ownerDocument.defaultView
    if (!win) {
      throw new Error('`win` is null.')
    }

    const before = win.getComputedStyle(el[0], 'before')

    return unquote(before.getPropertyValue(property))
  }
)
