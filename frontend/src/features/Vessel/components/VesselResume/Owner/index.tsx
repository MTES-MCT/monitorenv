import { VesselIdentity } from '@features/Vessel/components/VesselResume/styles'
import { UNKNOWN } from '@features/Vessel/components/VesselResume/utils'
import countries from 'i18n-iso-countries'
import { useMemo } from 'react'
import styled from 'styled-components'

import type { Vessel } from '@features/Vessel/types'

type OwnerProps = {
  vessel: Vessel.Vessel
}

export function Owner({ vessel }: OwnerProps) {
  const nationalityName = useMemo(() => {
    if (!vessel.ownerNationality) {
      return UNKNOWN
    }

    // targeting the first 3 char of the nationality because it can be up to 50 char, show raw data if not found
    return vessel.ownerNationality.length === 3
      ? countries.getName(vessel.ownerNationality.toUpperCase(), 'fr')
      : vessel.ownerNationality
  }, [vessel.ownerNationality])

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
