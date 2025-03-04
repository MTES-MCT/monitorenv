import { FAKE_MAPBOX_RESPONSE } from '../../constants'

describe('Edit Vigilance Area', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)
    cy.intercept('GET', '/bff/v1/amps').as('getAmps')
    cy.intercept('GET', '/bff/v1/regulatory').as('getRegulatoryAreas')
    cy.intercept('GET', '/bff/v1/vigilance_areas').as('getVigilanceAreas')

    cy.viewport(1580, 1024)
  })
  it('Should successfully update a vigilance area', () => {
    cy.visit('/#@-192242.97,5819420.73,9.93')
    cy.wait(['@getAmps', '@getRegulatoryAreas', '@getVigilanceAreas'])
    cy.clickButton('Arbre des couches')
    cy.clickButton('Définir la zone de recherche et afficher les tracés')

    cy.intercept('PUT', '/bff/v1/vigilance_areas/6').as('editVigilanceArea')
    cy.wait(500).get('#root').click(850, 350)

    cy.getDataCy('vigilance-area-title').should('have.text', 'Zone de vigilance 6')
    cy.clickButton('Editer')

    cy.clickButton('Ajouter un lien utile')
    cy.fill('Texte à afficher', 'Ceci est un lien en rapport avec la zone de vigilance')
    cy.fill('Url du lien', 'https://www.google.com')
    cy.clickButton('Valider')

    cy.getDataCy('link-1').should('have.text', 'Ceci est un lien en rapport avec la zone de vigilance')

    cy.clickButton('Enregistrer')
    cy.wait('@editVigilanceArea').then(({ request, response }) => {
      const updatedVigilanceArea = request.body
      expect(response?.statusCode).equal(200)

      expect(updatedVigilanceArea.links.length).equal(2)
      expect(updatedVigilanceArea.links[1].linkText).equal('Ceci est un lien en rapport avec la zone de vigilance')
      expect(updatedVigilanceArea.links[1].linkUrl).equal('https://www.google.com')

      // Reset data
      cy.clickButton('Editer')
      cy.clickButton('Supprimer ce lien')
      cy.clickButton('Enregistrer')
    })
  })

  it('Should successfully add regulatory area to a vigilance area and consult them', () => {
    cy.visit('/#@-668012.81,6169323.28,8.44')
    cy.wait(['@getAmps', '@getRegulatoryAreas', '@getVigilanceAreas'])
    cy.clickButton('Arbre des couches')
    cy.clickButton('Définir la zone de recherche et afficher les tracés')

    cy.intercept('PUT', '/bff/v1/vigilance_areas/7').as('editVigilanceArea')
    cy.wait(500).get('#root').click(970, 500)

    cy.clickButton('Editer')

    cy.clickButton('Ajouter une réglementation en lien')
    cy.getDataCy('my-amp-layers-zones').should('not.exist')
    cy.clickButton('Filtrer par type de zones')
    cy.fill('Thématique réglementaire', ['AMP', 'Dragage', 'Mixte'])
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
      // add regulatory area to "Mes zones réglementaires"
      cy.clickButton('Ajouter la zone à Mes zones réglementaires')
      // check if the regulatory area is added
      cy.getDataCy('regulatory-layer-topic').contains('Interdiction VNM Molene').click({ force: true })
      cy.getDataCy('my-zone-Article 1').should('exist')

      // Reset data
      cy.clickButton('Editer')
      cy.clickButton('vigilance-area-delete-regulatory-area-425')
      cy.clickButton('vigilance-area-delete-regulatory-area-134')

      cy.clickButton('Enregistrer')
    })
  })

  it('Should successfully add AMP to a vigilance area and consult them', () => {
    cy.visit('/#@-181811.71,5844094.04,9.31')
    cy.wait(['@getAmps', '@getRegulatoryAreas', '@getVigilanceAreas'])

    cy.clickButton('Arbre des couches')
    cy.clickButton('Définir la zone de recherche et afficher les tracés')

    cy.intercept('PUT', '/bff/v1/vigilance_areas/1').as('editVigilanceArea')
    cy.wait(500).get('#root').click(800, 630)

    cy.clickButton('Editer')

    cy.clickButton('Ajouter une AMP en lien')
    cy.getDataCy('my-regulatory-layers').should('not.exist')
    cy.clickButton('Filtrer par type de zones')
    cy.fill("Type d'AMP", ['Natura 2000'])
    cy.get('#root').click(970, 840)
    cy.clickButton("Ajouter l'AMP Natura 2000")
    cy.get('#root').click(720, 400)
    cy.clickButton("Ajouter l'AMP Natura 2000").first()
    cy.getDataCy('amp-item').should('have.length', 2)

    cy.clickButton('Valider la sélection')
    cy.clickButton('Enregistrer')

    cy.wait('@editVigilanceArea').then(({ request, response }) => {
      const updatedVigilanceArea = request.body
      expect(response?.statusCode).equal(200)

      expect(updatedVigilanceArea.linkedAMPs[0]).equal(12)
      expect(updatedVigilanceArea.linkedAMPs[1]).equal(6)

      cy.clickButton('Filtrer par type de zones')
      cy.getDataCy('my-amp-layers-zones').click({ force: true })
      // add AMP to "Mes AMP"
      cy.clickButton('Ajouter la zone à Mes AMP').first()
      // check if the AMP is added
      cy.getDataCy('amp-layer-topic').contains("dunes, forêt et marais d'Olonne").click({ force: true })
      cy.getDataCy('my-zone-Natura 2000').should('exist')

      // Reset data
      cy.clickButton('Editer')
      cy.clickButton('vigilance-area-delete-amp-12')
      cy.clickButton('vigilance-area-delete-amp-6')

      cy.clickButton('Enregistrer')
    })
  })
  it('Should edit the vigilance area and no longer see it in the list of draft vigilance areas', () => {
    cy.visit('/')
    cy.wait(['@getAmps', '@getRegulatoryAreas', '@getVigilanceAreas'])

    cy.clickButton('Arbre des couches')
    cy.getDataCy('my-vigilance-areas-layers').click()
    cy.getDataCy('vigilance-area-zone-Zone de vigilance 5').should('be.visible')
    cy.clickButton('Afficher la zone de vigilance')
    cy.clickButton('Publier')
    cy.getDataCy('vigilance-area-zone-Zone de vigilance 5').should('not.exist')
  })
})
