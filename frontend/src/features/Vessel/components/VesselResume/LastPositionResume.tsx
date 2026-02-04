import { addMainWindowBanner } from '@features/MainWindow/useCases/addMainWindowBanner'
import { VesselIdentity } from '@features/Vessel/components/VesselResume/styles'
import { Vessel } from '@features/Vessel/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, customDayjs, Icon, IconButton, Level } from '@mtes-mct/monitor-ui'
import { formatCoordinates, formatCoordinatesAsText } from '@utils/coordinates'
import { useCallback } from 'react'
import styled from 'styled-components'

import { UNKNOWN } from '.'

import type { Coordinate } from 'ol/coordinate'

type SummaryProps = {
  lastPositions: Vessel.LastPosition[]
}

export function LastPositionResume({ lastPositions }: SummaryProps) {
  const dispatch = useAppDispatch()
  const coordinatesFormat = useAppSelector(state => state.map.coordinatesFormat)

  const lastPosition = lastPositions[0]

  const diff = customDayjs(lastPosition?.timestamp).fromNow(true)

  const [latitude, longitude] = formatCoordinates(lastPosition?.geom?.coordinates, coordinatesFormat)

  const copyCoordinates = useCallback(() => {
    if (!lastPosition?.geom?.coordinates) {
      return
    }
    const formattedText = formatCoordinatesAsText(lastPosition.geom?.coordinates as Coordinate, coordinatesFormat)
    navigator.clipboard
      .writeText(formattedText)
      .then(() => {
        const bannerProps = {
          children: 'Coordonnées du navire copiées dans le presse papier',
          isClosable: true,
          isFixed: true,
          level: Level.SUCCESS,
          withAutomaticClosing: true
        }

        return dispatch(addMainWindowBanner(bannerProps))
      })
      .catch(() => {
        const errorBannerProps = {
          children: "Les coordonnées du navire n'ont pas pu être copiés dans le presse papier",
          isClosable: true,
          isFixed: true,
          level: Level.ERROR,
          withAutomaticClosing: true
        }

        return dispatch(addMainWindowBanner(errorBannerProps))
      })
  }, [coordinatesFormat, dispatch, lastPosition?.geom?.coordinates])

  return (
    <Wrapper>
      <LastPositionIdentity>
        <dt>Latitude</dt>
        <dd>{latitude ?? UNKNOWN}</dd>
        <dt>Longitude</dt>
        <dd>{longitude ?? UNKNOWN}</dd>
        <CopyCoordinates
          accent={Accent.TERTIARY}
          Icon={Icon.Copy}
          onClick={copyCoordinates}
          title="Copier les coordonnées"
        />
      </LastPositionIdentity>
      <LastPositionIdentity>
        <dt>Vitesse</dt>
        <dd>{lastPosition?.speed ? `${lastPosition?.speed} Nds` : UNKNOWN}</dd>
        <dt>Dernier signal</dt>
        <dd>{lastPosition?.timestamp ? diff : UNKNOWN}</dd>
      </LastPositionIdentity>
      <LastPositionIdentity>
        <dt>Port d&apos;arrivée</dt>
        <dd>{lastPosition?.destination ?? UNKNOWN}</dd>
      </LastPositionIdentity>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 8fr 7fr 9fr;
  gap: 10px;
`
const LastPositionIdentity = styled(VesselIdentity)`
  align-items: center;
  display: flex;
  flex-direction: column;
  grid-template-columns: none;
  justify-content: center;
  position: relative;

  dd:not(:last-of-type) {
    margin-bottom: 12px;
  }
`

const CopyCoordinates = styled(IconButton)`
  position: absolute;
  top: 5px;
  right: 0;
  color: ${({ theme }) => theme.color.lightGray};
`
