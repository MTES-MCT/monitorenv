context('Missions', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
  })

  it('Control Unit filter should not contain archived control units', () => {
    cy.intercept('GET', `/api/v1/control_units`).as('getControlUnits')

    cy.visit(`/side_window`).wait(1000)

    cy.wait('@getControlUnits').then(({ response }) => {
      expect(response && response.statusCode).to.equal(200)
      const archivedControlUnit = response && response.body.find(controlUnit => controlUnit.name === 'BGC Ajaccio')
      expect(archivedControlUnit.isArchived).equals(true)
    })
    cy.getDataCy('select-units-filter').click({ force: true })
    cy.get('[data-key="BGC Ajaccio"]').should('not.exist')
  })
})
