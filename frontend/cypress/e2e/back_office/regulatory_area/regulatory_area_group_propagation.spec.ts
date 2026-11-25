import { createRegulatoryAreaGroup } from '../../utils/createRegulatoryAreaGroup'

const GROUP_RESUME = 'Résumé défini au niveau du groupe'
const GROUP_AUTHORIZATION_PERIODS = 'Autorisé du 1er juin au 30 septembre'
const AREA_RESUME = 'Résumé propre à la zone réglementaire'

/**
 * Creates a group propagating RESUME and AUTHORIZATION_PERIODS to its regulatory areas,
 * then opens the form of a new regulatory area in this group.
 */
function createGroupWithPropagatedFieldsAndOpenNewArea(layerName: string, location: string) {
  cy.intercept('PUT', '/bff/v1/regulatory-areas/groups').as('createRegulatoryAreaGroup')
  cy.intercept('GET', '/bff/v1/regulatory-areas/groups/*').as('getRegulatoryAreaGroup')

  cy.clickButton('Créer un groupe de reg.')
  createRegulatoryAreaGroup(layerName, location)

  cy.get('#RESUME').click()
  cy.get('#AUTHORIZATION_PERIODS').click()
  cy.get('textarea[name="resume"]').type(GROUP_RESUME)
  // The textarea is partially covered by the sticky footer
  cy.get('textarea[name="authorizationPeriods"]').type(GROUP_AUTHORIZATION_PERIODS, { force: true })

  cy.clickButton('Créer le groupe')
  cy.wait('@createRegulatoryAreaGroup').then(({ request, response }) => {
    assert.equal(response?.statusCode, 200)

    expect(request.body.propagation.RESUME.enabled).to.equal(true)
    expect(request.body.propagation.AUTHORIZATION_PERIODS.enabled).to.equal(true)
    expect(request.body.resume).to.equal(GROUP_RESUME)
    expect(request.body.authorizationPeriods).to.equal(GROUP_AUTHORIZATION_PERIODS)

    expect(response?.body.group.propagatedFields).to.have.members(['RESUME', 'AUTHORIZATION_PERIODS'])
  })

  // Wait for the saved group to be reloaded, otherwise the form is still considered dirty
  cy.wait('@getRegulatoryAreaGroup')
  cy.contains('button', 'Ajouter une réglementation').should('not.be.disabled')
  cy.clickButton('Ajouter une réglementation')
  cy.url().should('include', '/regulatory_areas/new?groupId=')
}

function fillRequiredAreaFields(geometryId: string, title: string) {
  cy.fill('Titre de la zone réglementaire', title)
  cy.fill('Géométrie', geometryId)
  cy.fill('Façade', 'NAMO')
  cy.fill('Thématiques et sous-thématiques', ['Réglementation de la réserve naturelle'])
  cy.get('#PIRCType').click()
}

