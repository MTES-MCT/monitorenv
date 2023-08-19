import { Route, Routes } from 'react-router'
import styled from 'styled-components'

import { ControlUnitAdministrationForm } from '../features/BackOffice/ControlUnitAdministrationForm'
import { ControlUnitAdministrationList } from '../features/BackOffice/ControlUnitAdministrationList'
import { ControlUnitContactForm } from '../features/BackOffice/ControlUnitContactForm'
import { ControlUnitContactList } from '../features/BackOffice/ControlUnitContactList'
import { ControlUnitForm } from '../features/BackOffice/ControlUnitForm'
import { ControlUnitList } from '../features/BackOffice/ControlUnitList'
import { ControlUnitResourceForm } from '../features/BackOffice/ControlUnitResourceForm'
import { ControlUnitResourceList } from '../features/BackOffice/ControlUnitResourceList'
import { Menu } from '../features/BackOffice/Menu'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenu } from '../features/BackOffice/Menu/constants'
import { PortForm } from '../features/BackOffice/PortForm'
import { PortList } from '../features/BackOffice/PortList'

export function BackOfficePage() {
  return (
    <Wrapper>
      <Menu />

      <Body>
        <Routes>
          <Route
            element={<ControlUnitAdministrationList />}
            path={BACK_OFFICE_MENU_PATH[BackOfficeMenu.CONTROL_UNIT_ADMINISTRATION_LIST]}
          />
          <Route
            element={<ControlUnitAdministrationForm />}
            path={`${
              BACK_OFFICE_MENU_PATH[BackOfficeMenu.CONTROL_UNIT_ADMINISTRATION_LIST]
            }/:controlUnitAdministrationId`}
          />

          <Route
            element={<ControlUnitContactList />}
            path={BACK_OFFICE_MENU_PATH[BackOfficeMenu.CONTROL_UNIT_CONTACT_LIST]}
          />
          <Route
            element={<ControlUnitContactForm />}
            path={`${BACK_OFFICE_MENU_PATH[BackOfficeMenu.CONTROL_UNIT_CONTACT_LIST]}/:controlUnitContactId`}
          />

          <Route
            element={<ControlUnitResourceList />}
            path={BACK_OFFICE_MENU_PATH[BackOfficeMenu.CONTROL_UNIT_RESOURCE_LIST]}
          />
          <Route
            element={<ControlUnitResourceForm />}
            path={`${BACK_OFFICE_MENU_PATH[BackOfficeMenu.CONTROL_UNIT_RESOURCE_LIST]}/:controlUnitResourceId`}
          />

          <Route element={<ControlUnitList />} path={BACK_OFFICE_MENU_PATH[BackOfficeMenu.CONTROL_UNIT_LIST]} />
          <Route
            element={<ControlUnitForm />}
            path={`${BACK_OFFICE_MENU_PATH[BackOfficeMenu.CONTROL_UNIT_LIST]}/:controlUnitId`}
          />

          <Route element={<PortList />} path={BACK_OFFICE_MENU_PATH[BackOfficeMenu.PORT_LIST]} />
          <Route element={<PortForm />} path={`${BACK_OFFICE_MENU_PATH[BackOfficeMenu.PORT_LIST]}/:portId`} />
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
