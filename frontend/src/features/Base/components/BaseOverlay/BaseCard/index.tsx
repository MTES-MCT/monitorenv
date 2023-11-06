import { MapMenuDialog } from '@mtes-mct/monitor-ui'
import { uniq } from 'lodash/fp'
import { useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'

import { Item } from './Item'
import { controlUnitsAPI } from '../../../../../api/controlUnitsAPI'
import { OverlayCard } from '../../../../../components/OverlayCard'
import { useAppDispatch } from '../../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../../hooks/useAppSelector'
import { FrontendError } from '../../../../../libs/FrontendError'
import { baseActions } from '../../../slice'

import type { Base } from '../../../../../domain/entities/base'
import type { ControlUnit } from '../../../../../domain/entities/controlUnit'
import type { Feature } from 'ol'

export function BaseCard({ feature, selected = false }: { feature: Feature; selected?: boolean }) {
  const controlUnitsRef = useRef<ControlUnit.ControlUnit[]>([])

  const dispatch = useAppDispatch()
  const global = useAppSelector(state => state.global)

  const featureProperties = feature.getProperties() as {
    base: Base.Base
  }

  const close = useCallback(() => {
    dispatch(baseActions.hightlightFeatureIds([]))
    dispatch(baseActions.selectBaseFeatureId(undefined))
  }, [dispatch])

  const updateControlUnits = useCallback(async () => {
    if (!featureProperties.base || !featureProperties.base.controlUnitResources) {
      controlUnitsRef.current = []

      return
    }

    const controlUnitIds = uniq(
      featureProperties.base.controlUnitResources.map(controlUnitResource => controlUnitResource.controlUnitId)
    )

    controlUnitsRef.current = await Promise.all(
      controlUnitIds.map(async controlUnitResourceId => {
        const { data: controlUnit } = await dispatch(
          controlUnitsAPI.endpoints.getControlUnit.initiate(controlUnitResourceId)
        )
        if (!controlUnit) {
          throw new FrontendError('`controlUnit` is undefined.')
        }

        return controlUnit
      })
    )
  }, [dispatch, featureProperties.base])

  useEffect(() => {
    updateControlUnits()
  }, [updateControlUnits])

  if (!global.displayBaseLayer || !featureProperties.base) {
    return null
  }

  return (
    <OverlayCard
      data-cy="BaseOverlay-card"
      isCloseButtonHidden={!selected}
      onClose={close}
      title={featureProperties.base.name}
    >
      <StyledMapMenuDialogBody>
        {controlUnitsRef.current.map(controlUnit => (
          <Item key={controlUnit.id} controlUnit={controlUnit} />
        ))}
      </StyledMapMenuDialogBody>
    </OverlayCard>
  )
}

const StyledMapMenuDialogBody = styled(MapMenuDialog.Body)`
  height: 480px;

  > div:not(:first-child) {
    margin-top: 8px;
  }
`
