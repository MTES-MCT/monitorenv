import { Notifier } from '@mtes-mct/monitor-ui'
import { Route, Routes } from 'react-router'
import { ToastContainer } from 'react-toastify'
import styled from 'styled-components'

import { AdministrationForm } from '../features/Administration/components/AdministrationForm'
import { AdministrationTable } from '../features/Administration/components/AdministrationTable'
import { BackOfficeMenu } from '../features/BackOffice/components/BackofficeMenu'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../features/BackOffice/components/BackofficeMenu/constants'
import { BaseForm } from '../features/Base/components/BaseForm'
import { BaseTable } from '../features/Base/components/BaseTable'
import { ControlUnitForm } from '../features/ControlUnit/components/ControlUnitForm'
import { ControlUnitTable } from '../features/ControlUnit/components/ControlUnitTable'

export function BackOfficePage() {
  return (
    <Wrapper>
      <BackOfficeMenu />

      <Body>
        <Routes>
          <Route element={<AdministrationTable />} path="/" />

          <Route element={<BaseTable />} path={BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.BASE_LIST]} />
          <Route element={<BaseForm />} path={`${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.BASE_LIST]}/:baseId`} />

          <Route
            element={<AdministrationTable />}
            path={BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.ADMINISTRATION_LIST]}
          />
          <Route
            element={<AdministrationForm />}
            path={`${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.ADMINISTRATION_LIST]}/:administrationId`}
          />

          <Route element={<ControlUnitTable />} path={BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.CONTROL_UNIT_LIST]} />
          <Route
            element={<ControlUnitForm />}
            path={`${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.CONTROL_UNIT_LIST]}/:controlUnitId`}
          />
        </Routes>
      </Body>

      <ToastContainer />
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
