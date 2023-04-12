import { registerMonitorUiCustomCommands } from '@mtes-mct/monitor-ui/cypress'

registerMonitorUiCustomCommands()
function unquote(str: string): string {
  return str.replace(/(^")|("$)/g, '')
}

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

Cypress.Commands.add('cleanScreenshots', (fromNumber: number): void => {
  cy.exec(`cd cypress/e2e/__image_snapshots__/ && find . | grep -P "[${fromNumber}-7]\\.png" | xargs -i rm {}\n`)
})
