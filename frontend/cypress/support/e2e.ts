import 'cypress-mouse-position/commands'
import 'cypress-plugin-snapshots/commands'

import './commands'
import './commands/dragTo'
import './commands/loadPath'

declare global {
  namespace Cypress {
    type DateTuple = [number, number, number]
    type DateWithTimeTuple = [number, number, number, number, number]
    interface Chainable {
      before(property: string): string
      cleanScreenshots(fromNumber: number): void
      clickButton(
        label: string,
        options?: Partial<{
          index: number
          withinSelector: string
        }>
      ): Chainable<JQuery<HTMLButtonElement>>
      clickLink(linkText: string): Chainable<JQuery<HTMLAnchorElement>>
      clickOutside(xPosition?: number, yPosition?: number): void
      dragTo(
        selector: string,
        options?: Partial<{
          delay: number
          isSmooth: boolean
        }>
      ): void
      fill(
        label: string,
        value:
          | boolean
          | number
          | string
          | string[]
          | (DateTuple | DateWithTimeTuple)
          | ([Cypress.DateTuple, Cypress.DateTuple] | [Cypress.DateWithTimeTuple, Cypress.DateWithTimeTuple])
          | undefined
      ): Chainable<Element>
      forceClick(): Chainable<JQuery<HTMLElement>>
      getDataCy(dataCy: string): Chainable<JQuery<HTMLElement>>
      loadPath(path: string): void
      toMatchImageSnapshot(settings: any): Chainable<Element>
    }
  }
}

Cypress.on('uncaught:exception', err => {
  // We ignore uncaught exceptions `Error: ResizeObserver loop completed with undelivered notifications.`
  // since they only seem to happen (sporadically) within e2e tests
  if (err.message.includes('ResizeObserver loop completed with undelivered notifications.')) {
    return false
  }

  // This React error does not reproduce in real life
  // It might be a bug resolved in React 18 : https://github.com/facebook/react/issues/17355#issuecomment-1173055443
  if (err.message.includes('Should not already be working')) {
    return false
  }

  return undefined
})
