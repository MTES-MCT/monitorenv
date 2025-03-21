import EventSource, { sources } from 'eventsourcemock'

export function visitSideWindow(isAutoSaveEnabled = 'true') {
  cy.visit(`/side_window`, {
    onBeforeLoad(window: Cypress.AUTWindow & { env: { [key: string]: string } }) {
      Object.defineProperty(window, 'EventSource', { value: EventSource })
      Object.defineProperty(window, 'mockEventSources', { value: sources })

      Cypress.env('CYPRESS_MISSION_FORM_AUTO_SAVE_ENABLED', isAutoSaveEnabled)
      Cypress.env('CYPRESS_MISSION_FORM_AUTO_UPDATE', 'true')
      Cypress.env('CYPRESS_REPORTING_FORM_AUTO_SAVE_ENABLED', 'true')
    }
  })
}
