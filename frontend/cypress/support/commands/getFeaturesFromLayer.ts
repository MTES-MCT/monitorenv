import type { FeatureLike } from 'ol/Feature'

export function getFeaturesFromLayer(
  layerName: string,
  pixel: [number, number]
): Cypress.Chainable<Array<FeatureLike>> {
  return cy.window().its('olTestUtils').invoke('getFeaturesFromLayer', layerName, pixel)
}
