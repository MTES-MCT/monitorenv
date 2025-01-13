import {
  Accent,
  Button,
  Icon,
  IconButton,
  Label,
  OPENLAYERS_PROJECTION,
  TextInput,
  WSG84_PROJECTION
} from '@mtes-mct/monitor-ui'
import { boundingExtent } from 'ol/extent'
import { transformExtent } from 'ol/proj'
import styled from 'styled-components'

import { OLGeometryType } from '../../../../../../domain/entities/map/constants'
import { setFitToExtent } from '../../../../../../domain/shared_slices/Map'
import { useAppDispatch } from '../../../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../../../hooks/useAppSelector'
import { formatCoordinates } from '../../../../../../utils/coordinates'

import type { Coordinate } from 'ol/coordinate'

export function Location({ geom }) {
  const { coordinatesFormat } = useAppSelector(state => state.map)
  const dispatch = useAppDispatch()
  const localizationText =
    geom.type === OLGeometryType.MULTIPOLYGON
      ? 'Polygone dessiné'
      : formatCoordinates(geom.coordinates[0], coordinatesFormat)

  const handleCenterOnMap = () => {
    const coordinatesToCenter: Coordinate[] =
      geom.type === OLGeometryType.MULTIPOLYGON ? geom.coordinates[0][0] : [geom.coordinates[0]]

    if (!coordinatesToCenter) {
      return
    }

    const extent = transformExtent(boundingExtent(coordinatesToCenter), WSG84_PROJECTION, OPENLAYERS_PROJECTION)
    dispatch(setFitToExtent(extent))
  }

  return (
    <div>
      <Label>Localisation</Label>
      <AddButtonsContainer>
        <Button accent={Accent.SECONDARY} disabled Icon={Icon.Plus} isFullWidth>
          Ajouter une zone
        </Button>
        <Button accent={Accent.SECONDARY} disabled Icon={Icon.Plus} isFullWidth>
          Ajouter un point
        </Button>
      </AddButtonsContainer>
      <GeomContainer>
        <ZoneWrapper>
          <TextInput isLabelHidden label="Zone" name="position" plaintext value={localizationText} />

          <Center onClick={() => handleCenterOnMap()}>
            <Icon.SelectRectangle />
            Centrer sur la carte
          </Center>
        </ZoneWrapper>

        <IconButtonsContainer>
          <IconButton accent={Accent.SECONDARY} disabled Icon={Icon.Edit} />
          <IconButton accent={Accent.SECONDARY} disabled Icon={Icon.Delete} />
        </IconButtonsContainer>
      </GeomContainer>
    </div>
  )
}

const AddButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 8px;
`

const GeomContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
  justify-content: space-between;
  padding-top: 8px;
`
const ZoneWrapper = styled.div`
  background-color: ${p => p.theme.color.white};
  display: flex;
  flex-grow: 1;
  font-size: 13px;
  justify-content: space-between;
  padding: 4px 8px 4px;
`

const Center = styled.div`
  cursor: pointer;
  display: flex;
  margin-left: auto;
  margin-right: 8px;
  color: ${p => p.theme.color.slateGray};
  text-decoration: underline;

  > .Element-IconBox {
    margin-right: 8px;
  }
`

const IconButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
`
