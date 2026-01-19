import { EnvBannerStack } from '@components/BannerStack/EnvBannerStack'
import { BannerStack } from '@features/BackOffice/components/BannerStack'
import { backOfficeActions } from '@features/BackOffice/slice'
import { addBackOfficeBanner } from '@features/BackOffice/useCases/addBackOfficeBanner'
import { RegulatoryAreaForm } from '@features/RegulatoryArea/components/RegulatoryAreaForm'
import { RegulatoryAreaList } from '@features/RegulatoryArea/components/RegulatoryAreaList'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useEffect } from 'react'
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

import type { Environment } from 'types'

const environment = import.meta.env.FRONTEND_SENTRY_ENV as Environment

export function BackOfficePage() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    let bannerId: number
    if (environment === 'integration' || environment === 'preprod') {
      bannerId = dispatch(addBackOfficeBanner(EnvBannerStack.Props))
    }

    return () => {
      if (bannerId) {
        dispatch(backOfficeActions.removeBanner(bannerId))
      }
    }
  }, [dispatch])

  return (
    <Wrapper>
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
        </Routes>
      </>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  height: 100%;
`
