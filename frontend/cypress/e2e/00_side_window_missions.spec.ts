/// <reference types="cypress" />

context('Missions', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.visit(`/side_window`)
  })
  it('Control Unit filter should not contain archived control units', () => {
    cy.intercept('GET', `/bff/v1/legacy_control_units`).as('getControlUnits')
    cy.wait('@getControlUnits').then(({ response }) => {
      expect(response && response.statusCode).to.equal(200)
      const archivedControlUnit = response && response.body.find(controlUnit => controlUnit.name === 'BGC Ajaccio')
      expect(archivedControlUnit.isArchived).equals(true)
    })
    cy.get('*[data-cy="select-units-filter"]').click({ force: true })
    cy.get('[data-key="BGC Ajaccio"]').should('not.exist')
  })

  it('Missions should be displayed in Missions Table and filterable', () => {
    cy.get('*[data-cy="SideWindowHeader-title"]').contains('Missions et contrôles')

    cy.log('A default period filter should be set')
    cy.fill('Période', 'Une semaine')
    cy.get('*[data-cy="edit-mission-47"]').should('not.exist')
    cy.fill('Période', 'Un mois')
    cy.get('*[data-cy="edit-mission-47"]').should('exist')

    cy.log('Administrations should be filtered')
    cy.get('*[data-cy="edit-mission-48"]').should('exist')
    cy.get('*[data-cy="select-administration-filter"]').click()
    cy.get('div[role="option"]').find('label').contains('DDTM').click()
    cy.get('*[data-cy="edit-mission-48"]').should('not.exist')

    cy.log('Initialize filters')
    cy.get('*[data-cy="reinitialize-filters"]').click()
    cy.get('*[data-cy="edit-mission-48"]').should('exist')

    cy.log('Units should be filtered')
    cy.get('*[data-cy="edit-mission-38"]').should('exist')
    cy.get('*[data-cy="select-units-filter"]').click()
    cy.get('div[role="option"]').find('label').contains('Cross Etel').click()
    cy.get('*[data-cy="edit-mission-48"]').should('exist')
    cy.get('*[data-cy="edit-mission-38"]').should('not.exist')

    cy.log('Units filter should be clear')
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').click('topLeft')
    cy.get('*[data-cy="select-units-filter"]').get('[title="Clear"]').click({
      force: true
    })
    cy.get('*[data-cy="edit-mission-38"]').should('exist')
  })

  it('Missions table should display all themes and subthemes of all the actions of the mission', () => {
    cy.log('Should filter by theme')
    cy.get('*[data-cy="select-theme-filter"]').click()
    cy.get('div[role="option"]').find('label').contains('Police des épaves').click({ force: true })
    cy.get('*[data-cy="cell-envactions-themes"]')
      .eq(0)
      .contains(
        'Police des activités de cultures marines : Contrôle du schéma des structures ; Police des épaves : Épave/navire abandonné / Contrôle administratif'
      )
  })
})
