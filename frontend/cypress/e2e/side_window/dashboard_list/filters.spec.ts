import { customDayjs } from '@mtes-mct/monitor-ui'

import { getUtcDateInMultipleFormats } from '../../utils/getUtcDateInMultipleFormats'
import { visitSideWindow } from '../../utils/visitSideWindow'

context('Side Window > Dashboard List > Filter Bar', () => {
  beforeEach(() => {
    cy.intercept('GET', '/bff/v1/dashboards').as('getDashboards')
    cy.intercept('GET', '/bff/v1/regulatory').as('getRegulatoryAreas')
    cy.viewport(1280, 1024)
    visitSideWindow()
    cy.clickButton('Tableaux de bord')
    cy.wait(['@getDashboards', '@getRegulatoryAreas'])
  })

  it('Should filter dashboard for today', () => {
    cy.fill('Période de mise à jour', 'Aujourd’hui')

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)

    cy.clickButton('Réinitialiser les filtres')
  })

  it('Should filter dashboard for the last week', () => {
    cy.fill('Période de mise à jour', 'Une semaine')

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)

    cy.clickButton('Réinitialiser les filtres')
  })

  it('Should filter dashboard for the last month', () => {
    cy.fill('Période de mise à jour', 'Un mois')

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
  })

  it('Should filter dashboard for the current year', () => {
    cy.fill('Période de mise à jour', 'Année en cours')

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)

    cy.clickButton('Réinitialiser les filtres')
  })

  it('Should filter dashboards by specific period', () => {
    cy.fill('Période de mise à jour', 'Période spécifique')

    const expectedStartDate = getUtcDateInMultipleFormats('2024-01-01T00:00:00.000Z')
    const expectedEndDate = getUtcDateInMultipleFormats(customDayjs().toISOString())

    cy.fill('Période spécifique de la date de mise à jour', [
      expectedStartDate.asDatePickerDate,
      expectedEndDate.asDatePickerDate
    ])

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)

    cy.clickButton('Réinitialiser les filtres')
  })

  it('Should filter dashboard by sea front', () => {
    cy.wait(200)
    cy.fill('Façade', ['NAMO'])

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'NAMO')
    })

    cy.clickButton('Réinitialiser les filtres')
  })

  it('Should filter dashboard by tags', () => {
    cy.wait(200)
    cy.fill('Tags', ['Mixte'])

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'Mixte')
    })

    cy.clickButton('Réinitialiser les filtres')
  })

  it('Should filter dashboards by units', () => {
    cy.fill('Unité', ['DML'])

    cy.get('.Table-SimpleTable tr').should('have.length.to.be.greaterThan', 0)
    cy.get('.Table-SimpleTable tr').each((row, index) => {
      if (index === 0) {
        return
      }

      cy.wrap(row).should('contain', 'DML 2A (DDTM)')
    })

    cy.clickButton('Réinitialiser les filtres')
  })
})
