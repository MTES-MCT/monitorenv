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

  it('9 Missions should be displayed in Missions Table', () => {
    cy.get('*[data-cy="SideWindowHeader-title"]').contains('Missions et contrôles')
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').contains('9')

    cy.log('A default period filter should be set')
    cy.fill('Période', 'Une semaine')

    cy.log('Administrations should be filtered')
    cy.get('*[data-cy="select-administration-filter"]').click({ force: true })
    cy.get('div[role="option"]').find('label').contains('DDTM').click({ force: true })
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').contains('5')

    cy.log('Initialize filters')
    cy.get('*[data-cy="reinitialize-filters"]').click({ force: true })

    cy.log('Units should be filtered')
    cy.get('*[data-cy="select-units-filter"]').click({ force: true })
    cy.get('div[role="option"]').find('label').contains('Cross Etel').click({ force: true })
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').contains('1')

    cy.log('Units filter should be clear')
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').click('topLeft')
    cy.get('*[data-cy="select-units-filter"] > .rs-stack > .rs-stack-item > .rs-btn-close').click({
      force: true
    })
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').contains('9')
  })

  it('Missions table should display all themes and subthemes of all the actions of the mission', () => {
    cy.get('*[data-cy="cell-envactions-themes"] > .rs-table-cell-content')
      .eq(3)
      .contains(
        "Police des espèces protégées et de leurs habitats (faune et flore) : Destruction, capture, arrachage / Atteinte aux habitats d'espèces protégées ; Police des mouillages : Mouillage individuel / ZMEL"
      )
  })
})
