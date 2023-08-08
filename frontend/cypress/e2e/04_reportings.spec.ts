/// <reference types="cypress" />

context('Missions', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.visit(`/side_window`)
  })

  it('Reportings should be displayed in Reportings Table and filterable', () => {
    cy.clickButton('signalements')

    cy.log('A default period filter should be set')
    cy.fill('Période', '24 dernières heures')
    cy.get('*[data-cy="totalReportings"]').contains('3')

    cy.log('Source type should be filtered')
    cy.get('*[data-cy="select-source-type-filter"]').click()
    cy.get('div[role="option"]').find('label').contains('Sémaphore').click()
    cy.get('*[data-cy="totalReportings"]').contains('2')

    cy.log('Source should be filtered')
    cy.get('*[data-cy="select-source-filter"]').click()
    cy.get('div[role="option"]').find('label').contains('Sémaphore de Dieppe').click()
    cy.get('*[data-cy="totalReportings"]').click('topLeft')
    cy.get('*[data-cy="totalReportings"]').contains('1')

    cy.get('*[data-cy="reinitialize-filters"]').click()
    cy.get('*[data-cy="totalReportings"]').contains('3')

    cy.get('*[data-cy="status-filter-Archivés"]').click()
    cy.fill('Période', '30 derniers jours')
    cy.get('*[data-cy="totalReportings"]').contains('6')
  })
})
