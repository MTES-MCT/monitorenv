import { Accent, Button, Icon, IconButton, Label, TextInput } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { OLGeometryType } from '../../../../../domain/entities/map/constants'
import { useAppSelector } from '../../../../../hooks/useAppSelector'
import { formatCoordinates } from '../../../../../utils/coordinates'

export function Localization({ geom }) {
  const { coordinatesFormat } = useAppSelector(state => state.map)
  const localizationText =
    geom.type === OLGeometryType.MULTIPOLYGON
      ? 'Polygone dessiné'
      : formatCoordinates(geom.coordinates[0], coordinatesFormat)

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
        <TextInput isLabelHidden label="Zone" name="position" plaintext value={localizationText} />
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
const IconButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
`
