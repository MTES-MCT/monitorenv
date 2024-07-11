import { getFutureDate } from './getFutureDate'

export function createPendingMission() {
  cy.intercept('GET', '/bff/v1/missions*').as('getMissions')
  cy.intercept('PUT', '/bff/v1/missions').as('createMission')
  cy.clickButton('Missions et contrôles')
  cy.clickButton('Ajouter une nouvelle mission')

  const endDate = getFutureDate(7, 'day')
  cy.fill('Date de fin (UTC)', endDate)

  cy.get('[name="missionTypes0"]').click({ force: true })
  cy.fill('Unité 1', 'A636 Maïto')

  return cy.waitForLastRequest(
    '@createMission',
    {
      body: {
        missionTypes: ['SEA']
      }
    },
    5,
    undefined,
    missionResponse => {
      cy.wait(250)

      return Promise.resolve(missionResponse)
    }
  )
}
