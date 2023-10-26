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
    const currentDay = encodeURIComponent(customDayjs().utc().subtract(1, 'month').startOf('day').toISOString())
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
  })

  it('Should filter missions by administrations', () => {
    cy.getDataCy('select-administration-filter').click().wait(100)
    cy.get('.rs-picker-search-bar-input').type('DDTM').wait(100)
    cy.get('[data-key="DDTM"]').click().wait(100).clickOutside()

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'DDTM')
    })
  })

  it('Should filter missions by units', () => {
    cy.getDataCy('select-units-filter').click().wait(100)
    cy.get('.rs-picker-search-bar-input').type('BSN').wait(100)
    cy.get('[data-key="10015"]').click().wait(100).clickOutside()

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'BSN Ste Maxime')
    })
  })

  it('Should filter missions by types', () => {
    cy.getDataCy('select-types-filter').click().wait(100)
    cy.get('[data-key="SEA"]').click().wait(100).clickOutside()

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'Mer')
    })
  })

  it('Should filter missions by sea fronts', () => {
    cy.getDataCy('select-seaFronts-filter').click().wait(100)
    cy.get('[data-key="MED"]').click().wait(100).clickOutside()

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'MED')
    })
  })

  it('Should filter missions by statuses', () => {
    cy.getDataCy('select-statuses-filter').click().wait(100)
    cy.get('[data-key="PENDING"]').click().wait(100).clickOutside()

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'En cours')
    })
  })

  it('Should filter missions by themes', () => {
    cy.getDataCy('select-theme-filter').click().wait(100)
    cy.get('.rs-picker-search-bar-input').type('Police').wait(100)
    cy.get('[data-key="Police des activités de cultures marines"]').click().wait(100).clickOutside()

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'Police des activités de cultures marines')
    })
  })
})
