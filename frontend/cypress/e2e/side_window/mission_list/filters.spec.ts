import { customDayjs } from '../../utils/customDayjs'
import { getUtcDateInMultipleFormats } from '../../utils/getUtcDateInMultipleFormats'

context('Side Window > Mission List > Filter Bar', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)

    cy.visit(`/side_window`).wait(1000)
  })

  it('Should filter missions for the current day', () => {
    const currentDay = encodeURIComponent(customDayjs().utc().startOf('day').toISOString())
    cy.intercept('GET', `/bff/v1/missions?&startedAfterDateTime=${currentDay}*`).as('getMissions')

    cy.fill('Période', 'Aujourd’hui')
    cy.wait('@getMissions')

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
  })

  it('Should filter missions for the current month', () => {
    const currentDay = encodeURIComponent(customDayjs().utc().startOf('day').utc().subtract(30, 'day').toISOString())
    cy.intercept('GET', `/bff/v1/missions?&startedAfterDateTime=${currentDay}*`).as('getMissions')

    cy.fill('Période', 'Un mois')
    cy.wait('@getMissions')

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
  })

  it('Should filter missions for the custom date range', () => {
    const expectedStartDate = getUtcDateInMultipleFormats('2023-05-01T00:00:00.000Z')
    const expectedEndDate = getUtcDateInMultipleFormats('2023-05-31T23:59:59.000Z')
    cy.intercept(
      'GET',
      `/bff/v1/missions?&startedAfterDateTime=${expectedStartDate.utcDateAsEncodedString}&startedBeforeDateTime=${expectedEndDate.utcDateAsEncodedString}*`
    ).as('getMissions')

    cy.fill('Période', 'Période spécifique')
    cy.fill('Période spécifique', [expectedStartDate.utcDateTuple, expectedEndDate.utcDateTuple])
    cy.wait('@getMissions')
  })

  it('Should filter missions by source', () => {
    cy.intercept('GET', `*missionSource=MONITORENV*`).as('getMissions')
    cy.fill('Origine', 'CACEM')
    cy.wait('@getMissions')

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'CACEM')
    })

    cy.fill('Administration', undefined)
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
    cy.fill('Administration', undefined)
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

    cy.fill('Unité', undefined)
  })

  it('Should filter missions by types', () => {
    cy.fill('Type de mission', ['Mer'])

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'Mer')
    })

    cy.fill('Type de mission', undefined)
  })

  it('Should filter missions by sea fronts', () => {
    cy.fill('Facade', ['MED'])

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'MED')
    })

    cy.fill('Facade', undefined)
  })

  it('Should filter missions by statuses', () => {
    cy.fill('Statut', ['En cours'])

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'En cours')
    })

    cy.fill('Statut', undefined)
  })

  it('Should filter missions by themes', () => {
    cy.fill('Thématique', ['Police des activités de cultures marines'])

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'Police des activités de cultures marines')
    })

    cy.fill('Thématique', undefined)
  })
})
