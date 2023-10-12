context('Missions', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.visit(`/side_window`)
  })

  it('Reportings should be displayed in Reportings Table and filterable', () => {
    cy.intercept('GET', '/bff/v1/reportings*').as('getReportings')
    cy.clickButton('signalements')
    cy.wait('@getReportings')
    cy.log('A default period filter should be set')
    cy.fill('Période', '24 dernières heures')
    cy.get('*[data-cy="totalReportings"]').contains('4')

    cy.log('Source type should be filtered')
    cy.get('*[data-cy="select-source-type-filter"]').click()
    cy.get('div[role="option"]').find('label').contains('Sémaphore').click()
    cy.get('*[data-cy="totalReportings"]').contains('2')

    cy.log('Source should be filtered')
    cy.get('*[data-cy="select-source-filter"]').click()
    cy.get('div[role="option"]').find('label').contains('Sémaphore de Fécamp').click()
    cy.get('*[data-cy="totalReportings"]').click('topLeft')
    cy.get('*[data-cy="totalReportings"]').contains('2')

    cy.wait('@getReportings')
    cy.get('*[data-cy="reinitialize-filters"]').click()
    cy.get('*[data-cy="totalReportings"]').contains('4')

    cy.get('*[data-cy="status-filter-Archivés"]').click()
    cy.fill('Période', '30 derniers jours')
    cy.get('*[data-cy="totalReportings"]').contains('8')
  })

  it('Reportings should be archived in Reportings Table', () => {
    cy.clickButton('signalements')

    cy.wait(400)
    cy.intercept('PUT', '/bff/v1/reportings/5').as('archiveReporting')
    cy.get('*[data-cy="status-filter-Archivés"]').click()
    cy.get('*[data-cy="more-actions-reporting-5"]').scrollIntoView().click({ force: true })
    cy.get('*[data-cy="archive-reporting-5"]').scrollIntoView().click({ force: true })

    cy.wait('@archiveReporting').then(({ response }) => {
      expect(response && response.body.id).equal(5)
      expect(response && response.body.isArchived).equal(true)
    })
  })

  it('Reporting should be duplicate and editable in Reportings Table', () => {
    cy.clickButton('signalements')

    cy.wait(400)
    cy.intercept('PUT', '/bff/v1/reportings').as('createReporting')
    cy.get('*[data-cy="status-filter-Archivés"]').click()
    cy.get('*[data-cy="duplicate-reporting-5"]').click({ force: true })
    cy.get('form').should('exist')

    cy.get('.rs-radio').find('label').contains('Autre').click()
    cy.fill('Nom, société ...', 'Reporting dupliqué')
    cy.fill('Saisi par', 'CDA')

    cy.clickButton('Valider le signalement')

    cy.wait('@createReporting').then(({ response }) => {
      expect(response && response.body.id).equal(9)
      expect(response && response.body.sourceName).equal('Reporting dupliqué')
    })
  })

  it('Reporting should be delete in Reportings Table', () => {
    cy.clickButton('signalements')

    cy.wait(400)
    cy.intercept('DELETE', '/bff/v1/reportings/6').as('deleteReporting')
    cy.get('*[data-cy="status-filter-Archivés"]').click()
    cy.get('*[data-cy="more-actions-reporting-6"]').scrollIntoView().click({ force: true })
    cy.get('*[data-cy="delete-reporting-6"]').scrollIntoView().click({ force: true })

    cy.clickButton('Confirmer la suppression')

    cy.wait('@deleteReporting').then(({ response }) => {
      expect(response && response.statusCode).equal(204)
    })
  })
  it('Can open multiple reportings', () => {
    cy.clickButton('signalements')

    cy.wait(400)
    cy.get('*[data-cy="status-filter-Archivés"]').click()

    cy.get('*[data-cy="edit-reporting-5"]').click({ force: true })
    cy.get('*[data-cy="reporting-reduce-or-expand-button"]').click()

    cy.clickButton('Ajouter un nouveau signalement')
    cy.get('*[data-cy="reporting-title"]').contains('NOUVEAU SIGNALEMENT (1)')
    cy.get('*[data-cy="reporting-reduce-or-expand-button"]').click()

    cy.clickButton('Ajouter un nouveau signalement')
    cy.get('*[data-cy="reporting-title"]').contains('NOUVEAU SIGNALEMENT (2)')
    cy.get('*[data-cy="reporting-reduce-or-expand-button"]').click()
  })
})
