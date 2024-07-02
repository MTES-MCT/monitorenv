import { Accent, Button, ControlUnit, Icon, MapMenuDialog } from '@mtes-mct/monitor-ui'
import { Formik } from 'formik'
import { omit } from 'lodash'
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
import { mainWindowActions } from '../../../MainWindow/slice'

export function ControlUnitDialog() {
  const dispatch = useAppDispatch()
  const isRightMenuOpened = useAppSelector(store => store.mainWindow.isRightMenuOpened)
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
    dispatch(mainWindowActions.setHasFullHeightRightDialogOpen(false))
  }, [dispatch])

  const update = useCallback(
    async nextControlUnit => {
      const valuesToSave = omit(nextControlUnit, [
        'administration',
        'coordinates',
        'controlUnitResourceIds',
        'controlUnitResources',
        'controlUnitContactIds',
        'controlUnitContacts',
        'departmentArea'
      ]) as ControlUnit.ControlUnitData

      await updateControlUnit(valuesToSave)
    },
    [updateControlUnit]
  )

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
    <Wrapper $isRightMenuOpened={isRightMenuOpened}>
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
          <ControlUnitContactList controlUnit={controlUnit} onSubmit={update} />
          <ControlUnitResourceList controlUnit={controlUnit} />
          <AreaNote controlUnit={controlUnit} onSubmit={update} />
        </StyledMapMenuDialogBody>
      </Formik>
    </Wrapper>
  )
}

// TODO This wrapper should be a shared Env `<FullHeightMapRightDialog />` component to avoid logical + styling repetition.
const Wrapper = styled(MapMenuDialog.Container)<{
  $isRightMenuOpened: boolean
}>`
  bottom: 0;
  /* TODO Remove margin in monitor-ui. */
  margin: 0;
  max-height: 100%;
  height: fit-content;
  position: absolute;
  right: ${p => (p.$isRightMenuOpened ? 56 : 8)}px;
  top: 0;
  transition: right 0.5s ease-out, top 0.5s ease-out;
  width: 500px;
  z-index: 2;
`

const StyledMapMenuDialogBody = styled(MapMenuDialog.Body)`
  background-color: ${p => p.theme.color.gainsboro};

  > div:not(:first-child) {
    margin-top: 12px;
  }
`
