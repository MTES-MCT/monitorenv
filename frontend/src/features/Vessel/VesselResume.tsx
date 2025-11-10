import { useGetVesselQuery } from '@api/vesselApi'
import { vesselAction } from '@features/Vessel/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Icon, MapMenuDialog } from '@mtes-mct/monitor-ui'
import countries from 'i18n-iso-countries'
import styled from 'styled-components'

import { Flag } from './VesselSearchItem'

type VesselResumeProps = {
  vesselId: number
}

enum VesselCategoryLabel {
  PLA = 'Plaisance',
  PRO = 'Professionnel'
}

const UNKNOWN = '-'

export function VesselResume({ vesselId }: VesselResumeProps) {
  const dispatch = useAppDispatch()
  const { data: vessel } = useGetVesselQuery(vesselId)

  if (!vessel) {
    return null
  }
  const countryName = vessel.flag ? countries.getName(vessel.flag.substring(0, 2).toLowerCase(), 'fr') : UNKNOWN
  const nationalityName = vessel.ownerNationality
    ? countries.getName(vessel.ownerNationality.substring(0, 2).toLowerCase(), 'fr')
    : UNKNOWN

  return (
    <StyledMapMenuDialogContainer data-cy={`vessel-resume-${vessel.shipName}`}>
      <MapMenuDialog.Header>
        <MapMenuDialog.Title>
          <TitleWrapper>
            <Flag
              rel="preload"
              src={`/flags/${vessel.flag ? `${vessel.flag.substring(0, 2).toLowerCase()}.svg` : 'unknown.png'}`}
              title={countryName}
            />
            {vessel.shipName}
          </TitleWrapper>
        </MapMenuDialog.Title>
        <MapMenuDialog.CloseButton
          Icon={Icon.Close}
          onClick={() => {
            dispatch(vesselAction.setSelectedVesselId(undefined))
          }}
          title="Fermer la fiche navire"
        />
      </MapMenuDialog.Header>
      <MapMenuDialog.Body>
        <VesselIdentity>
          <dt>MMSI</dt>
          <dd>{vessel.mmsi ?? UNKNOWN}</dd>
          <dt>Immatriculation</dt>
          <dd>{vessel.immatriculation ?? UNKNOWN}</dd>
          <dt>IMO</dt>
          <dd>{vessel.imo ?? UNKNOWN}</dd>
          <dt>Quartier d&apos;immat.</dt>
          <dd>{vessel.portOfRegistry ?? UNKNOWN}</dd>
        </VesselIdentity>
        <VesselIdentity>
          <dt>Longueur</dt>
          <dd>{vessel.length ? `${vessel.length}m` : UNKNOWN}</dd>
          <dt>Pavillon</dt>
          <dd>{vessel.flag ? `${countryName} (${vessel.flag})` : UNKNOWN}</dd>
        </VesselIdentity>
        <VesselType>
          <dt>Catégorie</dt>
          <dd>{vessel.category ? VesselCategoryLabel[vessel.category] : UNKNOWN}</dd>
          <dt>Type</dt>
          <dd>{(vessel.category === 'PLA' ? vessel.leisureType : vessel.professionalType) ?? UNKNOWN}</dd>
          <dt>Désignation commerciale</dt>
          <dd>{vessel.commercialName ?? UNKNOWN}</dd>
        </VesselType>
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
            <dd>
              <p>{vessel.ownerPhone ?? UNKNOWN}</p>
              <p>{vessel.ownerEmail ?? UNKNOWN}</p>
            </dd>
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
      </MapMenuDialog.Body>
    </StyledMapMenuDialogContainer>
  )
}

const VesselIdentity = styled.dl`
  display: grid;
  grid-template-columns: 1fr 1fr 1.5fr 1.5fr;
  gap: 4px 8px;
  flex-wrap: wrap;
  background-color: ${p => p.theme.color.white};
  padding: 16px 20px;

  dt {
    color: ${p => p.theme.color.slateGray};
    font-weight: 400;
    margin: 0 0 auto 0;
  }

  dd {
    color: ${p => p.theme.color.gunMetal};
    font-weight: 500;
    margin: 0 0 auto 0;
  }
`

const VesselType = styled(VesselIdentity)`
  grid-template-columns: 1fr 1.5fr;
`

const TitleWrapper = styled.span`
  display: flex;
  gap: 8px;
  font-size: 22px;
`

const StyledMapMenuDialogContainer = styled(MapMenuDialog.Container)`
  display: flex;
  margin-left: -6px;
  position: absolute;
  top: 55px;
  right: 50px;
  width: 500px;
  max-height: calc(100% - 64px);
  overflow: auto;
  background-color: ${p => p.theme.color.gainsboro};
`
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
