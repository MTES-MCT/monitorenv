import { BannerStack } from '@features/BackOffice/components/BannerStack'
import { Notifier } from '@mtes-mct/monitor-ui'
import { Route, Routes } from 'react-router'
import { ToastContainer } from 'react-toastify'
import styled from 'styled-components'

import { AdministrationForm } from '../features/Administration/components/AdministrationForm'
import { AdministrationTable } from '../features/Administration/components/AdministrationTable'
import { BackOfficeMenu } from '../features/BackOffice/components/BackofficeMenu'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../features/BackOffice/components/BackofficeMenu/constants'
import { ControlUnitForm } from '../features/ControlUnit/components/ControlUnitForm'
import { ControlUnitTable } from '../features/ControlUnit/components/ControlUnitTable'
import { StationForm } from '../features/Station/components/StationForm'
import { BaseTable } from '../features/Station/components/StationTable'

export function BackOfficePage() {
  return (
    <Wrapper>
      <BackOfficeMenu />

      <Body>
        <BannerStack />
        <Routes>
          <Route element={<AdministrationTable />} path="/" />

          <Route element={<BaseTable />} path={BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.STATION_LIST]} />
          <Route
            element={<StationForm />}
            path={`${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.STATION_LIST]}/:stationId`}
          />

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
