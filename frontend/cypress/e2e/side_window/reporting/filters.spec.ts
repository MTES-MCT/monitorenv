import { ReportingSourceLabels } from '../../../../src/domain/entities/reporting'
import { SeaFrontLabel } from '../../../../src/domain/entities/seaFrontType'

context('Reportings', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.visit(`/side_window`)
    cy.intercept('GET', '/bff/v1/reportings*').as('getReportings')
    cy.clickButton('signalements')
    cy.wait('@getReportings')
  })

  it('Reportings should be displayed in Reportings Table and filterable', () => {
    cy.log('A default period filter should be set')
    cy.fill('Période', '24 dernières heures')
    cy.get('*[data-cy="totalReportings"]').contains('5')

    cy.log('Source type should be filtered')
    cy.fill('Type de source', [ReportingSourceLabels.SEMAPHORE])
    cy.getDataCy('reportings-filter-tags').find('.Component-SingleTag > span').contains('Type Sémaphore')
    // here we test if the clear button worked correctly
    cy.fill('Type de source', undefined)

    cy.log('Source should be filtered')
    cy.fill('Source', ['Sémaphore de Fécamp'])
    cy.getDataCy('reportings-filter-tags').find('.Component-SingleTag > span').contains('Source Sémaphore de Fécamp')
    cy.fill('Source', undefined)

    cy.log('Reporting type should be filtered')
    cy.fill('Type de signalement', 'Observation')
    cy.getDataCy('totalReportings').contains('5')

    cy.log('Themes should be filtered')
    cy.fill('Thématiques', ['Rejets illicites', 'Police des mouillages'])
    cy.getDataCy('reportings-filter-tags').find('.Component-SingleTag > span').contains('Thème Rejets illicites')
    cy.getDataCy('reportings-filter-tags').find('.Component-SingleTag > span').contains('Thème Police des mouillages')
    cy.fill('Thématiques', undefined)

    cy.log('Sub-themes should be filtered')
    cy.fill('Sous-thématiques', ['Arrêté municipal'])
    cy.getDataCy('reportings-filter-tags').find('.Component-SingleTag > span').contains('Sous-thème Arrêté municipal')
    cy.fill('Sous-thématiques', undefined)

    cy.log('Sea fronts should be filtered')
    cy.fill('Facade', [SeaFrontLabel.MARTINIQUE, SeaFrontLabel.SOUTH_INDIAN_OCEAN])
    cy.getDataCy('reportings-filter-tags').find('.Component-SingleTag > span').contains('Facade Martinique')
    cy.getDataCy('reportings-filter-tags').find('.Component-SingleTag > span').contains('Facade Sud Océan Indien')
    cy.fill('Facade', undefined)

    cy.wait('@getReportings')
    cy.getDataCy('reinitialize-filters').click()
    cy.getDataCy('totalReportings').contains('5')

    cy.getDataCy('status-filter-Archivés').click()
    cy.fill('Période', '30 derniers jours')
    cy.getDataCy('totalReportings').contains('8')
  })
})
