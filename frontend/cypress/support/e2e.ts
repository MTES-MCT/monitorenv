/// <reference path="../../node_modules/@mtes-mct/monitor-ui/cypress/global.d.ts" />

import type { FeatureLike } from 'ol/Feature'
import 'cypress-axe'

import './commands'
import './commands/dragTo'
import './commands/loadPath'

declare global {
  namespace Cypress {
    interface Chainable {
      before(property: string): string
      dragTo(
        selector: string,
        options?: Partial<{
          delay: number
          isSmooth: boolean
        }>
      ): void
      getFeaturesFromLayer(layerName: string, layerPixel: [number, number]): Cypress.Chainable<Array<FeatureLike>>
      loadPath(path: string): void
      login(user: string): void
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
