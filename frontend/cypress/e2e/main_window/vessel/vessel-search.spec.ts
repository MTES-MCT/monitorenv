import { Layers } from '../../../../src/domain/entities/layers/constants'
import { FAKE_MAPBOX_RESPONSE, PAGE_CENTER_PIXELS } from '../../constants'

context('Search Places', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.mapbox.com/**', FAKE_MAPBOX_RESPONSE)
    cy.visit('/#@-824534.42,6082993.21,8.70')
    cy.clickButton('Lieux')
    cy.clickButton('Navires')
    cy.getDataCy('vessel-search-input').type('shipname')
    cy.wait(500)
    cy.get('.rs-auto-complete-item').first().click()
  })

  it('A user can search a vessel and show its resume when it is selected', () => {
    cy.getDataCy('vessel-resume-SHIPNAME 1')
      .should('be.visible')
      .within(() => {
        cy.contains('1 signalement en cours')
        cy.contains('Latitude')
        cy.contains('47° 38.400′ N')
        cy.contains('Longitude')
        cy.contains('003° 13.176′ W')
        cy.contains('Vitesse')
        cy.contains('20.1 Nds')
        cy.contains('Dernier signal')
        // No assertions for last signal
        cy.contains("Port d'arrivée")
        cy.contains('BRE')
        cy.contains('MMSI')
        cy.contains('123456789')
        cy.contains('IMO')
        cy.contains('IMO1111')
        cy.contains('Immatriculation')
        cy.contains('IMMAT111111')
        cy.contains("Quartier d'immat")
        cy.contains('ALGER')
        cy.contains('Longueur')
        cy.contains('12.12m')
        cy.contains('Pavillon')
        cy.contains('Algérie')
        cy.contains('Catégorie')
        cy.contains('Professionnel')
        cy.contains('Type')
        cy.contains('Porte-conteneur')
        cy.contains('Désignation commerciale')
        cy.contains('COMMERCIAL NAME')
      })
    cy.getFeaturesFromLayer(Layers.LAST_POSITIONS.code, PAGE_CENTER_PIXELS).should(features => {
      expect(features).to.have.length(1)
      expect(features?.[0]?.get('shipname')).to.equal('SHIPNAME 1')
    })

    cy.clickButton('Fermer la fiche navire')
    cy.getDataCy('vessel-resume-SHIPNAME 1').should('not.exist')
  })

  it('A user can search a vessel and show its owner resume when it is selected', () => {
    cy.getDataCy('vessel-resume-SHIPNAME 1')
      .should('be.visible')
      .within(() => {
        cy.clickButton('Propriétaire(s)')
        cy.get('header').contains('Informations propriétaire')
        cy.contains('Identité de la personne')
        cy.contains('MICHEL DURAND')
        cy.contains('Coordonnées')
        cy.contains('0102030405')
        cy.contains('email@gmail.com')
        cy.contains('Date de naissance')
        cy.contains('1998-07-12')
        cy.contains('Adresse postale')
        cy.contains('82 STADE DE FRANCE')
        cy.contains('Nationalité')
        cy.contains('France')
        cy.contains('Raison sociale')
        cy.contains('COMPANY NAME 1')
        cy.contains("Secteur d'activité")
        cy.contains('Commerce et réparation de motocycles')
        cy.contains('Statut juridique')
        cy.contains('Société commerciale étrangère immatriculée au RCS')
        cy.contains('Début de la propriété')
        cy.contains('2000-01-01')
      })

    cy.clickButton('Fermer la fiche navire')
    cy.getDataCy('vessel-resume-SHIPNAME 1').should('not.exist')
  })

  it('A user can search a vessel and show its historic and go to reporting', () => {
    cy.getDataCy('vessel-resume-SHIPNAME 1')
      .should('be.visible')
      .within(() => {
        cy.clickButton('Antécédents')
        cy.get('header').contains('Derniers contrôles et signalements')
        cy.contains("0 susp. d'infraction")
        cy.contains('1 infraction')
        cy.contains('1 PV')
        cy.get('header').contains('Historique des contrôles et signalements')
        cy.getDataCy('2026-vessel-history').within(() => {
          cy.contains('1 signalement, 1 contrôle, 1 infraction, 1 PV').click()
          cy.contains('Voir le signalement').click()
        })
      })
    cy.getDataCy('reporting-title').contains('23-00012 - Vessel 12')

    cy.clickButton('Fermer la fiche navire')
    cy.getDataCy('vessel-resume-SHIPNAME 1').should('not.exist')
  })

  it('A user can search a vessel and show its historic and go to mission', () => {
    // Avoid sidewindow from opening that makes the next test to crash
    cy.window().then(window => {
      cy.stub(window, 'open').callsFake(() => {})
    })

    cy.getDataCy('vessel-resume-SHIPNAME 1')
      .should('be.visible')
      .within(() => {
        cy.clickButton('Antécédents')
        cy.get('header').contains('Derniers contrôles et signalements')
        cy.contains("0 susp. d'infraction")
        cy.contains('1 infraction')
        cy.contains('1 PV')
        cy.get('header').contains('Historique des contrôles et signalements')
        cy.getDataCy('2026-vessel-history').within(() => {
          cy.contains('1 signalement, 1 contrôle, 1 infraction, 1 PV').click()
          cy.contains('Voir la mission').click()
          // No assertions after this call because it opens the side window
        })
      })

    cy.clickButton('Fermer la fiche navire')
    cy.getDataCy('vessel-resume-SHIPNAME 1').should('not.exist')
  })

  it('A user can search a vessel and create a reporting from vessel information', () => {
    cy.getDataCy('vessel-resume-SHIPNAME 1')
      .should('be.visible')
      .within(() => {
        cy.clickButton('Antécédents')
        cy.clickButton('Ajouter un signalement')
      })

    cy.getDataCy('reporting-title').contains('NOUVEAU SIGNALEMENT (1)')
    cy.get('input[name="targetType"]').should('have.value', 'VEHICLE')
    cy.get('input[name="vehicleType"]').should('have.value', 'VESSEL')
    cy.get('input[name="targetDetails.0.mmsi"]').should('have.value', '123456789')

    cy.clickButton('Fermer la fiche navire')
    cy.getDataCy('vessel-resume-SHIPNAME 1').should('not.exist')
  })
})
