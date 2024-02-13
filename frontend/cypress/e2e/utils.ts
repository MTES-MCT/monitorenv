import EventSource, { sources } from 'eventsourcemock'
import { sortBy } from 'lodash/fp'

import type { CollectionItem } from '@mtes-mct/monitor-ui'

export function getLastIdFromCollection(collection: CollectionItem[]) {
  return (sortBy('id', collection)[collection.length - 1] as CollectionItem).id
}

export function expectPathToBe(expectedPath: string) {
  cy.location().should(location => {
    assert.equal(location.pathname, expectedPath)
  })
}

export function visitSideWindow(isAutoSaveEnabled = 'true') {
  cy.visit(`/side_window`, {
    onBeforeLoad(window: Cypress.AUTWindow & { env: { [key: string]: string } }) {
      Object.defineProperty(window, 'EventSource', { value: EventSource })
      Object.defineProperty(window, 'mockEventSources', { value: sources })

      Cypress.env('CYPRESS_MISSION_FORM_AUTO_SAVE_ENABLED', isAutoSaveEnabled)
      Cypress.env('CYPRESS_MISSION_FORM_AUTO_UPDATE', 'true')
    }
  })
}
