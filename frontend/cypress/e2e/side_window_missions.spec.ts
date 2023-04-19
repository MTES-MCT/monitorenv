/// <reference types="cypress" />

import dayjs from 'dayjs'

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

  it('11 Missions should be displayed in Missions Table', () => {
    cy.get('*[data-cy="SideWindowHeader-title"]').contains('Missions et contrôles')
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').contains('11')

    cy.log('A default date filter should be set')
    const thirtyDaysAgo = dayjs().subtract(30, 'days')

    cy.get('*[data-cy="datepicker-missionStartedAfter"]').contains(`${thirtyDaysAgo.format('YYYY-MM-DD')}`)

    cy.log('Units should be filtered')
    cy.fill('Unités', ['Cross Etel'])
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').contains('1')

    cy.log('Administrations should be filtered')
    cy.fill('Administrations', ['DDTM'])
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').contains('7')

    cy.fill('Administrations', undefined)
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').contains('11')
  })

  it('Missions table should display all themes and subthemes of all the actions of the mission', () => {
    cy.get('*[data-cy="cell-envactions-themes"] > .rs-table-cell-content')
      .eq(3)
      .contains(
        "Police des espèces protégées et de leurs habitats (faune et flore) : Destruction, capture, arrachage / Atteinte aux habitats d'espèces protégées ; Police des mouillages : Mouillage individuel / ZMEL"
      )
  })
})
