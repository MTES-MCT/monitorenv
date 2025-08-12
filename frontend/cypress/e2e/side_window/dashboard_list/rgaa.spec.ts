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
    // @ts-ignore
    cy.checkA11y(null, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa'] // RGAA s’appuie sur WCAG 2.1 A et AA
      }
    })
  })
})
