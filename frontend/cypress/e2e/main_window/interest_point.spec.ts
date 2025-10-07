import { FAKE_MAPBOX_RESPONSE } from '../constants'

context('InterestPoint', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)
    cy.visit('/#@-824534.42,6082993.21,8.70')
  })

  describe('An interest point', () => {
    it('should be created when clicking on the map', () => {
      // When
      cy.getDataCy('interest-point').click()
      cy.get('#root').click(490, 580)

      // Then
      cy.getDataCy('interest-point-name-input').type('Phénomène')
      cy.getDataCy('interest-point-observations-input').type('Est dans la bergerie')

      cy.getDataCy('interest-point-name').contains('Phénomène')
      cy.getDataCy('interest-point-observations').contains('Est dans la bergerie')
      cy.getDataCy('interest-point-coordinates').contains('47° 4')
      cy.getDataCy('interest-point-coordinates').contains('N')
      cy.getDataCy('interest-point-coordinates').contains('007° 5')
      cy.getDataCy('interest-point-coordinates').contains('W')

      cy.getDataCy('interest-point-save').click()
    })

    it('should be created from input when DD coordinates are selected', () => {
      // When
      cy.getDataCy('interest-point').click()
      cy.fill('Unités des coordonnées', 'DD')
      // Then
      cy.getDataCy('coordinates-dd-input-lat').type('47.5525')
      cy.getDataCy('coordinates-dd-input-lon').type('-7.6565', { delay: 500 })

      cy.getDataCy('interest-point-name').contains('Aucun Libellé')
      cy.getDataCy('interest-point-observations').contains('Aucune observation')
      cy.getDataCy('interest-point-coordinates').contains('47.5525° -007.6565°')

      cy.getDataCy('interest-point-save').click()
      // Then
      cy.getDataCy('interest-point-coordinates').contains('47.5525° -007.6565°')
    })

    it('An interest should be edited When DMD coordinates are selected', () => {
      cy.getDataCy('interest-point').click()
      cy.fill('Unités des coordonnées', 'DMD')
      cy.get('#root').click(590, 580)
      cy.getDataCy('interest-point-name-input').type('Phénomène')
      cy.getDataCy('interest-point-save').click()

      cy.getDataCy('interest-point-edit').click({ force: true })
      cy.getDataCy('dmd-coordinates-input').type('{backspace}{backspace}{backspace}{backspace}{backspace}500W')

      cy.getDataCy('interest-point-coordinates').contains('47° 42.111′ N 007° 34.500′ W')
    })

    it('should be edited with East value when DMS coordinates are selected', () => {
      cy.getDataCy('interest-point').click()
      cy.fill('Unités des coordonnées', 'DMS')

      cy.get('#root').click(490, 580)
      cy.getDataCy('interest-point-save').click()
      cy.getDataCy('interest-point-edit').click()

      // The interest point is moved to the East side
      cy.getDataCy('dms-coordinates-input').type('{backspace}E')
      cy.getDataCy('interest-point-save').click()

      // Then
      cy.get('#root').click(536, 600)
      cy.getDataCy('save-interest-point').should('not.exist')

      cy.getDataCy('interest-point-edit').should('not.be.visible')
      // Force because the interest point is not in the DOM anymore
      cy.getDataCy('interest-point-edit').click({ force: true })
      cy.getDataCy('dms-coordinates-input').should('have.value', '47° 42′ 07″ N 007° 54′ 51″ E')
      cy.get('.rs-radio').should('have.class', 'rs-radio-checked')
      cy.getDataCy('interest-point-save').click()

      cy.getDataCy('interest-point-coordinates').contains('47° 42′')
      cy.getDataCy('interest-point-coordinates').contains('N')
      cy.getDataCy('interest-point-coordinates').contains('007° 54′')
      cy.getDataCy('interest-point-coordinates').contains('E')
    })

    it('should be deleted when it is in edit mode', () => {
      // When
      cy.getDataCy('interest-point').click()
      cy.get('#root').click(490, 580)
      cy.getDataCy('interest-point-save').click()
      cy.getDataCy('interest-point-edit').click()
      cy.getDataCy('interest-point-observations-input').type('Est dans la bergerie')
      cy.getDataCy('interest-point-delete').click()

      // Then
      cy.getDataCy('interest-point-coordinates').should('not.exist')
    })

    it('should be deleted when clicking on remove button in edit mode', () => {
      // When
      cy.getDataCy('interest-point').click()
      cy.get('#root').click(490, 580)
      cy.getDataCy('interest-point-save').click()
      cy.getDataCy('interest-point-edit').click()
      cy.getDataCy('interest-point-edit-delete').click()

      // Then
      cy.getDataCy('interest-point-coordinates').should('not.exist')
    })

    it('should retrieve initial attributes when clicking on close button', () => {
      // When
      cy.getDataCy('interest-point').click()
      cy.get('#root').click(490, 580)
      cy.getDataCy('interest-point-name-input').type('Initial point')
      cy.getDataCy('interest-point-observations-input').type('Est dans la bergerie')
      cy.getDataCy('interest-point-save').click()

      cy.getDataCy('interest-point-edit').click()
      cy.getDataCy('interest-point-name-input').clear().type('Edited point')
      cy.getDataCy('interest-point-observations-input').clear().type("n'est pas dans la bergerie")
      cy.getDataCy('interest-point-close').click()

      // Then
      cy.getDataCy('interest-point-name').should('contain', 'Initial point')
      cy.getDataCy('interest-point-observations').should('contain', 'Est dans la bergerie')
    })

    it('not saved should be deleted when closing interest point tool', () => {
      // When
      cy.getDataCy('interest-point').click()
      cy.get('#root').click(490, 580)
      cy.getDataCy('interest-point').click()

      // Then
      cy.getDataCy('interest-point-coordinates').should('not.exist')
    })

    it('in drawing mode should be stopped when closing the interest point tool', () => {
      // When
      cy.getDataCy('interest-point').click()
      cy.get('body').type('{esc}')
      cy.get('#root').click(490, 580)
      cy.getDataCy('interest-point-save').should('not.exist')
      cy.getDataCy('interest-point-edit').should('not.exist')
    })
    it('should not be displayed on map when clicking on the hide all button', () => {
      // Given
      cy.getDataCy('interest-point').click()
      cy.get('#root').click(490, 580)

      cy.getDataCy('interest-point-name-input').type('Phénomène')
      cy.getDataCy('interest-point-save').click()
      cy.getDataCy('interest-point-name').should('be.visible')

      // When

      cy.getDataCy('interest-point').click()
      cy.getDataCy('hide-all-interest-point').click()

      // Then
      cy.getDataCy('interest-point-name').should('not.exist')
    })
    it('should be displayed on map when clicking on the hide all button twice', () => {
      // Given
      cy.getDataCy('interest-point').click()
      cy.get('#root').click(490, 580)

      cy.getDataCy('interest-point-name-input').type('Phénomène')
      cy.getDataCy('interest-point-save').click()
      cy.getDataCy('interest-point-name').should('be.visible')

      // When
      cy.getDataCy('interest-point-edit').click()
      cy.getDataCy('hide-all-interest-point').click().click()

      // Then
      cy.getDataCy('interest-point-name').should('be.visible')
    })
    it('should be displayed on map by default when opening the interest point tool', () => {
      // Given
      cy.getDataCy('interest-point').click()
      cy.get('#root').click(490, 580)

      cy.getDataCy('interest-point-name-input').type('Phénomène')
      cy.getDataCy('interest-point-save').click()
      cy.getDataCy('interest-point-name').should('be.visible')

      // When
      cy.getDataCy('interest-point').click()
      cy.getDataCy('hide-all-interest-point').click()
      cy.getDataCy('interest-point').click().click()

      // Then
      cy.getDataCy('interest-point-name').should('be.visible')
    })

    it('title should change to edit wording when editing an existing interest point ', () => {
      // Given
      cy.getDataCy('interest-point').click()
      cy.get('#root').click(490, 580)

      cy.getDataCy('interest-point-title').should('contain', "Créer un point d'intérêt")
      cy.getDataCy('interest-point-save').should('contain', 'Créer le point')
      cy.getDataCy('interest-point-save').click()

      // When
      cy.getDataCy('interest-point-edit').click()

      // Then
      cy.getDataCy('interest-point-title').should('contain', "Éditer un point d'intérêt")
      cy.getDataCy('interest-point-save').should('contain', 'Enregistrer le point')
    })

    it('should create a reporting with same coordinates', () => {
      // Given
      cy.getDataCy('interest-point').click()
      cy.get('#root').click(790, 580)

      cy.clickButton('Créer un signalement')
      // When
      cy.get('div').contains('Signalement non créé')
      cy.get('span').contains('47° 42′ 07″ N 006° 53′ 59″ W')
    })
  })
  describe('Multiple interest points ', () => {
    it('should be created when clicking on the map', () => {
      // When
      cy.getDataCy('interest-point').click()
      cy.get('#root').click(490, 580)
      cy.getDataCy('interest-point-name-input').type('Phénomène')
      cy.getDataCy('interest-point-observations-input').type('Est dans la bergerie')
      cy.getDataCy('interest-point-save').click()
      cy.getDataCy('interest-point-observations').contains('Est dans la bergerie')
      cy.getDataCy('interest-point-observations').should('have.length', 1)

      cy.getDataCy('interest-point').click()
      cy.getDataCy('dms-coordinates-input').should('have.value', '__° __′ __″ _ ___° __′ __″ _')
      cy.get('#root').click(300, 430)
      cy.getDataCy('interest-point-name-input').type('Phénomène 2')
      cy.getDataCy('interest-point-observations-input').type('Est encore dans la bergerie')
      cy.getDataCy('interest-point-save').click()
      cy.getDataCy('interest-point-observations').should('have.length', 2)
      cy.getDataCy('interest-point-observations').eq(0).contains('Est encore dans la bergerie')

      cy.getDataCy('interest-point').click()
      cy.getDataCy('dms-coordinates-input').should('have.value', '__° __′ __″ _ ___° __′ __″ _')
      cy.get('#root').click(650, 690)
      cy.getDataCy('interest-point-name-input').type('Phénomène 3')
      cy.getDataCy('interest-point-observations-input').type('Est encore encore dans la bergerie')
      cy.getDataCy('interest-point-save').click()
      cy.getDataCy('interest-point-observations').should('have.length', 3)
      cy.getDataCy('interest-point-observations').should('have.length', 3)
      cy.getDataCy('interest-point-observations').eq(0).contains('Est encore encore dans la bergerie')
    })
    it('should be hidden when clicking on the hide all button', () => {
      // Given
      cy.getDataCy('interest-point').click()
      cy.get('#root').click(490, 580)
      cy.getDataCy('interest-point-save').click()

      cy.getDataCy('interest-point').click()
      cy.get('#root').click(300, 430)
      cy.getDataCy('interest-point-save').click()
      cy.getDataCy('interest-point-observations').should('have.length', 2)
      cy.getDataCy('interest-point-observations').should('be.visible')

      // When
      cy.getDataCy('interest-point').click()
      cy.getDataCy('hide-all-interest-point').click()

      // Then
      cy.getDataCy('interest-point-observations').should('have.length', 0)
      cy.getDataCy('interest-point-name').should('not.exist')
    })
    it('should be displayed when clicking on the hide all button twice', () => {
      // Given
      cy.getDataCy('interest-point').click()
      cy.get('#root').click(490, 580)
      cy.getDataCy('interest-point-save').click()

      cy.getDataCy('interest-point').click()
      cy.get('#root').click(300, 430)
      cy.getDataCy('interest-point-save').click()
      cy.getDataCy('interest-point-observations').should('have.length', 2)
      cy.getDataCy('interest-point-observations').should('be.visible')

      // When
      cy.getDataCy('interest-point').click()
      cy.getDataCy('hide-all-interest-point').click()
      cy.getDataCy('hide-all-interest-point').click()

      // Then
      cy.getDataCy('interest-point-observations').should('have.length', 2)
      cy.getDataCy('interest-point-name').should('be.visible')
    })
  })
})
