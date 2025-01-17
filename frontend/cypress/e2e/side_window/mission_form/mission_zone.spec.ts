import {
  MapInteractionListenerEnum,
  updateMapInteractionListeners
} from 'domain/use_cases/map/updateMapInteractionListeners'

import { setGeometry } from '../../../../src/domain/shared_slices/Draw'
import { getFutureDate } from '../../utils/getFutureDate'

import type { GeoJSON } from '../../../../src/domain/types/GeoJSON'

const dispatch = action => cy.window().its('store').invoke('dispatch', action)

const surveillanceGeometry: GeoJSON.Geometry = {
  coordinates: [
    [
      [
        [-5.445293386230469, 49.204467319852114],
        [-6.05778117919922, 48.85600950618519],
        [-5.67154308105469, 48.29540491855175],
        [-5.010646779785157, 48.68245162584054],
        [-5.445293386230469, 49.204467319852114]
      ]
    ]
  ],
  type: 'MultiPolygon'
}
context('Side Window > Mission Form > Mission zone', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.visit(`/side_window`, {
      onBeforeLoad: () => {
        Cypress.env('CYPRESS_MISSION_FORM_AUTO_SAVE_ENABLED', 'true')
        Cypress.env('CYPRESS_MISSION_FORM_AUTO_UPDATE', 'true')
      }
    })

    // Create mission with surveillance
    cy.clickButton('Ajouter une nouvelle mission')
    const endDate = getFutureDate(7, 'day')
    cy.fill('Date de fin (UTC)', endDate)
    cy.get('[name="missionTypes0"]').click({ force: true })

    cy.fill('Unité 1', 'Cross Etel')
    cy.wait(500)

    // Add a surveillance
    cy.clickButton('Ajouter')
    cy.wait(250)
    cy.clickButton('Ajouter une surveillance')
    cy.clickButton('Ajouter une zone de surveillance')
    dispatch(setGeometry(surveillanceGeometry))
    cy.wait(250)
    cy.getDataCy('surveillance-open-by').type('ABC', { force: true })
    cy.wait(250)
  })

  it('Should add a surveillance and computed mission zone with surveillance zone', () => {
    cy.wait(400)
    cy.intercept('PUT', '/bff/v1/missions/*').as('updateMission')

    cy.getDataCy('mission-zone-computed-from-action').should('exist')

    // Add manual mission zone
    cy.clickButton('Ajouter une zone de mission manuelle')
    cy.wait(200)
    cy.getDataCy('mission-zone-computed-from-action').should('not.exist')
    const geometry: GeoJSON.Geometry = {
      coordinates: [
        [
          [
            [-3.9617884109581034, 47.721266748801554],
            [-3.950968256158881, 47.72820847289114],
            [-3.9463533907207182, 47.718950664687924],
            [-3.9617884109581034, 47.721266748801554]
          ]
        ]
      ],
      type: 'MultiPolygon'
    }
    dispatch(setGeometry(geometry))
    cy.wait(500)
    cy.getDataCy('mission-zone-computed-from-action').should('not.exist')

    // close manually the draw modal
    dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
    cy.wait(200)
    cy.clickButton('Supprimer cette zone de mission')
    cy.wait(500)
    cy.getDataCy('mission-zone-computed-from-action').should('exist')

    // Check geom values
    cy.waitForLastRequest(
      '@updateMission',
      {
        body: {
          envActions: [
            {
              actionType: 'SURVEILLANCE',
              geom: surveillanceGeometry
            }
          ],
          geom: surveillanceGeometry
        }
      },
      5,
      0,
      response => {
        expect(response?.statusCode).equal(200)
        expect(response.body.geom).to.deep.equal(response.body.envActions[0].geom)

        cy.wait(200)
        cy.clickButton('Fermer')
        cy.wait(200)

        // Delete mission
        const id = response.body.id
        cy.getDataCy(`edit-mission-${id}`).click({ force: true })
        cy.clickButton('Supprimer la mission')
        cy.clickButton('Confirmer la suppression')
      }
    )
  })

  it('Should add multiples actions and computed mission zone with the zone or point of the most recent action.', () => {
    cy.wait(400)
    cy.intercept('PUT', '/bff/v1/missions/*').as('updateMission')

    cy.getDataCy('mission-zone-computed-from-action').should('exist')

    // Add control  which is most recent than surveillance
    cy.clickButton('Ajouter')
    cy.clickButton('Ajouter des contrôles')

    const controlEndDate = getFutureDate(5, 'day')
    cy.fill('Date et heure du contrôle (UTC)', controlEndDate)
    cy.clickButton('Ajouter un point de contrôle')
    cy.wait(200)

    const controlGeometry: GeoJSON.Geometry = {
      coordinates: [[-1.84589767, 46.66739394]],
      type: 'MultiPoint'
    }
    dispatch(setGeometry(controlGeometry))
    cy.wait(500)
    // close manually the draw modal
    dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
    cy.wait(500)

    cy.getDataCy('control-open-by').scrollIntoView().type('ABC', { force: true })

    const computedMissionZone: GeoJSON.Geometry = {
      coordinates: [
        [
          [
            [-1.84589767, 46.68538035],
            [-1.84332775, 46.68529371],
            [-1.84078261, 46.68503463],
            [-1.83828678, 46.68460561],
            [-1.83586431, 46.68401078],
            [-1.83353856, 46.68325587],
            [-1.83133194, 46.68234817],
            [-1.82926571, 46.68129642],
            [-1.82735978, 46.68011075],
            [-1.8256325, 46.67880261],
            [-1.82410051, 46.67738458],
            [-1.82277856, 46.67587035],
            [-1.82167936, 46.67427449],
            [-1.82081348, 46.67261238],
            [-1.82018925, 46.67090004],
            [-1.81981266, 46.66915395],
            [-1.8196873, 46.66739095],
            [-1.81981436, 46.665628],
            [-1.82019259, 46.66388209],
            [-1.82081833, 46.66217002],
            [-1.82168553, 46.66050829],
            [-1.82278581, 46.65891288],
            [-1.82410857, 46.65739916],
            [-1.82564105, 46.6559817],
            [-1.8273685, 46.65467413],
            [-1.82927426, 46.65348906],
            [-1.83133999, 46.65243787],
            [-1.83354581, 46.65153068],
            [-1.83587048, 46.65077623],
            [-1.83829162, 46.65018177],
            [-1.84078595, 46.64975302],
            [-1.84332945, 46.64949411],
            [-1.84589767, 46.64940753],
            [-1.84846589, 46.64949411],
            [-1.85100939, 46.64975302],
            [-1.85350372, 46.65018177],
            [-1.85592486, 46.65077623],
            [-1.85824953, 46.65153068],
            [-1.86045535, 46.65243787],
            [-1.86252108, 46.65348906],
            [-1.86442684, 46.65467413],
            [-1.86615429, 46.6559817],
            [-1.86768677, 46.65739916],
            [-1.86900953, 46.65891288],
            [-1.87010981, 46.66050829],
            [-1.87097701, 46.66217002],
            [-1.87160275, 46.66388209],
            [-1.87198098, 46.665628],
            [-1.87210804, 46.66739095],
            [-1.87198268, 46.66915395],
            [-1.87160609, 46.67090004],
            [-1.87098186, 46.67261238],
            [-1.87011598, 46.67427449],
            [-1.86901678, 46.67587035],
            [-1.86769483, 46.67738458],
            [-1.86616284, 46.67880261],
            [-1.86443556, 46.68011075],
            [-1.86252963, 46.68129642],
            [-1.8604634, 46.68234817],
            [-1.85825678, 46.68325587],
            [-1.85593103, 46.68401078],
            [-1.85350856, 46.68460561],
            [-1.85101273, 46.68503463],
            [-1.84846759, 46.68529371],
            [-1.84589767, 46.68538035]
          ]
        ]
      ],
      type: 'MultiPolygon'
    }

    // Check geom values
    cy.waitForLastRequest(
      '@updateMission',
      {
        body: {
          envActions: [
            {
              actionType: 'CONTROL',
              geom: controlGeometry
            }
          ]
        }
      },
      5,
      0,
      response => {
        expect(response?.statusCode).equal(200)
        expect(response.body.geom.coordinates).to.deep.equal(computedMissionZone.coordinates)
        expect(response.body.geom.type).to.deep.equal(computedMissionZone.type)

        cy.wait(200)
        cy.clickButton('Fermer')
        cy.wait(200)

        // Delete mission
        const id = response.body.id
        cy.getDataCy(`edit-mission-${id}`).click({ force: true })
        cy.clickButton('Supprimer la mission')
        cy.clickButton('Confirmer la suppression')
      }
    )
  })
})
