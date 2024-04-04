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
    cy.wait(1000)
    dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
    cy.wait(1000)

    const computedMissionZone: GeoJSON.Geometry = {
      coordinates: [
        [
          [
            [-1.84589767, 46.68088375],
            [-1.84397039, 46.68081877],
            [-1.84206169, 46.68062448],
            [-1.84018995, 46.68030274],
            [-1.83837323, 46.67985665],
            [-1.83662902, 46.67929051],
            [-1.83497413, 46.67860978],
            [-1.8334245, 46.67782102],
            [-1.83199507, 46.67693183],
            [-1.83069959, 46.67595078],
            [-1.82955056, 46.67488731],
            [-1.82855902, 46.67375168],
            [-1.82773452, 46.67255483],
            [-1.82708499, 46.67130828],
            [-1.82661667, 46.67002405],
            [-1.82633407, 46.66871451],
            [-1.82623989, 46.66739226],
            [-1.82633503, 46.66607004],
            [-1.82661855, 46.66476059],
            [-1.82708771, 46.66347651],
            [-1.82773798, 46.66223018],
            [-1.8285631, 46.66103358],
            [-1.82955509, 46.65989824],
            [-1.83070441, 46.65883509],
            [-1.83199997, 46.65785437],
            [-1.83342931, 46.6569655],
            [-1.83497866, 46.65617706],
            [-1.8366331, 46.65549662],
            [-1.8383767, 46.65493074],
            [-1.84019268, 46.65448486],
            [-1.84206357, 46.65416327],
            [-1.84397135, 46.65396908],
            [-1.84589767, 46.65390413],
            [-1.84782399, 46.65396908],
            [-1.84973177, 46.65416327],
            [-1.85160266, 46.65448486],
            [-1.85341864, 46.65493074],
            [-1.85516224, 46.65549662],
            [-1.85681668, 46.65617706],
            [-1.85836603, 46.6569655],
            [-1.85979537, 46.65785437],
            [-1.86109093, 46.65883509],
            [-1.86224025, 46.65989824],
            [-1.86323224, 46.66103358],
            [-1.86405736, 46.66223018],
            [-1.86470763, 46.66347651],
            [-1.86517679, 46.66476059],
            [-1.86546031, 46.66607004],
            [-1.86555545, 46.66739226],
            [-1.86546127, 46.66871451],
            [-1.86517867, 46.67002405],
            [-1.86471035, 46.67130828],
            [-1.86406082, 46.67255483],
            [-1.86323632, 46.67375168],
            [-1.86224478, 46.67488731],
            [-1.86109575, 46.67595078],
            [-1.85980027, 46.67693183],
            [-1.85837084, 46.67782102],
            [-1.85682121, 46.67860978],
            [-1.85516632, 46.67929051],
            [-1.85342211, 46.67985665],
            [-1.85160539, 46.68030274],
            [-1.84973365, 46.68062448],
            [-1.84782495, 46.68081877],
            [-1.84589767, 46.68088375]
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
        expect(response.body.geom.coordinates).to.deep.equal(computedMissionZone.coordinates)
        expect(response.body.geom.type).to.deep.equal(computedMissionZone.type)

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
