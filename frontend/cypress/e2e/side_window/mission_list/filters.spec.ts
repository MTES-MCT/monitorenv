import { customDayjs } from '@mtes-mct/monitor-ui'

import { getUtcDateInMultipleFormats } from '../../utils/getUtcDateInMultipleFormats'

const today = encodeURIComponent(customDayjs().utc().endOf('day').toISOString())

context('Side Window > Mission List > Filter Bar', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.visit(`/side_window`).wait(1000)
    cy.clickButton('Afficher les filtres')
  })

  afterEach(() => {
    cy.clickButton('Réinitialiser les filtres')
  })

  it('Should filter missions for the current week', () => {
    const currentWeek = encodeURIComponent(customDayjs().utc().startOf('day').utc().subtract(7, 'day').toISOString())
    cy.intercept('GET', `/bff/v1/missions?&startedAfterDateTime=${currentWeek}&startedBeforeDateTime=${today}`).as(
      'getMissionsForCurrentWeek'
    )
    cy.fill('Période', '7 derniers jours')
    cy.wait('@getMissionsForCurrentWeek')

    cy.getDataCy('mission-row').should('have.length.to.be.greaterThan', 0)
  })

  it('Should filter missions for the current month', () => {
    const currentMonth = encodeURIComponent(customDayjs().utc().startOf('day').subtract(30, 'day').toISOString())
    cy.intercept('GET', `/bff/v1/missions?&startedAfterDateTime=${currentMonth}&startedBeforeDateTime=${today}`).as(
      'getMissionsForCurrentMonth'
    )
    cy.fill('Période', '30 derniers jours')
    cy.wait('@getMissionsForCurrentMonth')

    cy.getDataCy('mission-row').should('have.length.to.be.greaterThan', 0)
  })

  it('Should filter missions for the current year', () => {
    const currentYear = encodeURIComponent(customDayjs().utc().startOf('year').toISOString())
    cy.intercept('GET', `/bff/v1/missions?&startedAfterDateTime=${currentYear}`).as('getMissionsForCurrentYear')
    cy.fill('Période', 'Année en cours')
    cy.wait('@getMissionsForCurrentYear')

    cy.getDataCy('mission-row').should('have.length.to.be.greaterThan', 0)
  })

  it('Should filter missions for future missions', () => {
    const currentEndOfDay = encodeURIComponent(customDayjs().utc().endOf('day').toISOString())
    cy.intercept('GET', `/bff/v1/missions?&startedAfterDateTime=${currentEndOfDay}`).as('getMissionsForCurrentYear')
    cy.fill('Période', 'À venir')
    cy.wait('@getMissionsForCurrentYear')

    cy.getDataCy('mission-row').should('have.length.to.be.greaterThan', 0)
  })

  it('Should filter missions by completion status', () => {
    const currentYear = encodeURIComponent(customDayjs().utc().startOf('year').toISOString())
    cy.intercept('GET', `/bff/v1/missions?&startedAfterDateTime=${currentYear}`).as('getMissionsForCurrentYear')
    cy.fill('Période', 'Année en cours')
    cy.wait('@getMissionsForCurrentYear')
    cy.fill('État des données', ['Complétées'])

    cy.getDataCy('missions-filter-tags').find('.Component-SingleTag > span').contains('Données complétées')
    cy.getDataCy('mission-row').should('have.length.to.be.greaterThan', 0)
    cy.getDataCy('mission-row').each(row => {
      cy.wrap(row).should('contain', 'Complétées')
    })
  })

  it('Should filter missions by administrations', () => {
    cy.fill('Administration', ['DDTM'])

    cy.getDataCy('mission-row').should('have.length.to.be.greaterThan', 0)
    cy.getDataCy('mission-row').each(row => {
      cy.wrap(row).should('contain', 'DML 2A')
    })
  })

  it('Should filter missions by units', () => {
    const currentYear = encodeURIComponent(customDayjs().utc().startOf('year').toISOString())
    cy.intercept('GET', `/bff/v1/missions?&startedAfterDateTime=${currentYear}`).as('getMissionsForCurrentYear')
    cy.fill('Période', 'Année en cours')
    cy.wait('@getMissionsForCurrentYear')
    cy.fill('Unité', ['BSN'])

    cy.getDataCy('mission-row').should('have.length.to.be.greaterThan', 0)
    cy.getDataCy('mission-row').each(row => {
      cy.wrap(row).should('contain', 'BSN Ste Maxime')
    })
  })

  it('Should filter missions by administration, and units filter accordingly.', () => {
    // selected an administration that does not correspond to the selected unit
    const currentYear = encodeURIComponent(customDayjs().utc().startOf('year').toISOString())
    cy.intercept('GET', `/bff/v1/missions?&startedAfterDateTime=${currentYear}`).as('getMissionsForCurrentYear')
    cy.fill('Période', 'Année en cours')
    cy.fill('Unité', ['DPM – DDTM 14'])
    cy.wait('@getMissionsForCurrentYear')
    cy.getDataCy('missions-filter-tags').find('.Component-SingleTag > span').contains('Unité DPM – DDTM 14')
    cy.getDataCy('mission-row').each(row => {
      cy.wrap(row).should('contain', 'DPM – DDTM 14')
    })
    cy.fill('Administration', ['DREAL / DEAL'])
    cy.getDataCy('missions-filter-tags').find('.Component-SingleTag > span').contains('Admin. DREAL / DEAL')
    cy.getDataCy('missions-filter-tags')
      .find('.Component-SingleTag > span')
      .should('not.contain', 'Unité DPM - DDTM 14')
    cy.getDataCy('mission-row').each(row => {
      cy.wrap(row).should('contain', 'DREAL Pays-de-La-Loire')
    })

    // selected an administration corresponding to the selected unit
    cy.fill('Administration', undefined)
    cy.fill('Unité', ['DREAL Pays-de-La-Loire'])
    cy.getDataCy('missions-filter-tags').find('.Component-SingleTag > span').contains('Unité DREAL Pays-de-La-Loire')
    cy.getDataCy('mission-row').each(row => {
      cy.wrap(row).should('contain', 'DREAL Pays-de-La-Loire')
    })
    cy.fill('Administration', ['DREAL / DEAL'])
    cy.getDataCy('missions-filter-tags').find('.Component-SingleTag > span').contains('Admin. DREAL / DEAL')
    cy.getDataCy('missions-filter-tags').find('.Component-SingleTag > span').contains('Unité DREAL Pays-de-La-Loire')
    cy.getDataCy('mission-row').each(row => {
      cy.wrap(row).should('contain', 'DREAL Pays-de-La-Loire')
    })
  })

  it('Should filter missions by types', () => {
    const currentYear = encodeURIComponent(customDayjs().utc().startOf('year').toISOString())
    cy.intercept('GET', `/bff/v1/missions?&startedAfterDateTime=${currentYear}&missionTypes=SEA`).as(
      'getMissionsForCurrentYear'
    )
    cy.fill('Période', 'Année en cours')
    cy.fill('Type de mission', ['Mer'])
    cy.wait('@getMissionsForCurrentYear')

    // We can't wait because cy.fill ends after the request
    // cy.wait('@getMissionsByType')

    cy.getDataCy('mission-row').should('have.length.to.be.greaterThan', 0)
    cy.getDataCy('mission-row').each(row => {
      cy.wrap(row).within(() => {
        cy.getDataCy('mission-type-Mer').should('exist')
      })
    })
  })

  it('Should filter missions by sea fronts', () => {
    const currentYear = encodeURIComponent(customDayjs().utc().startOf('year').toISOString())
    cy.intercept('GET', `/bff/v1/missions?&startedAfterDateTime=${currentYear}&seaFronts=MED`).as(
      'getMissionsForCurrentYear'
    )
    cy.fill('Période', 'Année en cours')
    cy.fill('Façade', ['MED'])
    cy.wait('@getMissionsForCurrentYear')

    // We can't wait because cy.fill ends after the request
    // cy.wait('@getMissionsBySeaFront')

    cy.getDataCy('mission-row').should('have.length.to.be.greaterThan', 0)
    cy.getDataCy('mission-row').each(row => {
      cy.wrap(row).should('contain', 'MED')
    })
  })

  it('Should filter missions by status', () => {
    const date = encodeURIComponent(customDayjs().utc().startOf('day').toISOString())
    cy.intercept('GET', `/bff/v1/missions?&startedAfterDateTime=${date}&missionStatus=PENDING`).as(
      'getMissionsByStatus'
    )

    cy.fill('Statut de mission', ['En cours'])

    // We can't wait because cy.fill ends after the request
    // cy.wait('@getMissionsByStatus')

    cy.getDataCy('mission-row').should('have.length.to.be.greaterThan', 0)
    cy.getDataCy('mission-row').each(row => {
      cy.wrap(row).should('contain', 'En cours')
    })
  })

  it('Should filter missions by themes', () => {
    const currentYear = encodeURIComponent(customDayjs().utc().startOf('year').toISOString())
    cy.intercept('GET', `/bff/v1/missions?&startedAfterDateTime=${currentYear}`).as('getMissionsForCurrentYear')
    cy.fill('Période', 'Année en cours')
    cy.fill('Thématique', ['Mouillage individuel'])
    cy.wait('@getMissionsForCurrentYear')

    cy.getDataCy('mission-row').should('have.length.to.be.greaterThan', 0)
    cy.getDataCy('mission-row').each(row => {
      cy.wrap(row).click()
      cy.getDataCy('mission-row-expanded').should('contain', 'Mouillage individuel')
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
    cy.wait('@getMissionsByPeriod')

    cy.getDataCy('mission-theme-filter').click()
    cy.get('#theme-listbox > div').should('have.length', 19)

    cy.wait(200)

    // on two years
    const secondExpectedStartDate = getUtcDateInMultipleFormats('2023-01-01T00:00:00.000Z')
    const secondExpectedEndDate = getUtcDateInMultipleFormats('2024-03-03T23:59:59.000Z')

    cy.intercept(
      'GET',
      `/bff/v1/missions?&startedAfterDateTime=${secondExpectedStartDate.asEncodedStringUtcDate}&startedBeforeDateTime=${secondExpectedEndDate.asEncodedStringUtcDate}`
    ).as('getMissionsBySecondPeriod')

    cy.fill('Période spécifique', [secondExpectedStartDate.asDatePickerDate, secondExpectedEndDate.asDatePickerDate])
    cy.wait('@getMissionsBySecondPeriod')

    cy.getDataCy('mission-theme-filter').click()
    cy.get('#theme-listbox > div').should('have.length', 34)
  })

  it('Should filter missions with env actions', () => {
    cy.fill('Période', 'Année en cours')
    cy.fill('Missions avec actions env.', true)

    cy.getDataCy('edit-mission-53').should('exist')
    cy.getDataCy('edit-mission-38').should('exist')
    cy.getDataCy('edit-mission-22').should('not.exist')
    cy.getDataCy('edit-mission-43').should('not.exist')
  })

  it('Should filter missions by search query', () => {
    cy.fill('Période', 'Année en cours')
    cy.fill('Rechercher dans un contrôle (navire, personne...)', 'BALTIK')

    cy.getDataCy('mission-row').should('have.length', 1)
    cy.getDataCy('edit-mission-34').click({ force: true })

    cy.getDataCy('action-card').eq(1).click()
    cy.clickButton('Ok, je vérifie')
    cy.clickButton("Modifier l'infraction")
    cy.getDataCy('infraction-form-registrationNumber').should('have.value', 'BALTIK')
    cy.getDataCy('quit-edit-mission').click()
  })
})
