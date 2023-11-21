context('Mission', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.visit(`/side_window`)
  })

  it('A control can be attached to a reporting', () => {
    // Given
    cy.intercept('GET', '/bff/v1/missions*').as('getMissions')
    cy.wait(400)
    cy.getDataCy('edit-mission-38').click({ force: true })
    cy.getDataCy('action-card').eq(1).click()
    cy.getDataCy('control-form-toggle-reporting').click({ force: true })
    cy.fill('Signalements', '8')

    cy.getDataCy('control-attached-reporting-tag').should('be.visible')
    cy.getDataCy('reporting-control-done').should('be.visible')

    cy.intercept('PUT', `/bff/v1/missions/38`).as('updateMission')
    cy.clickButton('Enregistrer et quitter')

    // Then
    cy.wait('@updateMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
      const controlWithAttachedReporting = response?.body.envActions.find(
        action => action.id === 'f3e90d3a-6ba4-4bb3-805e-d391508aa46d'
      )
      const attachedReporting = response?.body.attachedReportings.find(reporting => reporting.id === 8)

      expect(controlWithAttachedReporting.reportingIds.length).equal(1)
      expect(controlWithAttachedReporting.reportingIds[0]).equal(8)
      expect(attachedReporting.attachedEnvActionId).equal('f3e90d3a-6ba4-4bb3-805e-d391508aa46d')
    })
  })

  it('A control can be detached to a reporting', () => {
    // Given
    cy.intercept('GET', '/bff/v1/missions*').as('getMissions')
    cy.wait(400)
    cy.getDataCy('edit-mission-38').click({ force: true })
    cy.getDataCy('action-card').eq(1).click()
    cy.getDataCy('control-form-toggle-reporting').click({ force: true })

    cy.getDataCy('control-attached-reporting-tag').should('not.exist')
    cy.getDataCy('reporting-control-done').should('not.exist')

    cy.intercept('PUT', `/bff/v1/missions/38`).as('updateMission')
    cy.clickButton('Enregistrer et quitter')

    // Then
    cy.wait('@updateMission').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
      const controlWithAttachedReporting = response?.body.envActions.find(
        action => action.id === 'f3e90d3a-6ba4-4bb3-805e-d391508aa46d'
      )
      const attachedReporting = response?.body.attachedReportings.find(reporting => reporting.id === 8)

      expect(controlWithAttachedReporting.reportingIds.length).equal(0)
      expect(attachedReporting.attachedEnvActionId).equal(null)
    })
  })
})
