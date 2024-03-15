import {
  MapInteractionListenerEnum,
  updateMapInteractionListeners
} from 'domain/use_cases/map/updateMapInteractionListeners'

import { setGeometry } from '../../../../src/domain/shared_slices/Draw'

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
context('Side Window > Mission Form > Mission actions', () => {
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
    cy.fill('Date de début (UTC)', [2024, 5, 26, 12, 0])
    cy.fill('Date de fin (UTC)', [2024, 5, 28, 14, 15])
    cy.get('[name="missionTypes0"]').click({ force: true })

    cy.fill('Unité 1', 'Cross Etel')
    cy.getDataCy('control-unit-contact').type('Contact 012345')
    cy.wait(250)
    cy.get('[name="openBy"]').scrollIntoView().type('PCF')
    cy.wait(500)

    // Add a surveillance
    cy.clickButton('Ajouter')
    cy.clickButton('Ajouter une surveillance')
    cy.wait(250)
    cy.clickButton('Ajouter une zone de surveillance')
    cy.wait(250)

    dispatch(setGeometry(surveillanceGeometry))
  })

  it('Should add a surveillance and computed mission zone with surveillance zone', () => {
    cy.wait(400)
    cy.intercept('PUT', '/bff/v1/missions/*').as('createMission')

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
    cy.getDataCy('mission-zone-computed-from-action').should('not.exist')

    // close manually the draw modal
    dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
    cy.wait(500)
    cy.clickButton('Supprimer cette zone de mission')
    cy.wait(500)
    cy.getDataCy('mission-zone-computed-from-action').should('exist')
    cy.wait(500)

    // Check geom values
    cy.waitForLastRequest(
      '@createMission',
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
        expect(response && response.statusCode).equal(200)
        expect(response.body.geom).to.deep.equal(response.body.envActions[0].geom)

        cy.wait(200)
        cy.clickButton('Fermer')
        cy.wait(200)
        cy.fill('Période', 'Période spécifique')
        cy.fill('Période spécifique', [
          [2024, 5, 26],
          [2024, 5, 28]
        ])
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
    cy.intercept('PUT', '/bff/v1/missions/*').as('createMission')

    cy.getDataCy('mission-zone-computed-from-action').should('exist')

    // Add control  which is most recent than surveillance
    cy.clickButton('Ajouter')
    cy.clickButton('Ajouter des contrôles')
    cy.clickButton('Ajouter un point de contrôle')
    cy.wait(200)
    const controlGeometry: GeoJSON.Geometry = {
      coordinates: [[-1.84589767, 46.66739394]],
      type: 'MultiPoint'
    }
    dispatch(setGeometry(controlGeometry))
    // close manually the draw modal
    cy.wait(500)
    dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
    cy.wait(1000)

    const computedMissionZone: GeoJSON.Geometry = {
      coordinates: [
        [
          [
            [-1.84589767, 46.70336675],
            [-1.84075613, 46.70319342],
            [-1.83566421, 46.70267509],
            [-1.83067103, 46.70181677],
            [-1.82582478, 46.70062673],
            [-1.82117219, 46.69911647],
            [-1.81675814, 46.69730054],
            [-1.81262518, 46.69519648],
            [-1.80881315, 46.69282457],
            [-1.80535877, 46.6902077],
            [-1.80229529, 46.68737109],
            [-1.7996522, 46.68434209],
            [-1.79745488, 46.68114992],
            [-1.79572446, 46.67782533],
            [-1.79447751, 46.67440037],
            [-1.79372595, 46.67090804],
            [-1.79347693, 46.66738197],
            [-1.79373275, 46.66385613],
            [-1.79449086, 46.66036448],
            [-1.79574384, 46.65694062],
            [-1.79747955, 46.65361753],
            [-1.7996812, 46.65042717],
            [-1.80232752, 46.64740024],
            [-1.80539299, 46.64456588],
            [-1.80884804, 46.64195134],
            [-1.8126594, 46.63958176],
            [-1.81679037, 46.63747995],
            [-1.82120119, 46.63566609],
            [-1.82584944, 46.63415764],
            [-1.83069041, 46.63296909],
            [-1.83567756, 46.63211188],
            [-1.84076294, 46.63159423],
            [-1.84589767, 46.63142113],
            [-1.8510324, 46.63159423],
            [-1.85611778, 46.63211188],
            [-1.86110493, 46.63296909],
            [-1.8659459, 46.63415764],
            [-1.87059415, 46.63566609],
            [-1.87500497, 46.63747995],
            [-1.87913594, 46.63958176],
            [-1.8829473, 46.64195134],
            [-1.88640235, 46.64456588],
            [-1.88946782, 46.64740024],
            [-1.89211414, 46.65042717],
            [-1.89431579, 46.65361753],
            [-1.8960515, 46.65694062],
            [-1.89730448, 46.66036448],
            [-1.89806259, 46.66385613],
            [-1.89831841, 46.66738197],
            [-1.89806939, 46.67090804],
            [-1.89731783, 46.67440037],
            [-1.89607088, 46.67782533],
            [-1.89434046, 46.68114992],
            [-1.89214314, 46.68434209],
            [-1.88950005, 46.68737109],
            [-1.88643657, 46.6902077],
            [-1.88298219, 46.69282457],
            [-1.87917016, 46.69519648],
            [-1.8750372, 46.69730054],
            [-1.87062315, 46.69911647],
            [-1.86597056, 46.70062673],
            [-1.86112431, 46.70181677],
            [-1.85613113, 46.70267509],
            [-1.85103921, 46.70319342],
            [-1.84589767, 46.70336675]
          ]
        ]
      ],
      type: 'MultiPolygon'
    }

    // close manually the draw modal
    dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
    cy.wait(1000)

    // Check geom values
    cy.waitForLastRequest(
      '@createMission',
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
        expect(response && response.statusCode).equal(200)
        expect(response.body.geom).to.deep.equal(computedMissionZone)

        cy.wait(200)
        cy.clickButton('Fermer')
        cy.wait(200)
        cy.fill('Période', 'Période spécifique')
        cy.fill('Période spécifique', [
          [2024, 5, 26],
          [2024, 5, 28]
        ])
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
