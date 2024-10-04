import { useGetAdministrationsQuery } from '@api/administrationsAPI'
import { RTK_DEFAULT_QUERY_OPTIONS } from '@api/constants'
import { useGetStationsQuery } from '@api/stationsAPI'
import { getFilters } from '@features/ControlUnit/utils'
import { dashboardActions } from '@features/Dashboard/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import {
  ControlUnit,
  getOptionsFromIdAndName,
  getOptionsFromLabelledEnum,
  Icon,
  Select,
  TextInput
} from '@mtes-mct/monitor-ui'
import { isNotArchived } from '@utils/isNotArchived'
import { useMemo } from 'react'
import styled from 'styled-components'

import { Item } from './Item'
import { SelectedControlUnits } from './SelectedControlUnits'
import { Accordion } from '../Accordion'

type ControlUnitsProps = {
  controlUnits: ControlUnit.ControlUnit[]
  isExpanded: boolean
  isSelectedAccordionOpen: boolean
  setExpandedAccordion: () => void
}

export function ControlUnits({
  controlUnits,
  isExpanded,
  isSelectedAccordionOpen,
  setExpandedAccordion
}: ControlUnitsProps) {
  const dispatch = useAppDispatch()

  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)
  const filters = useAppSelector(state =>
    activeDashboardId ? state.dashboard.dashboards?.[activeDashboardId]?.controlUnitFilters : {}
  )

  const controlUnitResults = useMemo(() => {
    if (!controlUnits) {
      return undefined
    }

    const results = getFilters(controlUnits, filters ?? {}, 'DASHBOARD_CONTROL_UNIT_LIST')

    return results.reduce((previousControlUnits, filter) => filter(previousControlUnits), controlUnits)
  }, [controlUnits, filters])

  const { data: administrations } = useGetAdministrationsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)
  const { data: bases } = useGetStationsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)

  const administrationsAsOptions = useMemo(
    () => getOptionsFromIdAndName((administrations ?? []).filter(isNotArchived)),
    [administrations]
  )
  const basesAsOptions = useMemo(() => getOptionsFromIdAndName(bases), [bases])
  const typesAsOptions = useMemo(() => getOptionsFromLabelledEnum(ControlUnit.ControlUnitResourceTypeLabel), [])

  const updateQuery = (nextValue: string | undefined) => {
    dispatch(dashboardActions.setControlUnitsFilters({ key: 'query', value: nextValue }))
  }

  const updateAdministrationId = (nextValue: number | undefined) => {
    dispatch(dashboardActions.setControlUnitsFilters({ key: 'administrationId', value: nextValue }))
  }

  const updateBaseId = (nextValue: number | undefined) => {
    dispatch(dashboardActions.setControlUnitsFilters({ key: 'stationId', value: nextValue }))
  }

  const updateType = (nextValue: string | undefined) => {
    dispatch(dashboardActions.setControlUnitsFilters({ key: 'type', value: nextValue }))
  }

  return (
    <div>
      <Accordion isExpanded={isExpanded} setExpandedAccordion={setExpandedAccordion} title="Unités">
        <Wrapper>
          <StyledTextInput
            Icon={Icon.Search}
            isLabelHidden
            isTransparent
            label="Rechercher une unité"
            name="query"
            onChange={updateQuery}
            placeholder="Rechercher une unité"
            value={filters?.query}
          />
          <SelectFilters>
            <Select
              isLabelHidden
              isTransparent
              label="Administration"
              name="administrationId"
              onChange={updateAdministrationId}
              options={administrationsAsOptions ?? []}
              placeholder="Administration"
              searchable
              style={{ flex: 1 }}
              value={filters?.administrationId}
            />
            <Select
              isLabelHidden
              isTransparent
              label="Type de moyen"
              name="type"
              onChange={updateType}
              options={typesAsOptions}
              placeholder="Type de moyen"
              searchable
              style={{ flex: 1 }}
              value={filters?.type}
            />
            <Select
              isLabelHidden
              isTransparent
              label="Base du moyen"
              name="stationId"
              onChange={updateBaseId}
              options={basesAsOptions ?? []}
              placeholder="Base du moyen"
              searchable
              style={{ flex: 1 }}
              value={filters?.stationId}
            />
          </SelectFilters>
          <ResultList>
            {controlUnitResults &&
              controlUnitResults.map(controlUnit => <Item key={controlUnit.id} controlUnit={controlUnit} />)}
          </ResultList>
        </Wrapper>
      </Accordion>
      <SelectedControlUnits controlUnits={controlUnits} isSelectedAccordionOpen={isSelectedAccordionOpen} />
    </div>
  )
}

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 24px;
`

const StyledTextInput = styled(TextInput)`
  width: 100%;
`

const SelectFilters = styled.span`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
  width: 100%;
`
const ResultList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  list-style-type: none;
  padding: 0px;
  width: 100%;
`
