import { Route, Routes } from 'react-router'
import styled from 'styled-components'

import { BackOfficeMenu } from '../features/BackOfficeMenu'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../features/BackOfficeMenu/constants'
import { BackOfficeControlUnitAdministrationForm } from '../features/ControlUnit/BackOfficeControlUnitAdministrationForm'
import { BackOfficeControlUnitAdministrationList } from '../features/ControlUnit/BackOfficeControlUnitAdministrationList'
import { BackOfficeControlUnitForm } from '../features/ControlUnit/BackOfficeControlUnitForm'
import { BackOfficeControlUnitList } from '../features/ControlUnit/BackOfficeControlUnitList'
import { BackOfficePortForm } from '../features/Port/BackOfficePortForm'
import { BackOfficePortList } from '../features/Port/BackOfficePortList'

export function BackOfficePage() {
  return (
    <Wrapper>
      <BackOfficeMenu />

      <Body>
        <Routes>
          <Route element={<BackOfficeControlUnitAdministrationList />} path="/" />

          <Route
            element={<BackOfficeControlUnitAdministrationList />}
            path={BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.CONTROL_UNIT_ADMINISTRATION_LIST]}
          />
          <Route
            element={<BackOfficeControlUnitAdministrationForm />}
            path={`${
              BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.CONTROL_UNIT_ADMINISTRATION_LIST]
            }/:controlUnitAdministrationId`}
          />

          <Route
            element={<BackOfficeControlUnitList />}
            path={BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.CONTROL_UNIT_LIST]}
          />
          <Route
            element={<BackOfficeControlUnitForm />}
            path={`${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.CONTROL_UNIT_LIST]}/:controlUnitId`}
          />

          <Route element={<BackOfficePortList />} path={BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.PORT_LIST]} />
          <Route
            element={<BackOfficePortForm />}
            path={`${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.PORT_LIST]}/:portId`}
          />
        </Routes>
      </Body>
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
