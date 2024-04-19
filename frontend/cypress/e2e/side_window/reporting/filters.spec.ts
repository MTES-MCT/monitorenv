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
    cy.wait(1000)
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

  it('Should filter reportings by target type', () => {
    cy.fill('Type de cible', ['Autre'])
    cy.wait(500)
    cy.wait('@getReportings')

    cy.getDataCy('reportings-filter-tags').find('.Component-SingleTag > span').contains('Autre')

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)

    cy.get('.Table-SimpleTable tr').each((row, index, list) => {
      if (index === 0 || index === list.length - 1) {
        return
      }

      cy.wrap(row).should('contain', 'La description du signalement')
    })

    // here we test if the clear button worked correctly
    cy.fill('Type de cible', undefined)
  })

  it('Should filter reportings by themes', () => {
    cy.wait(200)
    cy.fill('Thématiques', ['Arrêté à visa environnemental'])
    cy.getDataCy('reportings-filter-tags').find('.Component-SingleTag > span').contains('Arrêté à visa environnemental')

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index, list) => {
      if (index === 0 || index === list.length - 1) {
        return
      }

      cy.wrap(row).should('contain', 'Arrêté à visa environnemental')
    })

    cy.fill('Thématiques', undefined)
  })

  it('Should filter reportings by sub-themes', () => {
    cy.wait(200)
    cy.log('Sub-themes should be filtered')
    cy.fill('Sous-thématiques', ['Surveillance générale'])
    cy.getDataCy('reportings-filter-tags')
      .find('.Component-SingleTag > span')
      .contains('Sous-thème Surveillance générale')

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index, list) => {
      if (index === 0 || index === list.length - 1) {
        return
      }

      cy.wrap(row).should('contain', 'Surveillance générale')
    })

    cy.fill('Sous-thématiques', undefined)
  })

  it('Should filter reportings by sea-fronts', () => {
    cy.fill('Façade', [SeaFrontLabel.NAMO])
    cy.getDataCy('reportings-filter-tags').find('.Component-SingleTag > span').contains('Facade NAMO')

    cy.wait('@getReportings')

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index, list) => {
      if (index === 0 || index === list.length - 1) {
        return
      }

      cy.wrap(row).should('contain', 'NAMO')
    })

    cy.fill('Façade', undefined)
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
  })

  it('Should filter reportings attached to a mission', () => {
    // filter only attached reportings
    cy.getDataCy('attach-to-mission-filter-ATTACHED').click()
    cy.wait(500)
    cy.wait('@getReportings')
    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index, list) => {
      if (index === 0 || index === list.length - 1) {
        return
      }

      cy.wrap(row).should('contain', 'Mission')
    })

    // filter only unattached reportings
    cy.getDataCy('attach-to-mission-filter-ATTACHED').click()
    cy.getDataCy('attach-to-mission-filter-UNATTACHED').click()
    cy.wait(500)
    cy.wait('@getReportings')
    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index, list) => {
      if (index === 0 || index === list.length - 1) {
        return
      }

      cy.wrap(row).should('not.contain', 'Mission')
    })

    // clean filter
    cy.getDataCy('attach-to-mission-filter-UNATTACHED').click()
  })

  it('Should filter reportings by search query', () => {
    cy.fill('Rechercher une cible', 'mr le')
    cy.wait(500)
    cy.wait('@getReportings')

    cy.getDataCy('reporting-row').should('have.length', 3)
    cy.fill('Rechercher une cible', undefined)
  })

  it('Should themes and subThemes filters depends on date filter', () => {
    cy.fill('Période', 'Période spécifique')

    // for year 2024
    cy.fill('Période spécifique', [
      [2024, 1, 1],
      [2024, 3, 3]
    ])
    cy.wait(500)
    cy.wait('@getReportings')

    cy.get('*[data-cy="reporting-theme-filter"]').click()
    cy.get('#themes-listbox > div').should('have.length', 18)

    cy.get('*[data-cy="reporting-sub-theme-filter"]').click()
    cy.get('#subThemes-listbox > div').should('have.length', 78)

    cy.wait(200)

    // on two years
    cy.fill('Période spécifique', [
      [2023, 1, 1],
      [2024, 3, 3]
    ])
    cy.wait(500)
    cy.wait('@getReportings')

    cy.getDataCy('reporting-theme-filter').click()
    cy.get('#themes-listbox > div').should('have.length', 34)

    cy.getDataCy('reporting-sub-theme-filter').click()
    cy.get('#subThemes-listbox > div').should('have.length', 161)
  })
})
