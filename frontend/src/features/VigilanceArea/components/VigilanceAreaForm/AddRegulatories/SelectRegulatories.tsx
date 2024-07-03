import { SubFormBody, SubFormHeader, SubFormHelpText, SubFormTitle } from '../style'

export function SelectRegulatories() {
  return (
    <>
      <SubFormHeader>
        <SubFormTitle>Ajout d’une réglementation en lien en cours…</SubFormTitle>
      </SubFormHeader>
      <SubFormBody>
        <SubFormHelpText>
          Ajoutez des réglementations en lien depuis le panneau de gauche (+) ou sélectionnez directement les tracés sur
          la carte.
        </SubFormHelpText>
      </SubFormBody>
    </>
  )
}
