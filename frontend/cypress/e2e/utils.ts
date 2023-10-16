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
