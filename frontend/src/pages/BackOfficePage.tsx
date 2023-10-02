import { Notifier } from '@mtes-mct/monitor-ui'
import { Route, Routes } from 'react-router'
import styled from 'styled-components'

import { BackOfficeAdministrationForm } from '../features/Administrations/BackOfficeAdministrationForm'
import { BackOfficeAdministrationList } from '../features/Administrations/BackOfficeAdministrationList'
import { ConfirmationModal } from '../features/BackOffice/components/ConfirmationModal'
import { Dialog } from '../features/BackOffice/components/Dialog'
import { BackOfficeMenu } from '../features/BackOfficeMenu'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../features/BackOfficeMenu/constants'
import { BackOfficeBaseForm } from '../features/Bases/BackOfficeBaseForm'
import { BackOfficeBaseList } from '../features/Bases/BackOfficeBaseList'
import { BackOfficeControlUnitForm } from '../features/ControlUnits/BackOfficeControlUnitForm'
import { BackOfficeControlUnitList } from '../features/ControlUnits/BackOfficeControlUnitList'
import { useAppSelector } from '../hooks/useAppSelector'

export function BackOfficePage() {
  const backOffice = useAppSelector(store => store.backOffice)

  return (
    <Wrapper>
      <BackOfficeMenu />

      <Body>
        <Routes>
          <Route element={<BackOfficeAdministrationList />} path="/" />

          <Route element={<BackOfficeBaseList />} path={BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.BASE_LIST]} />
          <Route
            element={<BackOfficeBaseForm />}
            path={`${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.BASE_LIST]}/:baseId`}
          />

          <Route
            element={<BackOfficeAdministrationList />}
            path={BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.ADMINISTRATION_LIST]}
          />
          <Route
            element={<BackOfficeAdministrationForm />}
            path={`${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.ADMINISTRATION_LIST]}/:administrationId`}
          />

          <Route
            element={<BackOfficeControlUnitList />}
            path={BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.CONTROL_UNIT_LIST]}
          />
          <Route
            element={<BackOfficeControlUnitForm />}
            path={`${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.CONTROL_UNIT_LIST]}/:controlUnitId`}
          />
        </Routes>
      </Body>

      {backOffice.isConfirmationModalOpen && <ConfirmationModal />}
      {backOffice.isDialogOpen && <Dialog />}

      <Notifier />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  height: 100%;
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  padding: 24px;
  overflow-y: auto;
`
