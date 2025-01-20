import type { Reporting } from 'domain/entities/reporting'

context('Reportings', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.visit(`/side_window`, {
      onBeforeLoad() {
        Cypress.env('CYPRESS_REPORTING_FORM_AUTO_SAVE_ENABLED', 'true')
      }
    })
    cy.intercept('GET', '/bff/v1/reportings*').as('getReportings')
    cy.clickButton('Signalements')
    cy.wait('@getReportings')
  })

  it('Reportings should be archived in Reportings Table', () => {
    cy.intercept('PUT', '/bff/v1/reportings/5').as('archiveReporting')
    cy.getDataCy('status-filter-Archivés').click()
    cy.getDataCy('more-actions-reporting-5').scrollIntoView().click({ force: true })
    cy.getDataCy('archive-reporting-5').scrollIntoView().click({ force: true })

    cy.wait('@archiveReporting').then(({ response }) => {
      expect(response && response.body.id).equal(5)
      expect(response && response.body.isArchived).equal(true)
    })
  })

  it('Reporting should be duplicate and editable in Reportings Table', () => {
    cy.intercept('PUT', '/bff/v1/reportings').as('createReporting')
    cy.getDataCy('status-filter-Archivés').click()
    cy.getDataCy('duplicate-reporting-5').click({ force: true })
    cy.get('form').should('exist')

    cy.fill('Source (1)', 'Autre')
    cy.fill('Nom, société ...', 'Reporting dupliqué')

    cy.fill('Thématique du signalement', 'Culture marine')
    cy.fill('Sous-thématique du signalement', ['Implantation'])

    cy.fill('Saisi par', 'CDA')

    cy.wait('@createReporting').then(({ request, response }) => {
      const reportingRequest: Reporting = request.body
      expect(reportingRequest.reportingSources[0]?.id).equal(null)
      expect(reportingRequest.id).equal(null)
      expect(reportingRequest.reportingId).equal(null)

      const reporting: Reporting = response?.body
      expect(reporting.reportingSources[0]?.sourceName).equal('Reporting dupliqué')
      expect(reporting.reportingSources[0]?.id).not.equal(null)
      expect(reporting.description).equal('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
      expect(reporting.reportType).equal('OBSERVATION')
      expect(reporting.openBy).equal('CDA')

      // clean
      cy.wait(250)
      cy.clickButton('Supprimer le signalement')
      cy.clickButton('Confirmer la suppression')
    })
  })

  it('Reporting should be delete in Reportings Table', () => {
    cy.intercept('DELETE', '/bff/v1/reportings/4').as('deleteReporting')
    cy.getDataCy('status-filter-Archivés').click()
    cy.getDataCy('more-actions-reporting-4').scrollIntoView().click({ force: true })
    cy.getDataCy('delete-reporting-4').scrollIntoView().click({ force: true })

    cy.clickButton('Confirmer la suppression')

    cy.wait('@deleteReporting').then(({ response }) => {
      expect(response && response.statusCode).equal(204)
    })
  })

  it('Multiples reportings can be opened or created and saved in store', () => {
    cy.getDataCy('status-filter-Archivés').click()

    cy.getDataCy('edit-reporting-5').click({ force: true })
    cy.getDataCy('reporting-collapse-or-expand-button-5').click()

    // create new reporting
    cy.clickButton('Ajouter un nouveau signalement')
    cy.wait(500)
    cy.getDataCy('reporting-title').contains('NOUVEAU SIGNALEMENT (1)')

    cy.fill('Nom du Sémaphore', 'Sémaphore de Dieppe')
    cy.getDataCy('reporting-target-type').click({ force: true })
    cy.get('div[role="option"]').contains('Personne morale').click()
    cy.wait(200)

    cy.getDataCy('reporting-collapse-or-expand-button-new-1').click()

    // create another new reporting
    cy.clickButton('Ajouter un nouveau signalement')
    cy.getDataCy('reporting-title').contains('NOUVEAU SIGNALEMENT (2)')
    cy.getDataCy('reporting-collapse-or-expand-button-new-1').click()

    cy.getDataCy('reporting-title').contains('NOUVEAU SIGNALEMENT (1)')
    cy.getDataCy('add-semaphore-source').contains('Sémaphore de Dieppe')
    cy.getDataCy('reporting-target-type').contains('Personne morale')
  })

  it('Mission with attached env_action can be detached', () => {
    cy.intercept('PUT', '/bff/v1/reportings/6').as('updateReporting')
    cy.getDataCy('status-filter-Archivés').click()

    cy.getDataCy('edit-reporting-6').click({ force: true })
    cy.clickButton('Détacher la mission')

    cy.wait(500)

    cy.wait('@updateReporting').then(({ request, response }) => {
      expect(response && response.statusCode).equal(200)

      expect(request.body.attachedEnvActionId).equal(null)
      expect(response && response.body?.attachedEnvActionId).equal(null)
    })
  })
})
