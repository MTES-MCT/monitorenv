import { FAKE_MAPBOX_RESPONSE } from '../../constants'

describe('Edit Vigilance Area', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)

    cy.viewport(1580, 1024)
  })
  it('Should successfully update a vigilance area', () => {
    cy.visit('/#@-192242.97,5819420.73,9.93')
    cy.wait(500)

    cy.intercept('PUT', '/bff/v1/vigilance_areas/6').as('editVigilanceArea')
    cy.get('#root').click(850, 350)
    cy.wait(250)

    cy.getDataCy('vigilance-area-title').should('have.text', 'Zone de vigilance 6')
    cy.clickButton('Editer')

    cy.clickButton('Ajouter un lien utile')
    cy.fill('Texte à afficher', 'Ceci est un lien en rapport avec la zone de vigilance')
    cy.fill('Url du lien', 'https://www.google.com')
    cy.clickButton('Valider')

    cy.getDataCy('vigilance-area-link-1').should('have.text', 'Ceci est un lien en rapport avec la zone de vigilance')

    cy.clickButton('Enregistrer')
    cy.wait('@editVigilanceArea').then(({ request, response }) => {
      const updatedVigilanceArea = request.body
      expect(response?.statusCode).equal(200)

      expect(updatedVigilanceArea.links.length).equal(2)
      expect(updatedVigilanceArea.links[1].linkText).equal('Ceci est un lien en rapport avec la zone de vigilance')
      expect(updatedVigilanceArea.links[1].linkUrl).equal('https://www.google.com')

      // Reset data
      cy.clickButton('Editer')
      cy.clickButton('delete-vigilance-area-link')
      cy.clickButton('Enregistrer')
    })
  })

  it('Should successfully add regulatory area to a vigilance area and consult them', () => {
    cy.visit('/#@-668012.81,6169323.28,8.44')
    cy.wait(500)

    cy.intercept('PUT', '/bff/v1/vigilance_areas/7').as('editVigilanceArea')
    cy.get('#root').click(970, 500)
    cy.wait(250)

    cy.clickButton('Editer')

    cy.clickButton('Ajouter une réglementation en lien')
    cy.clickButton('Arbre des couches')
    cy.getDataCy('my-amp-layers-zones').should('not.exist')
    cy.clickButton('Filtrer par type de zones')
    cy.fill('Thématique réglementaire', ['AMP', 'Dragage', 'Mixte'])
    cy.wait(250)
    cy.get('#root').click(1030, 490)

    cy.clickButton("Ajouter la zone réglementaire Partie marine (plus basses eaux) RNN d'Iroise")
    cy.clickButton('Ajouter la zone réglementaire Article 1')
    cy.getDataCy('regulatory-area-item').should('have.length', 2)

    cy.clickButton('Valider la sélection')
    cy.clickButton('Enregistrer')

    cy.wait('@editVigilanceArea').then(({ request, response }) => {
      const updatedVigilanceArea = request.body
      expect(response?.statusCode).equal(200)

      expect(updatedVigilanceArea.linkedRegulatoryAreas[0]).equal(425)
      expect(updatedVigilanceArea.linkedRegulatoryAreas[1]).equal(134)

      cy.clickButton('Filtrer par type de zones')
      cy.getDataCy('my-regulatory-layers').click({ force: true })
      cy.wait(250)
      // add regulatory area to "Mes zones réglementaires"
      cy.clickButton('Ajouter la zone à Mes zones réglementaires')
      // check if the regulatory area is added
      cy.getDataCy('my-regulatory-group').contains('RNN Iroise').click({ force: true })
      cy.getDataCy("my-regulatory-Partie marine (plus basses eaux) RNN d'Iroise").should('exist')

      // Reset data
      cy.clickButton('Editer')
      cy.clickButton('vigilance-area-delete-regulatory-area-425')
      cy.clickButton('vigilance-area-delete-regulatory-area-134')

      cy.clickButton('Enregistrer')
    })
  })
})
