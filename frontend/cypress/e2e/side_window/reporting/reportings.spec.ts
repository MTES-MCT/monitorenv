import { createPendingMission } from '../../utils/createPendingMission'
import { createReporting } from '../../utils/createReporting'

import type { Reporting } from 'domain/entities/reporting'

context('Reportings', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.visit(`/side_window`, {
      onBeforeLoad() {
        Cypress.env('CYPRESS_REPORTING_FORM_AUTO_SAVE_ENABLED', 'true')
        Cypress.env('CYPRESS_MISSION_FORM_AUTO_SAVE_ENABLED', 'true')
      }
    })
    cy.intercept('GET', '/bff/v1/reportings*').as('getReportings')
    cy.clickButton('Signalements')
    cy.wait('@getReportings')
  })

  it('Reportings should be archived in Reportings Table', () => {
    cy.intercept('PUT', '/bff/v1/reportings/archive').as('archiveReporting')
    cy.getDataCy('status-filter-Archivés').click()
    cy.getDataCy('more-actions-reporting-5').scrollIntoView().click({ force: true })
    cy.getDataCy('archive-reporting-5').scrollIntoView().click({ force: true })

    cy.wait('@archiveReporting').then(({ response }) => {
      expect(response && response.statusCode).equal(204)
    })
    cy.getDataCy('edit-reporting-5').click({ force: true })
    cy.clickButton('Rouvrir le signalement')
    cy.clickButton('Fermer')
  })

  it('Reporting should be duplicate and editable in Reportings Table', () => {
    cy.intercept('PUT', '/bff/v1/reportings').as('createReporting')
    cy.getDataCy('status-filter-Archivés').click()
    cy.getDataCy('duplicate-reporting-5').click({ force: true })
    cy.get('form').should('exist')

    cy.fill('Source (1)', 'Autre')
    cy.fill('Nom, société ...', 'Reporting dupliqué')

    cy.fill('Thématiques et sous-thématiques', ['Implantation'])

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
      expect(reporting.reportType).equal('INFRACTION_SUSPICION')
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

  it('Reporting with MMSI should retrieve repeated infractions from previous envActions and suspicions of infraction', () => {
    cy.getDataCy('status-filter-Archivés').click()
    cy.intercept('GET', '/bff/v1/infractions/actions/987654321').as('getRepeatedInfractions')
    cy.intercept('GET', '/bff/v1/infractions/reportings/987654321?idToExclude=5').as('getSuspicionOfInfraction')
    cy.getDataCy('edit-reporting-5').click({ force: true })
    cy.wait(['@getRepeatedInfractions', '@getSuspicionOfInfraction'])
    cy.contains('Antécédents : 0 infraction (suspicion)0 infraction, 0 PV')
    createPendingMission().then(({ body }) => {
      cy.intercept('PUT', `/bff/v1/missions/${body.id}`).as('updateMission')
      // Add a control
      cy.clickButton('Ajouter')
      cy.clickButton('Ajouter des contrôles')
      cy.wait(500)

      cy.fill('Nb total de contrôles', 1)

      cy.fill('Type de cible', 'Véhicule')
      cy.fill('Type de véhicule', 'Navire')

      cy.clickButton('+ Ajouter un contrôle avec infraction')
      cy.fill('MMSI', '987654321')
      cy.fill("Type d'infraction", 'Avec PV')
      cy.fill('Réponse administrative', 'Sanction')
      cy.fill('Appréhension/saisie', 'Oui')
      cy.fill('Mise en demeure', 'Oui')
      cy.fill('NATINF', ["1508 - Execution d'un travail dissimule"])
      cy.fill('Nb de cibles avec cette infraction', 1)
      cy.clickButton("Valider l'infraction")
      cy.getDataCy('control-open-by').type('ABC')

      cy.wait('@updateMission').then(() => {
        cy.clickButton('Signalements')
        cy.wait('@getReportings')
        cy.contains('Antécédents : 0 infraction (suspicion)1 infraction, 1 PV')
        cy.clickButton('Fermer')
        cy.clickButton('Ajouter un nouveau signalement')
        createReporting().then(() => {
          cy.fill('Type de cible', 'Véhicule', { force: true })
          cy.fill('Type de véhicule', 'Navire', { force: true })
          cy.fill('MMSI', '987654321', { force: true })
          cy.contains('Antécédents : 1 infraction (suspicion)1 infraction, 1 PV')
          // cleanup
          cy.clickButton('Supprimer le signalement')
          cy.clickButton('Confirmer la suppression')
          cy.clickButton('Réinitialiser les filtres')

          cy.intercept('GET', '/bff/v1/missions*').as('getMissions')
          cy.intercept('PUT', '/bff/v1/missions').as('createMission')
          cy.clickButton('Missions et contrôles')
          cy.getDataCy(`edit-mission-${body.id}`).scrollIntoView().click({ force: true })
          cy.clickButton('Supprimer la mission')
          cy.clickButton('Confirmer la suppression')
        })
      })
    })
  })
})
