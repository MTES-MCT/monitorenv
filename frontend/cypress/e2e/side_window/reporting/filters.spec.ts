import { ReportingSourceLabels } from '../../../../src/domain/entities/reporting'
import { SeaFrontLabel } from '../../../../src/domain/entities/seaFrontType'

context('Reportings', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.intercept('GET', '/bff/v1/reportings*').as('getReportings')
    cy.intercept('GET', '/api/v2/control_units').as('getControlUnits')
    cy.intercept('GET', '/api/v1/themes*').as('getThemes')
    cy.visit(`/side_window`)

    cy.clickButton('Signalements')
    cy.wait(['@getReportings', '@getControlUnits', '@getThemes'])
  })
  afterEach(() => {
    cy.clickButton('Réinitialiser les filtres')
  })

  it('Should filter reportings for the last seven days', () => {
    cy.fill('Période', '7 derniers jours')

    cy.wait('@getReportings')

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
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
  })

  it('Should filter reportings by source', () => {
    cy.wait(1000)
    cy.fill('Source', ['BSN Ste Maxime'], { delay: 300 })
    cy.wait(500)
    cy.getDataCy('reportings-filter-tags').find('.Component-SingleTag > span').contains('Source BSN Ste Maxime')

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)

    cy.get('.Table-SimpleTable tr').each((row, index, list) => {
      if (index === 0 || index === list.length - 1) {
        return
      }

      cy.wrap(row).should('contain', 'BSN Ste Maxime')
    })
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
    cy.fill('Filtre type de cible', ['Autre'])
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
  })

  it('Should filter reportings by themes', () => {
    cy.wait(200)
    cy.fill('Filtre thématiques et sous-thématiques', ['Réglementation du parc national'])
    cy.getDataCy('reportings-filter-tags')
      .find('.Component-SingleTag > span')
      .contains('Réglementation du parc national')

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 1)
    cy.get('.Table-SimpleTable tr').each((row, index, list) => {
      if (index === 0 || index === list.length - 1) {
        return
      }

      cy.wrap(row).should('contain', 'Réglementation du parc national')
    })
  })

  it('Should filter reportings by tags', () => {
    cy.wait(200)
    cy.fill('Filtre tags et sous-tags', ['Dragage'])
    cy.getDataCy('reportings-filter-tags').find('.Component-SingleTag > span').contains('Dragage')

    cy.get('.Table-SimpleTable tr').should('have.length', 2)
  })

  it('Should filter reportings by subTags', () => {
    cy.wait(200)
    cy.fill('Filtre tags et sous-tags', ['subtagMouillage1'])
    cy.getDataCy('reportings-filter-tags').find('.Component-SingleTag > span').contains('Mouillage')
    cy.getDataCy('reportings-filter-tags').find('.Component-SingleTag > span').contains('subtagMouillage1')

    cy.get('.Table-SimpleTable tr').should('have.length', 2)
  })

  it('Should filter reportings by sea-fronts', () => {
    cy.fill('Façade', [SeaFrontLabel.NAMO])
    cy.getDataCy('reportings-filter-tags').find('.Component-SingleTag > span').contains('Façade NAMO')

    cy.wait('@getReportings')

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index, list) => {
      if (index === 0 || index === list.length - 1) {
        return
      }

      cy.wrap(row).should('contain', 'NAMO')
    })
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
  })

  it('Should filter reportings by search query', () => {
    cy.fill('Rechercher une cible', 'mr le')
    cy.wait(500)
    cy.wait('@getReportings')

    cy.getDataCy('reporting-row').should('have.length', 3)
    cy.fill('Rechercher une cible', undefined)
  })

  it('Should tag filters depends on date filter', () => {
    cy.fill('Période', 'Période spécifique')

    // for year 2024
    cy.fill('Période spécifique', [
      [2023, 1, 1],
      [2023, 3, 3]
    ])
    cy.wait(500)
    cy.wait('@getReportings')

    // 2023 Sub-theme
    cy.fill('Filtre thématiques et sous-thématiques', ['Contrôle dans une AMP sans réglementation particulière'])
    cy.wait(200)

    // on two years
    cy.fill('Période spécifique', [
      [2023, 1, 1],
      [2024, 3, 3]
    ])
    cy.wait(500)
    cy.wait('@getReportings')

    // 2023 and 2024 Sub-theme
    cy.fill('Filtre thématiques et sous-thématiques', [
      'Contrôle dans une AMP sans réglementation particulière',
      'Surveillance générale'
    ])
  })
})
