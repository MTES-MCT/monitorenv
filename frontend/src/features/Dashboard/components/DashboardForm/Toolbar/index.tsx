import { editDashboardArea } from '@features/Dashboard/useCases/editDashboardArea'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { forwardRef } from 'react'
import styled from 'styled-components'

import { EditArea } from './EditArea'
import { DashboardFilters } from './Filters'
import { FiltersTags } from './Filters/FiltersTags'

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
        <FirstLine>
          <EditArea
            dashboardKey={key}
            geometry={geometry}
            onValidate={geometryToSave => {
              dispatch(editDashboardArea(geometryToSave, key))
            }}
          />
          <DashboardFilters dashboard={dashboard} />
        </FirstLine>

        <FiltersTags dashboard={dashboard} />
      </Wrapper>
    )
  }
)

const Wrapper = styled.div`
  background-color: ${p => p.theme.color.white};
  box-shadow: 0pc 3px 6px #00000029;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px 24px;
`
const FirstLine = styled.div`
  display: flex;
  gap: 16px;
  justify-content: space-between;
`
