import { addMainWindowBanner } from '@features/MainWindow/useCases/addMainWindowBanner'
import { VesselIdentity } from '@features/Vessel/components/VesselResume/styles'
import { UNKNOWN } from '@features/Vessel/components/VesselResume/utils'
import { Vessel } from '@features/Vessel/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, customDayjs, Icon, IconButton, Level } from '@mtes-mct/monitor-ui'
import { formatCoordinates, formatCoordinatesAsText } from '@utils/coordinates'
import { getDateAsLocalizedStringVeryCompact } from '@utils/getDateAsLocalizedString'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'

import type { Coordinate } from 'ol/coordinate'

type PositionContext = 'HOVERED_OVERLAY' | 'RESUME' | 'CLICKED_OVERLAY'
type LastPositionProps = {
  context?: PositionContext
  lastPosition: Vessel.Position
}

export function LastPosition({ context = 'RESUME', lastPosition }: LastPositionProps) {
  const dispatch = useAppDispatch()
  const coordinatesFormat = useAppSelector(state => state.map.coordinatesFormat)

  const displayedDate = useMemo(() => {
    if (!lastPosition?.timestamp) {
      return UNKNOWN
    }

    const date =
      context === 'RESUME'
        ? customDayjs(lastPosition?.timestamp).fromNow(true)
        : getDateAsLocalizedStringVeryCompact(lastPosition?.timestamp, false, true)

    return (
      <>
        <dt>{context === 'RESUME' ? 'Dernier signal' : 'Signal'}</dt>
        <dd>{date}</dd>
      </>
    )
  }, [lastPosition?.timestamp, context])

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
    <Wrapper $context={context}>
      <LastPositionIdentity>
        <dt>Latitude</dt>
        <dd>{latitude ?? UNKNOWN}</dd>
        <dt>Longitude</dt>
        <dd>{longitude ?? UNKNOWN}</dd>
        {context !== 'HOVERED_OVERLAY' && (
          <CopyCoordinates
            accent={Accent.TERTIARY}
            Icon={Icon.Copy}
            onClick={copyCoordinates}
            title="Copier les coordonnées"
          />
        )}
      </LastPositionIdentity>
      <LastPositionIdentity>
        <dt>Vitesse</dt>
        <dd>{lastPosition?.speed ? `${lastPosition?.speed} Nds` : UNKNOWN}</dd>
        {displayedDate}
      </LastPositionIdentity>
      {context === 'RESUME' && (
        <LastPositionIdentity>
          <dt>Port d&apos;arrivée</dt>
          <dd>{lastPosition?.destination ?? UNKNOWN}</dd>
        </LastPositionIdentity>
      )}
    </Wrapper>
  )
}

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

const Wrapper = styled.div<{ $context: PositionContext }>`
  display: grid;
  grid-template-columns: ${({ $context }) => ($context === 'RESUME' ? '8fr 7fr 9fr' : '4fr 5fr')};
  gap: ${({ $context }) => ($context === 'RESUME' ? '8px' : '5px')};

  ${LastPositionIdentity} {
    padding: ${({ $context }) => ($context === 'RESUME' ? '16px 20px' : '10px')};
  }
`

const CopyCoordinates = styled(IconButton)`
  position: absolute;
  top: 5px;
  right: 0;
  color: ${({ theme }) => theme.color.lightGray};
`