context('Back Office > Regulatory Area > Group data propagation', () => {
  beforeEach(() => {
    cy.intercept('GET', `bff/v1/regulatory-areas*`).as('getRegulatoryAreas')
    cy.visit('/backoffice/regulatory_areas')
    cy.wait('@getRegulatoryAreas')
  })

  it('should propagate group fields to a new regulatory area of the group', () => {
    createGroupWithPropagatedFieldsAndOpenNewArea('Groupe propagation', 'Baie de test')

    // Fields propagated by the group are listed, prefilled and read-only
    cy.contains('Éléments par défaut du groupe').should('be.visible')
    cy.get('#RESUME').should('be.checked')
    cy.get('#AUTHORIZATION_PERIODS').should('be.checked')
    cy.get('#PROHIBITION_PERIODS').should('not.exist')

    cy.get('textarea[name="resume"]').should('have.value', GROUP_RESUME).and('have.attr', 'readonly')
    cy.get('textarea[name="authorizationPeriods"]')
      .should('have.value', GROUP_AUTHORIZATION_PERIODS)
      .and('have.attr', 'readonly')

    // Fields not propagated by the group stay editable
    cy.get('textarea[name="prohibitionPeriods"]').should('not.have.attr', 'readonly')

    fillRequiredAreaFields('456', 'Zone héritant du groupe')

    cy.intercept('PUT', '/bff/v1/regulatory-areas').as('createRegulatoryArea')
    cy.clickButton('Créer la réglementation')
    cy.wait('@createRegulatoryArea').then(({ request, response }) => {
      assert.equal(response?.statusCode, 200)

      expect(request.body.inheritedFields).to.have.members(['RESUME', 'AUTHORIZATION_PERIODS'])

      expect(response?.body.inheritedFields).to.have.members(['RESUME', 'AUTHORIZATION_PERIODS'])
      expect(response?.body.resume).to.equal(GROUP_RESUME)
      expect(response?.body.authorizationPeriods).to.equal(GROUP_AUTHORIZATION_PERIODS)
    })

    cy.getDataCy('back-office-banner-stack').contains(
      'La zone réglementaire "Zone héritant du groupe" a bien été enregistrée.'
    )
  })

  it('should keep its own value when a group field is unchecked on the regulatory area', () => {
    createGroupWithPropagatedFieldsAndOpenNewArea('Groupe décochage', 'Baie de test')
    fillRequiredAreaFields('789', 'Zone avec résumé propre')

    cy.intercept('PUT', '/bff/v1/regulatory-areas').as('saveRegulatoryArea')
    cy.clickButton('Créer la réglementation')
    cy.wait('@saveRegulatoryArea')
    cy.url().should('match', /\/regulatory_areas\/\d+$/)

    // Uncheck RESUME on the regulatory area: the field becomes editable
    cy.get('#RESUME').should('be.checked')
    cy.get('textarea[name="resume"]').should('have.attr', 'readonly')
    cy.get('#RESUME').click()
    cy.get('textarea[name="resume"]').should('not.have.attr', 'readonly')
    cy.get('textarea[name="resume"]').clear().type(AREA_RESUME)

    // Other inherited fields are untouched
    cy.get('#AUTHORIZATION_PERIODS').should('be.checked')
    cy.get('textarea[name="authorizationPeriods"]').should('have.attr', 'readonly')

    cy.clickButton('Enregistrer les modifications')
    cy.wait('@saveRegulatoryArea').then(({ request, response }) => {
      assert.equal(response?.statusCode, 200)

      expect(request.body.inheritedFields).to.deep.equal(['AUTHORIZATION_PERIODS'])

      expect(response?.body.inheritedFields).to.deep.equal(['AUTHORIZATION_PERIODS'])
      expect(response?.body.resume).to.equal(AREA_RESUME)
      expect(response?.body.authorizationPeriods).to.equal(GROUP_AUTHORIZATION_PERIODS)
    })

    // Updating the group no longer modifies the regulatory area's own value
    cy.clickButton('Modifier info. du groupe')
    cy.url().should('match', /\/regulatory_area_group\/\d+$/)
    cy.get('textarea[name="resume"]').should('have.value', GROUP_RESUME)
    cy.get('textarea[name="resume"]').clear().type('Nouveau résumé du groupe')
    cy.contains('Les modifications impacteront uniquement les réglementations').should('be.visible')

    cy.intercept('PUT', '/bff/v1/regulatory-areas/groups').as('updateRegulatoryAreaGroup')
    cy.clickButton('Enregistrer les modifications')
    cy.wait('@updateRegulatoryAreaGroup').then(({ response }) => {
      assert.equal(response?.statusCode, 200)

      const area = response?.body.regulatoryAreas.find(({ polyName }) => polyName === 'Zone avec résumé propre')
      expect(area.resume).to.equal(AREA_RESUME)
      expect(area.inheritedFields).to.deep.equal(['AUTHORIZATION_PERIODS'])
    })
  })
})
