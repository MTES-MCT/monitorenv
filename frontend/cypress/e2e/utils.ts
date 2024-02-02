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

      if (!window.env) {
        Object.defineProperty(window, 'env', {
          value: {
            REACT_APP_CYPRESS_TEST: true,
            REACT_APP_MISSION_FORM_AUTO_SAVE_ENABLED: isAutoSaveEnabled,
            REACT_APP_MISSION_FORM_AUTO_UPDATE: 'true'
          }
        })

        return
      }

      // eslint-disable-next-line no-param-reassign
      window.env.REACT_APP_MISSION_FORM_AUTO_SAVE_ENABLED = isAutoSaveEnabled
      // eslint-disable-next-line no-param-reassign
      window.env.REACT_APP_MISSION_FORM_AUTO_UPDATE = 'true'
    }
  })
}
