import { visitSideWindow } from '../../utils/visitSideWindow'

context('Missions', () => {
  beforeEach(() => {
    cy.intercept('GET', '/bff/v1/missions').as('getMissions')
    visitSideWindow()
    cy.wait('@getMissions')
  })

  it('Control Unit filter should not contain archived control units', () => {
    cy.intercept('GET', `/api/v1/control_units`).as('getControlUnits')

    cy.wait('@getControlUnits').then(({ response }) => {
      expect(response && response.statusCode).to.equal(200)
      const archivedControlUnit = response && response.body.find(controlUnit => controlUnit.name === 'BGC Ajaccio')
      expect(archivedControlUnit.isArchived).equals(true)
    })
    cy.getDataCy('select-units-filter').click({ force: true })
    cy.get('[data-key="BGC Ajaccio"]').should('not.exist')
  })
})
