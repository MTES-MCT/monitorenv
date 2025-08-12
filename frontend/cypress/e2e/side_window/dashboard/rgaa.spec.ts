import { visitSideWindow } from '../../utils/visitSideWindow'

context('Vérification accessibilité RGAA avec axe-core', () => {
  beforeEach(() => {
    cy.intercept('GET', '/bff/v1/dashboards').as('getDashboards')
    cy.intercept('GET', '/bff/v1/regulatory').as('getRegulatoryAreas')
    cy.viewport(1280, 1024)
    visitSideWindow()
    cy.clickButton('Tableaux de bord')
    cy.wait(['@getDashboards', '@getRegulatoryAreas'])
    cy.injectAxe() // Injecte axe-core dans la page
  })

  it('devrait respecter les critères de base RGAA (axe)', () => {
    const id = 'e2a7d0ae-55ff-4fd9-8a6d-88b92d2b1a42'
    cy.getDataCy(`edit-dashboard-${id}`).click({ force: true })

    cy.intercept('GET', `/bff/v1/dashboards/${id}`).as('editDashboard')

    // Tab should be visible
    cy.getDataCy('dashboard-1').contains('Dashboard 2')
    // @ts-ignore
    cy.checkA11y(null, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa'] // RGAA s’appuie sur WCAG 2.1 A et AA
      }
    })
  })
})
