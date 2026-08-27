export function createRegulatoryAreaGroup(layerName: string = 'Nouveau groupe', location: string = 'Quelque part') {
  cy.fill('Type', layerName)
  cy.fill('Lieu', location)
  cy.fill('Type d’acte administratif', 'Arrêté inter-préfectoral')
  cy.fill('Titre de la réglementation', 'Réglementation')
  cy.fill('URL du lien', 'https://www.google.com')
  cy.fill('Début de validité', [2027, 1, 1, 0, 0])
  cy.clickButton('Valider')
}
