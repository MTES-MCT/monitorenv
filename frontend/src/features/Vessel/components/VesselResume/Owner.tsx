import { VesselIdentity } from '@features/Vessel/components/VesselResume/styles'
import countries from 'i18n-iso-countries'
import styled from 'styled-components'

import { UNKNOWN } from '.'

import type { Vessel } from '@features/Vessel/types'

type OwnerResumeProps = {
  vessel: Vessel.Vessel
}

export function Owner({ vessel }: OwnerResumeProps) {
  const nationalityName = vessel.ownerNationality
    ? countries.getName(vessel.ownerNationality.substring(0, 2).toLowerCase(), 'fr')
    : UNKNOWN

  return (
    <OwnerSection>
      <header>Informations propriétaire</header>
      <OwnerIdentity>
        <dt>Identité de la personne</dt>
        <dd>
          {!vessel.ownerFirstName && !vessel.ownerLastName
            ? UNKNOWN
            : `${vessel.ownerFirstName} ${vessel.ownerLastName}`}
        </dd>
        <dt>Coordonnées</dt>
        {vessel.ownerPhone || vessel.ownerEmail ? (
          <dd>
            {vessel.ownerPhone && <p>{vessel.ownerPhone}</p>}
            {vessel.ownerEmail && <p>{vessel.ownerEmail}</p>}
          </dd>
        ) : (
          <dd>{UNKNOWN}</dd>
        )}
        <dt>Date de naissance</dt>
        <dd>{vessel.ownerDateOfBirth ?? UNKNOWN}</dd>
        <dt>Adresse postale</dt>
        <dd>{vessel.ownerPostalAddress ?? UNKNOWN}</dd>
        <dt>Nationalité</dt>
        <dd>{nationalityName}</dd>
        <dt>Raison sociale</dt>
        <dd>{vessel.ownerCompanyName ?? UNKNOWN}</dd>
        <dt>Secteur d&apos;activité</dt>
        <dd>{vessel.ownerBusinessSegmentLabel ?? UNKNOWN}</dd>
        <dt>Statut juridique</dt>
        <dd>{vessel.ownerLegalStatusLabel ?? UNKNOWN}</dd>
        <dt>Début de la propriété</dt>
        <dd>{vessel.ownerStartDate ?? UNKNOWN}</dd>
      </OwnerIdentity>
    </OwnerSection>
  )
}

const OwnerSection = styled.section`
  header {
    background-color: ${p => p.theme.color.lightGray};
    padding: 10px 20px;
    color: ${p => p.theme.color.slateGray};
    font-weight: 500;
  }
`

const OwnerIdentity = styled(VesselIdentity)`
  grid-template-columns: 1fr 1.5fr;
`
