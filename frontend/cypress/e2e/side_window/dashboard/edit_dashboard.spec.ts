import { getUtcDateInMultipleFormats } from '../../utils/getUtcDateInMultipleFormats'
import { visitSideWindow } from '../../utils/visitSideWindow'

context('Side Window > Dashboard > Edit Dashboard', () => {
  beforeEach(() => {
    cy.intercept('GET', '/bff/v1/dashboards').as('getDashboards')
    cy.viewport(1280, 1024)
    visitSideWindow()
    cy.clickButton('Tableaux de bord')
    cy.wait('@getDashboards')
  })

  it('Should edit a dashboard from the list view', () => {
    const id = 'e2a7d0ae-55ff-4fd9-8a6d-88b92d2b1a42'
    cy.getDataCy(`edit-dashboard-${id}`).click({ force: true })

    cy.intercept('GET', `/bff/v1/dashboards/${id}`).as('editDashboard')

    // Tab should be visible
    cy.getDataCy('dashboard-1').contains('Dashboard 2')

    // Edit the dashboard
    cy.get('h2').contains('Zones de vigilance').click()
    cy.wait(250)
    cy.getDataCy('dashboard-vigilance-area-zone-check-8').click()

    cy.get('h2').contains('Unités').click()
    cy.wait(250)
    cy.getDataCy('dashboard-control-unit-selected-10023').click()

    cy.get('h2').contains('Pièces jointes').click({ force: true })
    cy.wait(250)
    cy.clickButton('Ajouter un lien utile')
    cy.fill('Texte à afficher', 'Ceci est un lien en rapport avec le tableau de bord')
    cy.fill('Url du lien', 'https://www.google.com')

    cy.fixture('image.png', null).then(fileContent => {
      cy.get('input[type=file]').selectFile(
        {
          contents: Cypress.Buffer.from(fileContent),
          fileName: 'image.png',
          mimeType: 'image/png'
        },
        {
          action: 'select',
          force: true,
          log: true
        }
      )
    })

    cy.clickButton('Valider')

    cy.clickButton('Prévisualiser la sélection')

    cy.intercept('PUT', `/bff/v1/dashboards`).as('saveDashboard')

    cy.clickButton('Enregistrer le tableau', { withoutScroll: true })

    cy.wait('@saveDashboard').then(interception => {
      if (!interception.response) {
        assert.fail('`interception.response` is undefined.')
      }
      const bodyWithoutImageContent = {
        ...interception.request.body,
        images: interception.request.body.images.map(({ content, ...rest }) => rest)
      }

      assert.deepInclude(bodyWithoutImageContent, {
        controlUnitIds: [10000, 10023],
        id,
        images: [{ mimeType: 'image/png', name: 'image.png', size: 396656 }],
        links: [{ linkText: 'Ceci est un lien en rapport avec le tableau de bord', linkUrl: 'https://www.google.com' }],
        vigilanceAreaIds: [9, 8]
      })
    })

    // Undo modification
    cy.get('h2').contains('Zones de vigilance').click()
    cy.wait(250)
    cy.getDataCy('dashboard-vigilance-area-zone-check-8').click()

    cy.get('h2').contains('Unités').click()
    cy.wait(250)
    cy.getDataCy('dashboard-control-unit-selected-10023').click()

    cy.clickButton('Enregistrer le tableau')

    // close dashboard
    cy.clickButton('Fermer Dashboard 2')
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

    cy.fill('Période de vigilance', 'Période spécifique')
    const { asDatePickerDate: expectedStartDate } = getUtcDateInMultipleFormats('2024/09/01')
    const { asDatePickerDate: expectedEndDate } = getUtcDateInMultipleFormats('2024/09/02')

    cy.fill('Période spécifique', [expectedStartDate, expectedEndDate])
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

  it('Should select/deselect all in each bloc', () => {
    const id = 'e1e99b92-1e61-4f9f-9cbf-8cfae2395d41'
    cy.getDataCy(`edit-dashboard-${id}`).click({ force: true })

    cy.intercept('GET', `/bff/v1/dashboards/${id}`).as('editDashboard')

    // Tab should be visible
    cy.getDataCy('dashboard-1').contains('Dashboard 1')

    cy.wait(250)

    // from partially selection to fully selected
    cy.get('h2').contains('Zones réglementaires').parent().clickButton('Tout sélectionner', { withoutScroll: true })
    // no button if there is no area
    cy.get('h2').contains('Zones AMP').parent().get('Tout sélectionner').should('not.exist')
    cy.get('h2').contains('Zones de vigilance').parent().clickButton('Tout désélectionner', { withoutScroll: true })
    cy.getDataCy('accordion-reportings-toggle').click()
    cy.fill('Type de signalement', undefined)
    cy.get('h2').contains('Signalements').parent().clickButton('Tout sélectionner', { withoutScroll: true })

    cy.clickButton('Prévisualiser la sélection', { withoutScroll: true })
    cy.wait(250)
    // because result list have a separator so we need to multiply the results by 2
    cy.getDataCy('dashboard-selected-regulatory-result-group').should('have.length', 9)
    cy.getDataCy('dashboard-selected-amp-result-group').should('not.exist')
    cy.get('[data-cy^="dashboard-selected-vigilance-areas-zone-"]').should('not.exist')
    cy.get('[data-cy^="dashboard-selected-reporting-"]').should('have.length', 3)
  })
})
