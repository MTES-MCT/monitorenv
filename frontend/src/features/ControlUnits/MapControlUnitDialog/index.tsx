import { Icon, MapMenuDialog } from '@mtes-mct/monitor-ui'
import { Formik } from 'formik'
import { noop } from 'lodash/fp'
import { useCallback } from 'react'
import styled from 'styled-components'

import { AreaNote } from './AreaNote'
import { ControlUnitContactList } from './ControlUnitContactList'
import { ControlUnitResourceList } from './ControlUnitResourceList'
import { useGetControlUnitQuery } from '../../../api/controlUnitsAPI'
import { globalActions } from '../../../domain/shared_slices/Global'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { FrontendError } from '../../../libs/FrontendError'

export function MapControlUnitDialog() {
  const dispatch = useAppDispatch()
  const mapControlUnitDialog = useAppSelector(store => store.mapControlUnitDialog)
  if (!mapControlUnitDialog.controlUnitId) {
    throw new FrontendError('`mapControlUnitDialog.controlUnitId` is undefined.')
  }

  const { data: controlUnit } = useGetControlUnitQuery(mapControlUnitDialog.controlUnitId)

  const close = useCallback(() => {
    dispatch(
      globalActions.setDisplayedItems({
        isControlUnitListDialogVisible: false
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
        <MapMenuDialog.Title>
          <b>{controlUnit.name}</b> ({controlUnit.administration.name})
        </MapMenuDialog.Title>
        <MapMenuDialog.CloseButton Icon={Icon.Close} onClick={close} />
      </MapMenuDialog.Header>
      <Formik initialValues={controlUnit} onSubmit={noop}>
        <StyledMapMenuDialogBody>
          <ControlUnitContactList controlUnitContacts={controlUnit.controlUnitContacts} />
          <ControlUnitResourceList controlUnitResources={controlUnit.controlUnitResources} />
          <AreaNote />
        </StyledMapMenuDialogBody>
      </Formik>
    </Wrapper>
  )
}

const Wrapper = styled(MapMenuDialog.Container)`
  height: 640px;
  max-height: 640px;
  position: absolute;
  right: 12px;
  top: 12px;
  z-index: 2;
  width: 500px;
`

const StyledMapMenuDialogBody = styled(MapMenuDialog.Body)`
  background-color: ${p => p.theme.color.gainsboro};

  > div:not(:first-child) {
    margin-top: 12px;
  }
`
