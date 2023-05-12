/// <reference types="cypress" />

context('Missions', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.visit(`/side_window`)
  })
  it('Control Unit filter should not contain archived control units', () => {
    cy.intercept('GET', `/bff/v1/control_units`).as('getControlUnits')
    cy.wait('@getControlUnits').then(({ response }) => {
      expect(response && response.statusCode).to.equal(200)
      const archivedControlUnit = response.body.find(controlUnit => controlUnit.name === 'BGC Ajaccio')
      expect(archivedControlUnit.isArchived).equals(true)
    })
    cy.get('*[data-cy="select-units-filter"]').click({ force: true })
    cy.get('[data-key="BGC Ajaccio"]').should('not.exist')
  })

  it('Missions should be displayed in Missions Table and filterable', () => {
    cy.get('*[data-cy="SideWindowHeader-title"]').contains('Missions et contrôles')
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').contains('9')

    cy.log('A default period filter should be set')
    cy.fill('Période', 'Une semaine')

    cy.log('Administrations should be filtered')
    cy.get('*[data-cy="select-administration-filter"]').click()
    cy.get('div[role="option"]').find('label').contains('DDTM').click()
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').contains('5')

    cy.log('Initialize filters')
    cy.get('*[data-cy="reinitialize-filters"]').click()

    cy.log('Units should be filtered')
    cy.get('*[data-cy="select-units-filter"]').click()
    cy.get('div[role="option"]').find('label').contains('Cross Etel').click()
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').contains('1')

    cy.log('Units filter should be clear')
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').click('topLeft')
    cy.get('*[data-cy="select-units-filter"]').get('[title="Clear"]').click({
      force: true
    })
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').contains('9')
  })

  it('Missions table should display all themes and subthemes of all the actions of the mission', () => {
    cy.get('*[data-cy="cell-envactions-themes"]')
      .eq(0)
      .contains(
        'Police des espèces protégées et de leurs habitats (faune et flore) : Dérogations concernant les espèces protégées'
      )
  })
})
