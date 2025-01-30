import { getFutureDate } from '../../utils/getFutureDate'
import { getUtcDateInMultipleFormats } from '../../utils/getUtcDateInMultipleFormats'

describe('Create Vigilance Area', () => {
  beforeEach(() => {
    cy.viewport(1580, 1024)
    cy.visit('/#@-1049081.65,5909154.00,6.00')
    cy.wait(500)

    cy.intercept('PUT', '/bff/v1/vigilance_areas').as('createVigilanceArea')
    cy.clickButton('Arbre des couches')
    cy.getDataCy('my-vigilance-areas-layers').click()
    cy.clickButton('Créer une zone de vigilance')
  })

  it('Should delete a vigilance area saved in "My vigilance areas"', () => {
    // Fill in the form fields
    cy.fill('Nom de la zone de vigilance', 'Ma zone de vigilance à supprimer')

    const { asDatePickerDateTime } = getUtcDateInMultipleFormats()
    const vigilanceAreaEndDate = getFutureDate(5, 'day')
    cy.fill('Période de validité', [asDatePickerDateTime, vigilanceAreaEndDate])
    cy.fill('Récurrence', 'Aucune')

    // Submit the form
    cy.clickButton('Enregistrer')
    cy.wait('@createVigilanceArea').then(() => {
      cy.clickButton('Fermer la zone de vigilance')
      cy.clickButton('Filtrer par type de zones')
      cy.fill('Période de vigilance', 'En ce moment')
      // cy.getDataCy('vigilance-area-results-list-button').contains('2 résultats').click()
      cy.getDataCy('vigilance-area-result-zone').contains('Ma zone de vigilance à supprimer')
      cy.clickButton('Sélectionner la zone')

      cy.wait(250)
      cy.getDataCy('my-vigilance-areas-layers').click({ force: true })
      cy.clickButton('Effacer les résultats de la recherche')
      cy.getDataCy('my-vigilance-areas-layers').click()
      cy.clickButton('Afficher la zone de vigilance')

      cy.get('span[title="Ma zone de vigilance à supprimer"]')
      cy.clickButton('Supprimer')
      cy.clickButton('Confirmer la suppression')
    })
  })
})
