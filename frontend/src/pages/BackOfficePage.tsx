import { BannerStack } from '@features/BackOffice/components/BannerStack'
import { addBackOfficeBanner } from '@features/BackOffice/useCases/addBackOfficeBanner'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { shouldDisplayEnvBanner } from '@utils/shouldDisplayEnvBanner'
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
  const bannerStack = useAppSelector(state => state.backOffice.bannerStack)

  useEffect(() => {
    if (environment === 'integration' || environment === 'preprod') {
      const bannerProps = shouldDisplayEnvBanner(bannerStack)

      if (!bannerProps) {
        return
      }
      dispatch(addBackOfficeBanner(bannerProps))
    }
    // just want to run this once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
