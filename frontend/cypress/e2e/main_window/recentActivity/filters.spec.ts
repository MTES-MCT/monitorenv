import { customDayjs } from '@mtes-mct/monitor-ui'

import { getUtcDateInMultipleFormats } from '../../utils/getUtcDateInMultipleFormats'
import { goToMainWindow } from '../utils'

function setDateRangeWithControlsFilter(): {
  endDateFilter: string
  startDateFilter: string
} {
  cy.fill('Période', 'Période spécifique')
  const startDateFilter = getUtcDateInMultipleFormats('2024-01-01T00:00:00.000Z')
  const futureDate = customDayjs.utc().endOf('day').add(5, 'month').format('YYYY-MM-DDT23:59:59.000Z')
  const endDateFilter = getUtcDateInMultipleFormats(futureDate)
  cy.fill('Période spécifique', [startDateFilter.asDatePickerDate, endDateFilter.asDatePickerDate])

  return { endDateFilter: endDateFilter.asStringUtcDate, startDateFilter: startDateFilter.asStringUtcDate }
}

context('Recent Activity -> Filters', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/themes').as('getThemes')
    cy.intercept('POST', `/bff/v1/recent-activity/controls`).as('postRecentActivityControls')
    goToMainWindow()

    cy.clickButton("Voir l'activité récente")
    cy.wait('@getThemes')
    cy.wait('@postRecentActivityControls')
  })

  afterEach(() => {
    cy.fill('Période', '30 derniers jours')
    cy.fill('Administration', undefined)
    cy.fill('Unité', undefined)
    cy.fill('Thématique', undefined)
  })

  it('Should filter recent control activity with custom date range', () => {
    const { endDateFilter, startDateFilter } = setDateRangeWithControlsFilter()

    cy.wait('@postRecentActivityControls').then(({ request, response }) => {
      if (!response) {
        assert.fail('response is undefined.')
      }
      assert.deepEqual(request.body, {
        administrationIds: null,
        controlUnitIds: null,
        geometry: null,
        startedAfter: startDateFilter,
        startedBefore: endDateFilter,
        themeIds: null
      })

      assert.equal(response.statusCode, 200)
      assert.equal(response.body.length, 2)
    })
  })

  it('Should filter recent control activity with administration filters', () => {
    const { endDateFilter, startDateFilter } = setDateRangeWithControlsFilter()
    cy.wait('@postRecentActivityControls')
    cy.fill('Administration', ['DDTM'])

    cy.wait('@postRecentActivityControls').then(({ request, response }) => {
      if (!response) {
        assert.fail('response is undefined.')
      }
      assert.deepEqual(request.body, {
        administrationIds: [1005],
        controlUnitIds: null,
        geometry: null,
        startedAfter: startDateFilter,
        startedBefore: endDateFilter,
        themeIds: null
      })

      assert.equal(response.statusCode, 200)
      assert.equal(response.body.length, 1)
      assert.equal(response.body[0].id, 'f3e90d3a-6ba4-4bb3-805e-d391508aa46d')
      assert.equal(response.body[0].administrationIds, 1005)
    })
  })

  it('Should filter recent control activity with control unit filters', () => {
    const { endDateFilter, startDateFilter } = setDateRangeWithControlsFilter()
    cy.wait('@postRecentActivityControls')
    cy.fill('Unité', ['BSN Ste Maxime'])

    cy.wait('@postRecentActivityControls').then(({ request, response }) => {
      if (!response) {
        assert.fail('response is undefined.')
      }
      assert.deepEqual(request.body, {
        administrationIds: null,
        controlUnitIds: [10015],
        geometry: null,
        startedAfter: startDateFilter,
        startedBefore: endDateFilter,
        themeIds: null
      })

      assert.equal(response.statusCode, 200)
      assert.equal(response.body.length, 1)
      assert.equal(response.body[0].id, 'b8007c8a-5135-4bc3-816f-c69c7b75d807')
      assert.include(response.body[0].controlUnitIds, 10015)
    })
  })

  it('Should filter recent control activity with theme filters', () => {
    const { endDateFilter, startDateFilter } = setDateRangeWithControlsFilter()
    cy.wait('@postRecentActivityControls')
    cy.fill('Thématique', ['Mouillage individuel'])

    cy.wait('@postRecentActivityControls').then(({ request, response }) => {
      if (!response) {
        assert.fail('response is undefined.')
      }
      assert.deepEqual(request.body, {
        administrationIds: null,
        controlUnitIds: null,
        geometry: null,
        startedAfter: startDateFilter,
        startedBefore: endDateFilter,
        themeIds: [100]
      })

      assert.equal(response.statusCode, 200)
      assert.equal(response.body.length, 1)
      assert.equal(response.body[0].id, 'b8007c8a-5135-4bc3-816f-c69c7b75d807')
      assert.include(response.body[0].themeIds, 100)
    })
  })
  it('Should filter recent control activity with geometry filters', () => {
    const { endDateFilter, startDateFilter } = setDateRangeWithControlsFilter()
    cy.wait('@postRecentActivityControls')
    cy.clickButton('Définir un tracé pour la zone à filtrer')

    cy.get('#root').click(490, 180)
    cy.wait(250)
    cy.get('#root').click(490, 380)
    cy.wait(250)
    cy.get('#root').click(690, 380)
    cy.wait(250)
    cy.get('#root').click(690, 180)
    cy.wait(250)
    cy.get('#root').click(490, 180)
    cy.clickButton('Valider la zone à filtrer')

    cy.wait('@postRecentActivityControls').then(({ request, response }) => {
      if (!response) {
        assert.fail('response is undefined.')
      }

      // check request body
      assert.equal(request.body.administrationIds, null)
      assert.equal(request.body.controlUnitIds, null)
      assert.equal(request.body.startedAfter, startDateFilter)
      assert.equal(request.body.startedBefore, endDateFilter)
      assert.equal(request.body.themeIds, null)
      assert.equal(request.body.geometry.type, 'MultiPolygon')

      // check response
      assert.equal(response.statusCode, 200)
      assert.equal(response.body.length, 1)
      assert.equal(response.body[0].id, 'b8007c8a-5135-4bc3-816f-c69c7b75d807')

      // clean
      cy.clickButton('Supprimer cette zone')
    })
  })
})
