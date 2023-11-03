import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { property, uniqBy } from 'lodash/fp'
import { createEmpty, extend } from 'ol/extent'
import { fromLonLat } from 'ol/proj'
import { useCallback } from 'react'
import styled from 'styled-components'

import { displayControlUnitResourcesFromControlUnit, displayBaseNamesFromControlUnit, addBufferToExtent } from './utils'
import { Layers } from '../../../../domain/entities/layers/constants'
import { globalActions } from '../../../../domain/shared_slices/Global'
import { mapActions } from '../../../../domain/shared_slices/Map'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { FrontendError } from '../../../../libs/FrontendError'
import { baseActions } from '../../../Base/slice'
import { controlUnitDialogActions } from '../ControlUnitDialog/slice'

import type { ControlUnit } from '../../../../domain/entities/controlUnit'

export type ItemProps = {
  controlUnit: ControlUnit.ControlUnit
}
export function Item({ controlUnit }: ItemProps) {
  const dispatch = useAppDispatch()
  const global = useAppSelector(store => store.global)

  const center = useCallback(() => {
    const highlightedBases = uniqBy(
      property('id'),
      controlUnit.controlUnitResources.map(({ base }) => base)
    )

    const highlightedBaseFeatureIds = highlightedBases.map(base => `${Layers.BASES.code}:${base.id}`)

    if (highlightedBases.length === 1) {
      const base = highlightedBases[0]
      if (!base) {
        throw new FrontendError('`base` is undefined.')
      }

      const baseCoordinate = fromLonLat([base.longitude, base.latitude])

      dispatch(mapActions.setZoomToCenter(baseCoordinate))
    } else {
      const highlightedBasesExtent = createEmpty()
      highlightedBases.forEach(base => {
        const baseCoordinate = fromLonLat([base.longitude, base.latitude])
        const baseExtent = [baseCoordinate[0], baseCoordinate[1], baseCoordinate[0], baseCoordinate[1]] as number[]

        extend(highlightedBasesExtent, baseExtent)
      })

      const bufferedHighlightedBasesExtent = addBufferToExtent(highlightedBasesExtent, 0.5)

      dispatch(mapActions.setFitToExtent(bufferedHighlightedBasesExtent))
    }

    dispatch(baseActions.hightlightFeatureIds(highlightedBaseFeatureIds))
  }, [controlUnit.controlUnitResources, dispatch])

  const edit = useCallback(() => {
    dispatch(controlUnitDialogActions.setControlUnitId(controlUnit.id))
    dispatch(
      globalActions.setDisplayedItems({
        isControlUnitDialogVisible: true,
        isControlUnitListDialogVisible: false
      })
    )
  }, [controlUnit.id, dispatch])

  return (
    <Wrapper data-cy="ControlUnitListDialog-control-unit" data-id={controlUnit.id} onClick={edit}>
      <Head>
        <NameText>{controlUnit.name}</NameText>
        {global.displayBaseLayer && (
          <IconButton
            accent={Accent.TERTIARY}
            disabled={!controlUnit.controlUnitResources.length}
            Icon={Icon.FocusZones}
            iconSize={18}
            isCompact
            onClick={center}
            withUnpropagatedClick
          />
        )}
      </Head>
      <AdministrationText>{controlUnit.administration.name}</AdministrationText>
      <ResourcesAndPortsText>{displayControlUnitResourcesFromControlUnit(controlUnit)}</ResourcesAndPortsText>
      <ResourcesAndPortsText>{displayBaseNamesFromControlUnit(controlUnit)}</ResourcesAndPortsText>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background-color: ${p => p.theme.color.gainsboro};
  cursor: pointer;
  margin-top: 8px;
  padding: 8px 8px 8px 12px;

  &:hover {
    background-color: ${p => p.theme.color.lightGray};
  }
`

const Head = styled.div`
  display: flex;
  justify-content: space-between;
`

const NameText = styled.div`
  color: ${p => p.theme.color.gunMetal};
  font-weight: bold;
  line-height: 18px;
`

const AdministrationText = styled.div`
  color: ${p => p.theme.color.gunMetal};
  line-height: 18px;
  margin: 2px 0 8px;
`

const ResourcesAndPortsText = styled.div`
  color: ${p => p.theme.color.slateGray};
  line-height: 18px;
`
