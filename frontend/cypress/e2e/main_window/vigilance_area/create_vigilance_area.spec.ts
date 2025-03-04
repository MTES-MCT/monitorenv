import { VigilanceArea } from '@features/VigilanceArea/types'

import { FAKE_MAPBOX_RESPONSE } from '../../constants'
import { getFutureDate } from '../../utils/getFutureDate'
import { getUtcDateInMultipleFormats } from '../../utils/getUtcDateInMultipleFormats'

const startDate = getFutureDate(7, 'day')
const endDate = getFutureDate(31, 'day')

describe('Create Vigilance Area', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)
    cy.intercept('GET', '/bff/v1/amps').as('getAmps')
    cy.intercept('GET', '/bff/v1/regulatory').as('getRegulatoryAreas')
    cy.intercept('GET', '/bff/v1/vigilance_areas').as('getVigilanceAreas')

    cy.viewport(1580, 1024)
    cy.visit('/')
    cy.wait(['@getAmps', '@getRegulatoryAreas', '@getVigilanceAreas'])

    cy.intercept('PUT', '/bff/v1/vigilance_areas').as('createVigilanceArea')
    cy.clickButton('Arbre des couches')
    cy.getDataCy('my-vigilance-areas-layers').click()
    cy.clickButton('Créer une zone de vigilance')
    // Visibility should be PRIVATE by default
    cy.get('input[name="visibility"][value="PRIVATE"]').should('be.checked')
  })
  it('Should successfully create a vigilance area', () => {
    cy.fill('Nom de la zone de vigilance', 'Nouvelle zone de vigilance')

    cy.fill('Période de validité', [startDate, endDate])

    cy.getDataCy('vigilance-area-ending-condition').should('not.exist')
    cy.fill('Récurrence', 'Toutes les semaines')
    cy.getDataCy('vigilance-area-ending-condition').should('be.visible')
    cy.fill('Fin récurrence', 'Jamais')

    cy.fill('Thématiques', ['AMP'])
    cy.clickOutside()
    cy.fill('Visibilité', 'Publique')
    cy.fill('Commentaire', 'Ceci est un commentaire')
    cy.fill('Créé par', 'ABC')

    cy.clickButton('Définir un tracé pour la zone de vigilance')
    cy.get('#root').click(490, 580)
    cy.wait(250)
    cy.get('#root').click(490, 780)
    cy.wait(250)
    cy.get('#root').click(850, 780)
    cy.wait(250)
    cy.get('#root').click(850, 780)
    cy.get('.baselayer').toMatchImageSnapshot({
      imageConfig: {
        threshold: 0.05,
        thresholdType: 'percent'
      },
      screenshotConfig: {
        clip: { height: 500, width: 250, x: 410, y: 0 }
      }
    })
    cy.clickButton('Valider les tracés')

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

    cy.wait(500)

    // Submit the form
    cy.clickButton('Enregistrer')
    cy.wait('@createVigilanceArea').then(({ request, response }) => {
      const createdVigilanceArea = request.body
      expect(response?.statusCode).equal(200)
      const startDateMonth = startDate[1] < 10 ? `0${startDate[1]}` : startDate[1]
      const startDateDay = startDate[2] < 10 ? `0${startDate[2]}` : startDate[2]
      const endDateMonth = endDate[1] < 10 ? `0${endDate[1]}` : endDate[1]
      const endDateDay = endDate[2] < 10 ? `0${endDate[2]}` : endDate[2]
      // Check the response
      expect(createdVigilanceArea.name).equal('Nouvelle zone de vigilance')
      expect(createdVigilanceArea.startDatePeriod).equal(
        `${startDate[0]}-${startDateMonth}-${startDateDay}T00:00:00.000Z`
      )
      expect(createdVigilanceArea.endDatePeriod).equal(`${endDate[0]}-${endDateMonth}-${endDateDay}T23:59:59.000Z`)
      expect(createdVigilanceArea.frequency).equal(VigilanceArea.Frequency.ALL_WEEKS)
      expect(createdVigilanceArea.endingCondition).equal(VigilanceArea.EndingCondition.NEVER)
      expect(createdVigilanceArea.themes).to.deep.eq(['AMP'])
      expect(createdVigilanceArea.visibility).equal(VigilanceArea.Visibility.PUBLIC)
      expect(createdVigilanceArea.comments).equal('Ceci est un commentaire')
      expect(createdVigilanceArea.createdBy).equal('ABC')
      expect(createdVigilanceArea.isDraft).equal(true)
      expect(createdVigilanceArea.images).to.have.length(1)
      expect(createdVigilanceArea.images[0].name).equal('image.png')
      expect(createdVigilanceArea.images[0].size).equal(396656)
      expect(createdVigilanceArea.images[0].mimeType).equal('image/png')

      cy.getDataCy('banner-stack').should('be.visible')
      cy.getDataCy('banner-stack').contains('La zone de vigilance a bien été créée')

      cy.wait(250)
      cy.get('#root').click(500, 650)
      cy.clickButton('Editer')
      cy.clickButton('Supprimer')
      cy.clickButton('Confirmer la suppression')
      cy.getDataCy('banner-stack').should('be.visible')
      cy.getDataCy('banner-stack').contains('La zone de vigilance a bien été supprimée')
    })
  })

  it('Must be able to manage frequency and display appropriate fields', () => {
    cy.fill('Nom de la zone de vigilance', 'Nouvelle zone de vigilance')
    cy.fill('Période de validité', [startDate, endDate])

    cy.getDataCy('vigilance-area-ending-condition').should('not.exist')
    cy.getDataCy('vigilance-area-ending-occurence-number').should('not.exist')
    cy.getDataCy('vigilance-area-ending-occurence-date').should('not.exist')
    cy.fill('Récurrence', 'Aucune')
    cy.getDataCy('vigilance-area-ending-condition').should('not.exist')
    cy.getDataCy('vigilance-area-ending-occurence-number').should('not.exist')
    cy.getDataCy('vigilance-area-ending-occurence-date').should('not.exist')

    cy.fill('Récurrence', 'Toutes les semaines')
    cy.getDataCy('vigilance-area-ending-condition').should('be.visible')
    cy.fill('Fin récurrence', 'Jamais')
    cy.getDataCy('vigilance-area-ending-occurence-number').should('not.exist')
    cy.getDataCy('vigilance-area-ending-occurence-date').should('not.exist')

    cy.fill('Fin récurrence', 'Le…')
    cy.getDataCy('vigilance-area-ending-occurence-number').should('not.exist')
    cy.getDataCy('vigilance-area-ending-occurence-date').should('be.visible')

    cy.fill('Fin récurrence', 'Après… x fois')
    cy.getDataCy('vigilance-area-ending-occurence-number').should('be.visible')
    cy.getDataCy('vigilance-area-ending-occurence-date').should('not.exist')
  })

  it('Should create an ongoing vigilance area and find it with period filter', () => {
    // Fill in the form fields
    cy.fill('Nom de la zone de vigilance', 'Nouvelle zone de vigilance')

    const { asDatePickerDateTime } = getUtcDateInMultipleFormats()
    const vigilanceAreaEndDate = getFutureDate(5, 'day')
    cy.fill('Période de validité', [asDatePickerDateTime, vigilanceAreaEndDate])

    cy.getDataCy('vigilance-area-ending-condition').should('not.exist')
    cy.fill('Récurrence', 'Toutes les semaines')
    cy.getDataCy('vigilance-area-ending-condition').should('be.visible')
    cy.fill('Fin récurrence', 'Jamais')

    cy.fill('Thématiques', ['AMP'])
    cy.clickOutside()
    cy.fill('Visibilité', 'Publique')
    cy.fill('Commentaire', 'Ceci est un commentaire')
    cy.fill('Créé par', 'ABC')

    cy.clickButton('Définir un tracé pour la zone de vigilance')
    cy.get('#root').click(690, 580)
    cy.wait(250)
    cy.get('#root').click(690, 780)
    cy.wait(250)
    cy.get('#root').click(1050, 780)
    cy.wait(250)
    cy.get('#root').click(1050, 780)
    cy.clickButton('Valider les tracés')

    // Submit the form
    cy.clickButton('Enregistrer')
    cy.wait('@createVigilanceArea').then(() => {
      findAndDeleteVigilanceArea('Nouvelle zone de vigilance')
    })
  })

  it('Should create an ongoing vigilance area without frequency and find it with period filter', () => {
    // Fill in the form fields
    cy.fill('Nom de la zone de vigilance', 'Nouvelle zone de vigilance sans récurrence')

    const { asDatePickerDateTime } = getUtcDateInMultipleFormats()
    const vigilanceAreaEndDate = getFutureDate(5, 'day')
    cy.fill('Période de validité', [asDatePickerDateTime, vigilanceAreaEndDate])
    cy.fill('Récurrence', 'Aucune')

    // Submit the form
    cy.clickButton('Enregistrer')
    cy.wait('@createVigilanceArea').then(() => {
      findAndDeleteVigilanceArea('Nouvelle zone de vigilance sans récurrence')
    })
  })

  it('Should create an ongoing vigilance area without end and find it with period filter', () => {
    // Fill in the form fields
    cy.fill('Nom de la zone de vigilance', 'Nouvelle zone de vigilance infini')

    cy.fill('En tout temps', true)

    // Submit the form
    cy.clickButton('Enregistrer')
    cy.wait('@createVigilanceArea').then(() => {
      findAndDeleteVigilanceArea('Nouvelle zone de vigilance infini')
    })
  })
})

const findAndDeleteVigilanceArea = (name: string) => {
  cy.clickButton('Fermer la zone de vigilance')
  cy.clickButton('Filtrer par type de zones')
  cy.fill('Période de vigilance', 'En ce moment')
  cy.getDataCy('vigilance-area-results-list-button').click()
  cy.getDataCy('vigilance-area-result-zone').contains(name)

  cy.get(`span[title="${name}"]`).click()
  cy.clickButton('Supprimer')
  cy.clickButton('Confirmer la suppression')
}
