/// <reference types="cypress" />

context('Missions', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.visit(`/side_window`)
    // cy.intercept('GET', '/bff/v1/reportings*').as('getReportings')
  })

  it('Reportings should be displayed in Reportings Table and filterable', () => {
    cy.clickButton('signalements')

    cy.log('A default period filter should be set')
    cy.fill('Période', '24 dernières heures')
    cy.get('*[data-cy="totalReportings"]').contains('2')

    cy.log('Source type should be filtered')
    cy.get('*[data-cy="select-source-type-filter"]').click()
    cy.get('div[role="option"]').find('label').contains('Sémaphore').click()
    cy.get('*[data-cy="totalReportings"]').contains('1')

    cy.log('Source should be filtered')
    cy.get('*[data-cy="select-source-filter"]').click()
    cy.get('div[role="option"]').find('label').contains('Sémaphore de Fécamp').click()
    cy.get('*[data-cy="totalReportings"]').click('topLeft')
    cy.get('*[data-cy="totalReportings"]').contains('1')

    cy.get('*[data-cy="reinitialize-filters"]').click()
    cy.get('*[data-cy="totalReportings"]').contains('2')

    cy.get('*[data-cy="status-filter-Archivés"]').click()
    cy.fill('Période', '30 derniers jours')
    cy.get('*[data-cy="totalReportings"]').contains('5')
  })

  it('Reportings should be archived in Reportings Table', () => {
    cy.clickButton('signalements')

    cy.wait(400)
    cy.intercept('PUT', '/bff/v1/reportings/5').as('archiveReporting')
    cy.get('*[data-cy="status-filter-Archivés"]').click()
    cy.get('*[data-cy="more-actions-reporting-5"]').scrollIntoView().click()
    cy.get('*[data-cy="archive-reporting-5"]').scrollIntoView().click()

    cy.wait('@archiveReporting').then(({ response }) => {
      expect(response && response.body.id).equal(5)
      expect(response && response.body.isArchived).equal(true)
    })
  })
})
