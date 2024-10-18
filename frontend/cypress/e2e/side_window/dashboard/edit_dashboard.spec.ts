import { visitSideWindow } from '../../utils/visitSideWindow'

context('Side Window > Dashboard > Edit Dashboard', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    visitSideWindow()
    cy.clickButton('Tableaux de bord')
    cy.intercept('GET', '/bff/v1/dashboards').as('getDashboards')
  })

  it('Should edit a dashboard from the list view', () => {
    const id = 'e2a7d0ae-55ff-4fd9-8a6d-88b92d2b1a42'
    cy.getDataCy(`edit-dashboard-${id}`).click({ force: true })

    cy.intercept('GET', `/bff/v1/dashboards/${id}`).as('editDashboard')

    // Tab should be bisible
    cy.getDataCy('dashboard-1').contains('Dashboard 2')

    // Edit the dashboard
    cy.get('h2').contains('Zones de vigilance').click()
    cy.wait(250)
    cy.getDataCy('dashboard-vigilance-area-zone-check').eq(1).click()

    cy.get('h2').contains('Unités').click()
    cy.wait(250)
    cy.getDataCy('dashboard-control-unit-selected').first().click()

    cy.clickButton('Prévisualiser la sélection')

    cy.intercept('PUT', `/bff/v1/dashboards`).as('saveDashboard')

    cy.clickButton('Enregistrer le tableau')

    cy.wait('@saveDashboard').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }

      assert.deepInclude(interception.request.body, {
        controlUnits: [10000, 10023],
        id,
        vigilanceAreas: [9, 8]
      })
    })

    // close dashboard
    cy.get('[data-cy="dashboard-1"] > svg').first().click({ force: true }).wait(250)
  })

  it('Should filter data in dashboard and preview selection', () => {
    const id = 'e1e99b92-1e61-4f9f-9cbf-8cfae2395d41'
    cy.getDataCy(`edit-dashboard-${id}`).click({ force: true })

    cy.intercept('GET', `/bff/v1/dashboards/${id}`).as('editDashboard')

    // Tab should be visible
    cy.getDataCy('dashboard-1').contains('Dashboard 1')

    cy.wait(250)

    // Filter
    cy.fill('Thématique réglementaire', ['Mixte'])
    cy.get('h2').contains('Zones réglementaires').click()
    cy.wait(250)
    // because result list have a separator so we need to multiply the results by 2
    cy.getDataCy('dashboard-regulatory-areas-list').children().should('have.length', 4)
    cy.getDataCy('dashboard-filter-tags').find('.Component-SingleTag > span').contains('Mixte')

    cy.fill('Période de vigilance', 'En ce moment')
    cy.get('h2').contains('Zones de vigilance').click()
    cy.wait(250)
    cy.getDataCy('dashboard-vigilance-areas-list').children().should('have.length', 0)

    cy.clickButton('Prévisualiser la sélection')

    // Selected regulatoryAreas should be visible
    cy.getDataCy('dashboard-selected-regulatory-result-group')
      .first()
      .contains('Interdiction VNM Molene')
      .should('be.visible')
    cy.getDataCy('dashboard-selected-regulatory-result-group').contains('RNN Iroise').should('be.visible')
    cy.getDataCy('dashboard-selected-regulatory-result-group')
      .contains('Mouillage Conquet Ile de bannec')
      .should('be.visible')

    // Selected vigilanceAreas should be visible
    cy.getDataCy('dashboard-selected-vigilance-area-zone-Zone de vigilance 7').should('be.visible')

    // Selected reportings should be visible
    cy.getDataCy('dashboard-selected-reporting-1').contains('Signalement 23-00001').should('be.visible')
    cy.getDataCy('dashboard-selected-reporting-2').contains('Signalement 23-00002').should('be.visible')

    // Selected controlUnits should be visible
    cy.getDataCy('dashboard-control-unit-accordion-10002').contains('DML 2A - DDTM').should('be.visible')
  })
})