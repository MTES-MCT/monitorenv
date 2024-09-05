import { customDayjs } from '@mtes-mct/monitor-ui'

import { getUtcDateInMultipleFormats } from '../../utils/getUtcDateInMultipleFormats'

context('Side Window > Mission List > Filter Bar', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.visit(`/side_window`).wait(1000)
  })

  afterEach(() => {
    cy.getDataCy('reinitialize-filters').scrollIntoView().click()
  })

  it('Should filter missions for the current week', () => {
    const currentWeek = encodeURIComponent(customDayjs().utc().startOf('day').utc().subtract(7, 'day').toISOString())
    cy.intercept('GET', `/bff/v1/missions?&startedAfterDateTime=${currentWeek}`).as('getMissionsForCurrentWeek')
    cy.fill('Période', 'Une semaine')
    cy.wait('@getMissionsForCurrentWeek')

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
  })

  it('Should filter missions for the current month', () => {
    const currentMonth = encodeURIComponent(customDayjs().utc().startOf('day').subtract(30, 'day').toISOString())
    cy.intercept('GET', `/bff/v1/missions?&startedAfterDateTime=${currentMonth}`).as('getMissionsForCurrentMonth')
    cy.fill('Période', 'Un mois')
    cy.wait('@getMissionsForCurrentMonth')

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
  })

  it('Should filter missions by completion status', () => {
    cy.fill('Etat des données', ['Complétées'])

    cy.getDataCy('missions-filter-tags').find('.Component-SingleTag > span').contains('Données complétées')
    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'Complétées')
    })
  })

  it('Should filter missions by administrations', () => {
    cy.fill('Administration', ['DDTM'])

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'DDTM')
    })
  })

  it('Should filter missions by units', () => {
    cy.fill('Unité', ['BSN'])

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'BSN Ste Maxime')
    })
  })

  it('Should filter missions by administration, and units filter accordingly.', () => {
    // selected an administration that does not correspond to the selected unit
    cy.fill('Unité', ['DPM – DDTM 14'])
    cy.getDataCy('missions-filter-tags').find('.Component-SingleTag > span').contains('Unité DPM – DDTM 14')
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'DPM – DDTM 14')
    })
    cy.fill('Administration', ['DREAL / DEAL'])
    cy.getDataCy('missions-filter-tags').find('.Component-SingleTag > span').contains('Admin. DREAL / DEAL')
    cy.getDataCy('missions-filter-tags')
      .find('.Component-SingleTag > span')
      .should('not.contain', 'Unité DPM - DDTM 14')
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'DREAL / DEAL')
    })

    // selected an administration corresponding to the selected unit
    cy.fill('Administration', undefined)
    cy.fill('Unité', ['DREAL Pays-de-La-Loire'])
    cy.getDataCy('missions-filter-tags').find('.Component-SingleTag > span').contains('Unité DREAL Pays-de-La-Loire')
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'DREAL Pays-de-La-Loire')
    })
    cy.fill('Administration', ['DREAL / DEAL'])
    cy.getDataCy('missions-filter-tags').find('.Component-SingleTag > span').contains('Admin. DREAL / DEAL')
    cy.getDataCy('missions-filter-tags').find('.Component-SingleTag > span').contains('Unité DREAL Pays-de-La-Loire')
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'DREAL Pays-de-La-Loire (DREAL / DEAL)')
    })
  })

  it('Should filter missions by types', () => {
    const date = encodeURIComponent(customDayjs().utc().startOf('day').toISOString())

    cy.intercept('GET', `/bff/v1/missions?&startedAfterDateTime=${date}&missionTypes=SEA`).as('getMissionsByType')

    cy.fill('Type de mission', ['Mer'])

    cy.wait('@getMissionsByType')
    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'Mer')
    })
  })

  it('Should filter missions by sea fronts', () => {
    const date = encodeURIComponent(customDayjs().utc().startOf('day').toISOString())
    cy.intercept('GET', `/bff/v1/missions?&startedAfterDateTime=${date}&seaFronts=MED`).as('getMissionsBySeaFront')

    cy.fill('Façade', ['MED'])

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'MED')
    })
    cy.wait('@getMissionsBySeaFront')
  })

  it('Should filter missions by status', () => {
    const date = encodeURIComponent(customDayjs().utc().startOf('day').toISOString())
    cy.intercept('GET', `/bff/v1/missions?&startedAfterDateTime=${date}&missionStatus=PENDING`).as(
      'getMissionsByStatus'
    )

    cy.fill('Statut de mission', ['En cours'])

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'En cours')
    })
    cy.wait('@getMissionsByStatus')
  })

  it('Should filter missions by themes', () => {
    cy.wait(200)
    cy.fill('Thématique', ['Mouillage individuel'])

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'Mouillage individuel')
    })
  })

  it('Should themes filter depends on date filter', () => {
    cy.fill('Période', 'Période spécifique')

    const expectedStartDate = getUtcDateInMultipleFormats('2024-01-01T00:00:00.000Z')
    const expectedEndDate = getUtcDateInMultipleFormats('2024-03-03T23:59:59.000Z')

    cy.intercept(
      'GET',
      `/bff/v1/missions?&startedAfterDateTime=${expectedStartDate.asEncodedStringUtcDate}&startedBeforeDateTime=${expectedEndDate.asEncodedStringUtcDate}`
    ).as('getMissionsByPeriod')

    // for year 2024
    cy.fill('Période spécifique', [expectedStartDate.asDatePickerDate, expectedEndDate.asDatePickerDate])
    cy.wait(500)
    cy.wait('@getMissionsByPeriod')

    cy.getDataCy('mission-theme-filter').click()
    cy.get('#theme-listbox > div').should('have.length', 18)

    cy.wait(200)

    // on two years
    const secondExpectedStartDate = getUtcDateInMultipleFormats('2023-01-01T00:00:00.000Z')
    const secondExpectedEndDate = getUtcDateInMultipleFormats('2024-03-03T23:59:59.000Z')

    cy.intercept(
      'GET',
      `/bff/v1/missions?&startedAfterDateTime=${secondExpectedStartDate.asEncodedStringUtcDate}&startedBeforeDateTime=${secondExpectedEndDate.asEncodedStringUtcDate}`
    ).as('getMissionsBySecondPeriod')

    cy.fill('Période spécifique', [secondExpectedStartDate.asDatePickerDate, secondExpectedEndDate.asDatePickerDate])
    cy.wait(500)
    cy.wait('@getMissionsBySecondPeriod')

    cy.getDataCy('mission-theme-filter').click()
    cy.get('#theme-listbox > div').should('have.length', 34)
  })

  it('Should filter missions with env actions', () => {
    cy.fill('Missions avec actions CACEM', true)

    cy.getDataCy('edit-mission-53').should('exist')
    cy.getDataCy('edit-mission-38').should('exist')
    cy.getDataCy('edit-mission-22').should('not.exist')
    cy.getDataCy('edit-mission-43').should('not.exist')
  })

  it('Should filter missions by search query', () => {
    cy.fill('Rechercher dans un contrôle (navire, personne...)', 'BALTIK')

    cy.get('.Table-SimpleTable tr').should('have.length', 2)
    cy.getDataCy('edit-mission-34').click({ force: true })

    cy.getDataCy('action-card').eq(1).click()
    cy.getDataCy('infraction-0-identification').should('contain', 'BALTIK')
    cy.getDataCy('quit-edit-mission').click()
  })
})
