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

  it('Should filter reportings for the last seven days', () => {
    cy.fill('Période', '7 derniers jours')

    cy.wait('@getReportings')

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)

    cy.fill('Période', '24 dernières heures')
  })
  it('Should filter reportings by source type', () => {
    cy.fill('Type de source', [ReportingSourceLabels.SEMAPHORE])

    cy.getDataCy('reportings-filter-tags').find('.Component-SingleTag > span').contains('Type Sémaphore')
    cy.wait('@getReportings')

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)

    cy.get('.Table-SimpleTable tr').each((row, index, list) => {
      if (index === 0 || index === list.length - 1) {
        return
      }

      cy.wrap(row).should('contain', 'Sémaphore')
    })

    // here we test if the clear button worked correctly
    cy.fill('Type de source', undefined)
  })

  it('Should filter reportings by source', () => {
    cy.fill('Source', ['Sémaphore de Fécamp'])
    cy.wait(500)
    cy.getDataCy('reportings-filter-tags').find('.Component-SingleTag > span').contains('Source Sémaphore de Fécamp')

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)

    cy.get('.Table-SimpleTable tr').each((row, index, list) => {
      if (index === 0 || index === list.length - 1) {
        return
      }

      cy.wrap(row).should('contain', 'Sémaphore de Fécamp')
    })
    // here we test if the clear button worked correctly
    cy.fill('Source', undefined)
  })

  it('Should filter reportings by type', () => {
    cy.fill('Type de signalement', 'Observation')
    cy.wait(500)
    cy.wait('@getReportings')

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)

    cy.get('.Table-SimpleTable tr').each((row, index, list) => {
      if (index === 0 || index === list.length - 1) {
        return
      }

      cy.wrap(row).should('contain', 'Observation')
    })
  })

  it('Should filter reportings by themes', () => {
    cy.fill('Thématiques', ['Police des mouillages'])
    cy.getDataCy('reportings-filter-tags').find('.Component-SingleTag > span').contains('Police des mouillages')

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index, list) => {
      if (index === 0 || index === list.length - 1) {
        return
      }

      cy.wrap(row).should('contain', 'Police des mouillages')
    })

    cy.fill('Thématiques', undefined)
  })

  it('Should filter reportings by sub-themes', () => {
    cy.log('Sub-themes should be filtered')
    cy.fill('Sous-thématiques', ['ZMEL'])
    cy.getDataCy('reportings-filter-tags').find('.Component-SingleTag > span').contains('Sous-thème ZMEL')

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index, list) => {
      if (index === 0 || index === list.length - 1) {
        return
      }

      cy.wrap(row).should('contain', 'ZMEL')
    })

    cy.fill('Sous-thématiques', undefined)
  })

  it('Should filter reportings by sea-fronts', () => {
    cy.fill('Facade', [SeaFrontLabel.NAMO])
    cy.getDataCy('reportings-filter-tags').find('.Component-SingleTag > span').contains('Facade NAMO')

    cy.wait('@getReportings')

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index, list) => {
      if (index === 0 || index === list.length - 1) {
        return
      }

      cy.wrap(row).should('contain', 'NAMO')
    })

    cy.fill('Facade', undefined)
  })

  it('Should filter reportings by status', () => {
    cy.getDataCy('status-filter-En cours').click()
    cy.getDataCy('status-filter-Archivés').click()
    cy.wait(500)
    cy.wait('@getReportings')

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index, list) => {
      if (index === 0 || index === list.length - 1) {
        return
      }

      cy.wrap(row).should('contain', 'Archivé')
    })

    cy.fill('Facade', undefined)
  })
})
