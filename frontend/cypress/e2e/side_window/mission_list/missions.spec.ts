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

  it('Missions should be displayed in Missions Table and filterable', () => {
    cy.visit(`/side_window`).wait(1000)

    cy.getDataCy('SideWindowHeader-title').contains('Missions et contrôles')

    cy.log('A default period filter should be set')
    cy.fill('Période', 'Une semaine')
    cy.getDataCy('edit-mission-47').should('not.exist')
    cy.fill('Période', 'Un mois')
    cy.getDataCy('edit-mission-47').scrollIntoView().should('exist')

    cy.log('Administrations should be filtered')
    cy.fill('Administration', ['DDTM'])
    cy.getDataCy('edit-mission-48').should('not.exist')

    cy.log('Initialize filters')
    cy.clickButton('Réinitialiser les filtres')
    cy.getDataCy('edit-mission-48').scrollIntoView().should('exist')

    cy.log('Units should be filtered')
    cy.getDataCy('edit-mission-38').scrollIntoView().should('exist')
    cy.fill('Unité', ['PAM Themis'])
    cy.getDataCy('edit-mission-48').scrollIntoView().should('exist')
    cy.getDataCy('edit-mission-38').should('not.exist')

    cy.log('Units filter should be clear')
    cy.fill('Unité', undefined)
    cy.getDataCy('edit-mission-38').scrollIntoView().should('exist')
  })
})
