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
    cy.get('*[data-cy="select-units-filter"]').click({ force: true })
    cy.get('[data-key="BGC Ajaccio"]').should('not.exist')
  })

  it('Missions should be displayed in Missions Table and filterable', () => {
    cy.visit(`/side_window`).wait(1000)

    cy.get('*[data-cy="SideWindowHeader-title"]').contains('Missions et contrôles')

    cy.log('A default period filter should be set')
    cy.fill('Période', 'Une semaine')
    cy.get('*[data-cy="edit-mission-47"]').should('not.exist')
    cy.fill('Période', 'Un mois')
    cy.get('*[data-cy="edit-mission-47"]').should('exist')

    cy.log('Administrations should be filtered')
    cy.get('*[data-cy="edit-mission-48"]').should('exist')
    cy.get('*[data-cy="select-administration-filter"]').click()
    cy.get('div[role="option"]').find('label').contains('DDTM').forceClick()
    cy.get('*[data-cy="edit-mission-48"]').should('not.exist')

    cy.log('Initialize filters')
    cy.get('*[data-cy="reinitialize-filters"]').click()
    cy.get('*[data-cy="edit-mission-48"]').should('exist')

    cy.log('Units should be filtered')
    cy.get('*[data-cy="edit-mission-38"]').should('exist')
    cy.get('*[data-cy="select-units-filter"]').click()
    cy.get('div[role="option"]').find('label').contains('PAM Themis').click({ force: true })
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
    cy.visit(`/side_window`).wait(1000)

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
