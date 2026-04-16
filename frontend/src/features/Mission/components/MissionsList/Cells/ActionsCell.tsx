import { LocalizeCell } from '@components/Table/Cells/LocalizeCell'
import { editMissionInLocalStore } from '@features/Mission/useCases/editMissionInLocalStore'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import type { GeoJSON } from 'domain/types/GeoJSON'

export function ActionsCell({ geom, id }: { geom?: GeoJSON.MultiPolygon; id: number }) {
  const dispatch = useAppDispatch()
  const setMission = e => {
    e.stopPropagation()
    dispatch(editMissionInLocalStore(id, 'sideWindow'))
  }

  return (
    <Wrapper>
      <LocalizeCell geom={geom} />
      <StyledIconButton
        accent={Accent.TERTIARY}
        data-cy={`edit-mission-${id}`}
        Icon={Icon.Edit}
        onClick={setMission}
        title="Editer"
      />
    </Wrapper>
  )
}

const StyledIconButton = styled(IconButton)`
  padding: 0px;
`
const Wrapper = styled.div`
  display: flex;
  gap: 12px;
`
