import { editDashboardArea } from '@features/Dashboard/useCases/editDashboardArea'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { forwardRef } from 'react'
import styled from 'styled-components'

import { EditArea } from './EditArea'
import { DashboardFilters } from './Filters'

import type { DashboardType } from '@features/Dashboard/slice'
import type { GeoJSON } from 'domain/types/GeoJSON'

type ToolbarProps = {
  dashboardForm: [string, DashboardType]
  geometry: GeoJSON.Geometry | undefined
}

export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(
  ({ dashboardForm: [key, dashboard], geometry }, ref) => {
    const dispatch = useAppDispatch()

    return (
      <Wrapper ref={ref}>
        <EditArea
          geometry={geometry}
          onValidate={geometryToSave => {
            dispatch(editDashboardArea(geometryToSave, key))
          }}
        />
        <DashboardFilters dashboard={dashboard} />
      </Wrapper>
    )
  }
)

const Wrapper = styled.div`
  background-color: ${p => p.theme.color.white};
  box-shadow: 0pc 3px 6px #00000029;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px 24px;
  align-items: center;
`
