import { EnvironmentBox, getEnvironmentBorderStyle } from '@components/EnvironmentBox'
import { BannerStack } from '@features/BackOffice/components/BannerStack'
import { MissionTagTable } from '@features/MissionTags/components/Table'
import { RegulatoryAreaForm } from '@features/RegulatoryArea/components/RegulatoryAreaForm'
import { RegulatoryAreaList } from '@features/RegulatoryArea/components/RegulatoryAreaList'
import { TagTable } from '@features/Tags/components/Table'
import { getEnvironmentData } from '@utils/getEnvironmentData'
import { Route, Routes } from 'react-router'
import styled from 'styled-components'

import { AdministrationForm } from '../features/Administration/components/AdministrationForm'
import { AdministrationTable } from '../features/Administration/components/AdministrationTable'
import { BackOfficeMenu } from '../features/BackOffice/components/BackofficeMenu'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../features/BackOffice/components/BackofficeMenu/constants'
import { ControlUnitForm } from '../features/ControlUnit/components/ControlUnitForm'
import { ControlUnitTable } from '../features/ControlUnit/components/ControlUnitTable'
import { StationForm } from '../features/Station/components/StationForm'
import { BaseTable } from '../features/Station/components/StationTable'

const { isEnvironmentBoxVisible } = getEnvironmentData()

export function BackOfficePage() {
  return (
    <Wrapper $isEnvironmentBoxVisible={isEnvironmentBoxVisible}>
      <EnvironmentBox />
      <BackOfficeMenu />

      <>
        <BannerStack />
        <Routes>
          <Route element={<RegulatoryAreaList />} path="/" />
          <Route
            element={<RegulatoryAreaList />}
            path={BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.REGULATORY_AREA_LIST]}
          />
          <Route
            element={<RegulatoryAreaForm />}
            path={`${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.REGULATORY_AREA_LIST]}/:regulatoryAreaId`}
          />
          <Route
            element={<RegulatoryAreaForm />}
            path={`${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.REGULATORY_AREA_LIST]}/new`}
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

          <Route element={<BaseTable />} path={BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.STATION_LIST]} />
          <Route
            element={<StationForm />}
            path={`${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.STATION_LIST]}/:stationId`}
          />
          <Route element={<TagTable />} path={BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.TAG_LIST]} />
          <Route element={<MissionTagTable />} path={BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.MISSION_TAG_LIST]} />
        </Routes>
      </>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ $isEnvironmentBoxVisible: boolean }>`
  ${p => getEnvironmentBorderStyle(p.$isEnvironmentBoxVisible)}
  display: flex;
  height: 100%;
`
