/// <reference types="cypress" />

import dayjs from 'dayjs'

context('Missions', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024)
    cy.visit(`/side_window`)
  })

  it('12 Missions should be displayed in Missions Table', () => {
    cy.get('*[data-cy="SideWindowHeader-title"]').contains('Missions et contrôles')
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').contains('12')

    cy.log('A default date filter should be set')
    const thirtyDaysAgo = dayjs().subtract(30, 'days')

    cy.get('*[data-cy="datepicker-missionStartedAfter"]').contains(`${thirtyDaysAgo.format('YYYY-MM-DD')}`)

    cy.log('Units should be filtered')
    cy.get('*[data-cy="select-units-filter"]').click({ force: true })
    cy.get('[data-key="Cross Etel"] > .rs-picker-select-menu-item').click({ force: true })
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').contains('1')

    cy.log('Administrations should be filtered')
    cy.get('*[data-cy="select-administrations-filter"]').click({ force: true })
    cy.get('[data-key="DDTM"] > .rs-picker-select-menu-item').click({ force: true })
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').contains('6')

    cy.get('*[data-cy="select-administrations-filter"] > .rs-btn-close').click({ force: true })
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').contains('12')
  })

  it('Missions table should display all themes and subthemes of all the actions of the mission', () => {
    cy.get('*[data-cy="cell-envactions-themes"] > .rs-table-cell-content')
      .eq(3)
      .contains(
        "Police des espèces protégées et de leurs habitats (faune et flore) : Destruction, capture, arrachage / Atteinte aux habitats d'espèces protégées ; Police des mouillages : Mouillage individuel / ZMEL"
      )
  })

  it('An infraction Should be duplicated', () => {
    // Given
    cy.get('*[data-cy="edit-mission"]').eq(3).click()
    cy.get('*[data-cy="action-card"]').eq(1).click()
    cy.get('*[data-cy="control-form-number-controls"]').type('{backspace}2')
    cy.get('*[data-cy="infraction-form"]').should('not.exist')

    // When
    cy.get('*[data-cy="duplicate-infraction"]').click({ force: true })
    cy.get('*[data-cy="infraction-form-registrationNumber"]').should('have.value', 'BALTIK')
    cy.get('*[data-cy="infraction-form-validate"]').click({ force: true })
    cy.get('*[data-cy="duplicate-infraction"]').eq(1).should('be.disabled')

    cy.intercept('PUT', `/bff/v1/missions/34`).as('updateMission')
    cy.get('[type="submit"]').click()

    // Then
    cy.wait('@updateMission').then(({ request, response }) => {
      expect(response && response.statusCode).equal(200)
      const { infractions } = request.body.envActions.find(a => a.id === 'c52c6f20-e495-4b29-b3df-d7edfb67fdd7')
      expect(infractions.length).equal(2)
      const duplicatedInfraction = infractions[1]

      expect(duplicatedInfraction.controlledPersonIdentity).equal('John Doe')
      expect(duplicatedInfraction.formalNotice).equal('PENDING')
      expect(duplicatedInfraction.infractionType).equal('WITH_REPORT')
      expect(duplicatedInfraction.natinf.length).equal(2)
      expect(duplicatedInfraction.observations).equal("Pas d'observations")
      expect(duplicatedInfraction.registrationNumber).equal('BALTIK')
      expect(duplicatedInfraction.relevantCourt).equal('LOCAL_COURT')
      expect(duplicatedInfraction.toProcess).equal(false)
      expect(duplicatedInfraction.vesselSize).equal('FROM_24_TO_46m')
      expect(duplicatedInfraction.vesselType).equal('COMMERCIAL')
      expect(duplicatedInfraction.id).not.equal('c52c6f20-e495-4b29-b3df-d7edfb67fdd7')
    })
  })

  it('allow only one theme and may be multiple subthemes in control actions', () => {
    // Given
    cy.get('*[data-cy="edit-mission"]').eq(3).click()
    cy.intercept('GET', `/bff/v1/controlthemes`).as('getControlThemes')
    cy.get('*[data-cy="action-card"]').eq(1).click()
    cy.get('*[data-cy="envaction-theme-element"]').should('have.length', 1)
    cy.wait('@getControlThemes')
    cy.get('*[data-cy="envaction-theme-selector"]').contains('Police des mouillages')
    cy.get('*[data-cy="envaction-theme-element"]').contains('Mouillage individuel')
    cy.get('*[data-cy="envaction-theme-element"]').contains('ZMEL')
    cy.get('*[data-cy="envaction-protected-species-selector"]').should('not.exist')
    // When
    cy.get('*[data-cy="envaction-theme-selector"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Police des espèces protégées').click()

    cy.get('*[data-cy="envaction-subtheme-selector"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Perturbation').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Atteinte aux habitats').click({ force: true })
    cy.get('*[data-cy="envaction-subtheme-selector"]').click({ force: true })

    cy.get('*[data-cy="envaction-protected-species-selector"]').should('exist')
    cy.get('*[data-cy="envaction-protected-species-selector"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Habitat').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Oiseaux').click({ force: true })
    cy.get('*[data-cy="envaction-protected-species-selector"]').click({ force: true })

    cy.get('*[data-cy="envaction-add-theme"]').should('not.exist')

    cy.intercept('PUT', `/bff/v1/missions/34`).as('updateMission')
    cy.get('[type="submit"]').click()

    // Then
    cy.wait('@updateMission').then(({ request, response }) => {
      expect(response && response.statusCode).equal(200)

      const { themes } = request.body.envActions.find(a => a.id === 'c52c6f20-e495-4b29-b3df-d7edfb67fdd7')
      expect(themes.length).equal(1)
      expect(themes[0].theme).equal('Police des espèces protégées et de leurs habitats (faune et flore)')
      expect(themes[0].subThemes.length).equal(2)
      expect(themes[0].subThemes[0]).equal("Perturbation d'animaux")
      expect(themes[0].subThemes[1]).equal("Atteinte aux habitats d'espèces protégées")
      expect(themes[0].protectedSpecies.length).equal(2)
      expect(themes[0].protectedSpecies[0]).equal('HABITAT')
      expect(themes[0].protectedSpecies[1]).equal('BIRDS')
    })
  })

  it('save observations in control Actions', () => {
    // Given
    cy.get('*[data-cy="edit-mission"]').eq(3).click()
    cy.intercept('GET', `/bff/v1/controlthemes`).as('getControlThemes')
    cy.get('*[data-cy="action-card"]').eq(1).click()
    cy.get('[id="envActions[1].observations"]').contains('RAS')

    // When
    cy.get('[id="envActions[1].observations"]').type('{backspace}{backspace}Une observation importante')

    cy.intercept('PUT', `/bff/v1/missions/34`).as('updateMission')
    cy.get('[type="submit"]').click()

    // Then
    cy.wait('@updateMission').then(({ request, response }) => {
      expect(response && response.statusCode).equal(200)

      const { observations } = request.body.envActions.find(a => a.id === 'c52c6f20-e495-4b29-b3df-d7edfb67fdd7')
      expect(observations).equal('RUne observation importante')
    })
  })

  it('allow multiple themes and may be multiple subthemes in surveillance actions', () => {
    // Given
    cy.get('*[data-cy="edit-mission"]').eq(3).click()
    cy.intercept('GET', `/bff/v1/controlthemes`).as('getControlThemes')
    cy.get('*[data-cy="action-card"]').eq(0).click()
    cy.get('*[data-cy="envaction-theme-element"]').should('have.length', 1)
    cy.wait('@getControlThemes')
    cy.get('*[data-cy="envaction-theme-selector"]').contains(
      'Police des espèces protégées et de leurs habitats (faune et flore)'
    )
    cy.get('*[data-cy="envaction-theme-element"]').contains('Destruction, capture, arrachage')
    cy.get('*[data-cy="envaction-protected-species-selector"]').should('exist')
    cy.get('*[data-cy="envaction-theme-element"]').contains('Flore').click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').contains('Oiseaux').click({ force: true })

    // When

    cy.get('*[data-cy="envaction-add-theme"]').click({ force: true })
    cy.get('*[data-cy="envaction-theme-selector"]').eq(1).click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').eq(1).contains('Police des mouillages').click()

    cy.get('*[data-cy="envaction-subtheme-selector"]').eq(1).click({ force: true })
    cy.get('*[data-cy="envaction-theme-element"]').eq(1).contains('ZMEL').click()

    cy.get('*[data-cy="envaction-protected-species-selector"]').should('have.length', 1)

    cy.intercept('PUT', `/bff/v1/missions/34`).as('updateMission')
    cy.get('[type="submit"]').click()

    // Then
    cy.wait('@updateMission').then(({ request, response }) => {
      expect(response && response.statusCode).equal(200)

      const { themes } = request.body.envActions.find(a => a.id === 'b8007c8a-5135-4bc3-816f-c69c7b75d807')
      expect(themes.length).equal(2)
      expect(themes[0].theme).equal('Police des espèces protégées et de leurs habitats (faune et flore)')
      expect(themes[0].subThemes.length).equal(2)
      expect(themes[0].subThemes[0]).equal('Destruction, capture, arrachage')
      expect(themes[0].subThemes[1]).equal("Atteinte aux habitats d'espèces protégées")
      expect(themes[0].protectedSpecies.length).equal(2)
      expect(themes[0].protectedSpecies[0]).equal('FLORA')
      expect(themes[0].protectedSpecies[1]).equal('BIRDS')
      expect(themes[1].theme).equal('Police des mouillages')
      expect(themes[1].subThemes.length).equal(1)
      expect(themes[1].subThemes[0]).equal('ZMEL')
      expect(themes[1].protectedSpecies.length).equal(0)
    })
  })

  it('A mission should be created', () => {
    // Given
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').contains('12')
    cy.get('*[data-cy="add-mission"]').click()

    // When
    cy.get('[name="missionTypes1"]').click({ force: true })
    cy.get('*[data-cy="add-control-unit"]').click()
    cy.get('.rs-picker-search-bar-input').type('Cross{enter}')
    cy.wait(200)
    cy.get('*[data-cy="add-control-administration"]').contains('DIRM / DM')
    cy.get('*[data-cy="add-control-unit"]').contains('Cross Etel')
    cy.intercept('PUT', `/bff/v1/missions`).as('createMission')
    cy.get('form').submit()

    // Then
    cy.wait('@createMission').then(({ request, response }) => {
      expect(response && response.statusCode).equal(200)

      expect(request.body.missionTypes.length).equal(2)
      expect(request.body.missionTypes[0]).equal('SEA')
      expect(request.body.missionTypes[1]).equal('LAND')
      expect(request.body.controlUnits.length).equal(1)
      const controlUnit = request.body.controlUnits[0]
      expect(controlUnit.administration).equal('DIRM / DM')
      expect(controlUnit.id).equal(10012)
      expect(controlUnit.name).equal('Cross Etel')
    })
    cy.get('*[data-cy="Missions-numberOfDisplayedMissions"]').contains('13')
  })

  it('Missions from POSEIDON_CACEM must not be editable', () => {
    // Given
    cy.intercept('GET', `/bff/v1/missions/51`).as('getMissionPoseidonCacem')
    cy.get('*[data-cy="edit-mission"]').eq(10).click()
    cy.wait('@getMissionPoseidonCacem').then(({ response }) => {
      expect(response && response.statusCode).equal(200)
      expect(response && response.body.missionSource).equal('POSEIDON_CACEM')
    })

    cy.get('*[data-cy="quit-edit-mission"]').should('exist')
    cy.get('*[data-cy="save-mission"]').should('not.exist')
    cy.get('*[data-cy="close-mission"]').should('not.exist')
    cy.get('*[data-cy="delete-mission"]').should('not.exist')
  })
})
