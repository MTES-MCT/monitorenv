import { FAKE_WINDY_RESPONSE } from '../../constants'
import { visitSideWindow } from '../../utils/visitSideWindow'

context('Side Window > Mission Form > Create dashboard from mission', () => {
  it('should create a dashboard from a mission', () => {
    visitSideWindow()
    cy.intercept('GET', 'https://node.windy.com/**', FAKE_WINDY_RESPONSE)
    cy.intercept('GET', '/bff/v1/dashboards/extract*').as('getDashboardDatas')
    cy.intercept('GET', '/bff/v1/vigilance_areas').as('getVigilanceAreas')
    cy.intercept('POST', '/bff/v1/reportings').as('getReportings')
    cy.intercept('GET', '/bff/v1/control_units/nearby*').as('getNearbyControlUnits')

    cy.get('[data-cy="edit-mission-38"]').click({ force: true })
    cy.clickButton('Créer un tableau de bord')

    cy.getDataCy('create-dashboard-modal').within(() => {
      cy.contains('DDTM')
      cy.contains('DML 2A')
      cy.get('[role=radiogroup]').find('.rs-radio').first().should('have.class', 'rs-radio-checked')
      cy.contains('Culture marine')
      cy.contains('-')
    })

    cy.clickButton('Créer le tableau de bord')
    cy.wait(['@getDashboardDatas', '@getVigilanceAreas', '@getReportings', '@getNearbyControlUnits'])

    cy.get('.control-units-selected-accordion').click({ force: true })
    cy.contains('span', 'DML 2A - DDTM')
  })
})
