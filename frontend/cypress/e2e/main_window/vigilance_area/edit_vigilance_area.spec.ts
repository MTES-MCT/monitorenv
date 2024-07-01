import { FAKE_MAPBOX_RESPONSE } from '../../constants'

describe('Edit Vigilance Area', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)

    cy.viewport(1580, 1024)
    cy.visit('/#@-192242.97,5819420.73,9.93')
    cy.wait(500)
  })
  it('Should successfully update a vigilance area', () => {
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
      cy.get('#root').click(850, 350)
      cy.wait(250)
      cy.clickButton('Editer')
      cy.clickButton('delete-vigilance-area-link')
      cy.clickButton('Enregistrer')
    })
  })
})
