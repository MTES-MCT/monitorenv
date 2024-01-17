import { Accent, Button, Icon, MapMenuDialog } from '@mtes-mct/monitor-ui'
import { Formik } from 'formik'
import { noop } from 'lodash/fp'
import { useCallback } from 'react'
import styled from 'styled-components'

import { AreaNote } from './AreaNote'
import { ControlUnitContactList } from './ControlUnitContactList'
import { ControlUnitResourceList } from './ControlUnitResourceList'
import { RTK_DEFAULT_QUERY_OPTIONS } from '../../../../api/constants'
import { useGetControlUnitQuery, useUpdateControlUnitMutation } from '../../../../api/controlUnitsAPI'
import { globalActions } from '../../../../domain/shared_slices/Global'
import { addMission } from '../../../../domain/use_cases/missions/addMission'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { FrontendError } from '../../../../libs/FrontendError'

export function ControlUnitDialog() {
  const dispatch = useAppDispatch()
  const mapControlUnitDialog = useAppSelector(store => store.mapControlUnitDialog)
  if (!mapControlUnitDialog.controlUnitId) {
    throw new FrontendError('`mapControlUnitDialog.controlUnitId` is undefined.')
  }

  const { data: controlUnit } = useGetControlUnitQuery(mapControlUnitDialog.controlUnitId, RTK_DEFAULT_QUERY_OPTIONS)
  const [updateControlUnit] = useUpdateControlUnitMutation()

  const openNewMission = useCallback(() => {
    dispatch(addMission({ initialControlUnit: controlUnit }))
  }, [controlUnit, dispatch])

  const close = useCallback(() => {
    dispatch(
      globalActions.setDisplayedItems({
        isControlUnitDialogVisible: false
      })
    )
  }, [dispatch])

  if (!controlUnit) {
    return (
      <MapMenuDialog.Container>
        <MapMenuDialog.Header>
          <MapMenuDialog.Title>Chargement en cours...</MapMenuDialog.Title>
          <MapMenuDialog.CloseButton Icon={Icon.Close} onClick={close} />
        </MapMenuDialog.Header>
      </MapMenuDialog.Container>
    )
  }

  return (
    <Wrapper>
      <MapMenuDialog.Header>
        <MapMenuDialog.Title title={`${controlUnit.name} (${controlUnit.administration.name})`}>
          <b>{controlUnit.name}</b> ({controlUnit.administration.name})
        </MapMenuDialog.Title>
        <MapMenuDialog.CloseButton Icon={Icon.Close} onClick={close} />
      </MapMenuDialog.Header>
      <Formik initialValues={controlUnit} onSubmit={noop}>
        <StyledMapMenuDialogBody>
          <Button accent={Accent.SECONDARY} Icon={Icon.Plus} isFullWidth onClick={openNewMission}>
            Créer une mission avec cette unité
          </Button>
          <ControlUnitContactList controlUnit={controlUnit} onSubmit={updateControlUnit} />
          <ControlUnitResourceList controlUnit={controlUnit} />
          <AreaNote controlUnit={controlUnit} onSubmit={updateControlUnit} />
        </StyledMapMenuDialogBody>
      </Formik>
    </Wrapper>
  )
}

const Wrapper = styled(MapMenuDialog.Container)`
  bottom: 10px;
  max-height: none;
  position: absolute;
  right: 50px;
  top: 10px;
  z-index: 2;
  width: 500px;
`

const StyledMapMenuDialogBody = styled(MapMenuDialog.Body)`
  background-color: ${p => p.theme.color.gainsboro};

  > div:not(:first-child) {
    margin-top: 12px;
  }
`
