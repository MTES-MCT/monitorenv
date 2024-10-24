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

  const hasChildren = !!(controlUnitResults && controlUnitResults?.length > 5)

  return (
    <div>
      <Accordion isExpanded={isExpanded} setExpandedAccordion={setExpandedAccordion} title="Unités">
        <Wrapper $hasChildren={hasChildren}>
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
          <SelectFilters $hasChildren={hasChildren} $isExpanded={isExpanded}>
            <StyledSelect
              isLabelHidden
              isTransparent
              label="Administration"
              menuStyle={{ width: '300px' }}
              name="administrationId"
              onChange={updateAdministrationId as any}
              options={administrationsAsOptions ?? []}
              placeholder="Administration"
              searchable
              value={filters?.administrationId}
            />
            <StyledSelect
              isLabelHidden
              isTransparent
              label="Type de moyen"
              name="type"
              onChange={updateType as any}
              options={typesAsOptions}
              placeholder="Type de moyen"
              searchable
              value={filters?.type}
            />
            <StyledSelect
              isLabelHidden
              isTransparent
              label="Base du moyen"
              name="stationId"
              onChange={updateBaseId as any}
              options={basesAsOptions ?? []}
              placeholder="Base du moyen"
              searchable
              value={filters?.stationId}
            />
          </SelectFilters>
          <ResultList $hasResults={hasChildren}>
            {controlUnitResults &&
              controlUnitResults.map(controlUnit => <Item key={controlUnit.id} controlUnit={controlUnit} />)}
          </ResultList>
        </Wrapper>
      </Accordion>
      <SelectedControlUnits controlUnits={controlUnits} isSelectedAccordionOpen={isSelectedAccordionOpen} />
    </div>
  )
}

const Wrapper = styled.div<{ $hasChildren: boolean }>`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 24px;
`

const StyledTextInput = styled(TextInput)`
  width: 100%;
`

const StyledSelect = styled(Select)`
  flex: 1;
`

const SelectFilters = styled.div<{ $hasChildren: boolean; $isExpanded: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
  width: 100%;
  visibility: hidden;
  max-height: 0px;
  transition: 0.3s max-height ease-out, 0.3s visibility;

  ${p =>
    p.$isExpanded && {
      maxHeight: '100vh',
      transition: '0.5s max-height ease-in, 0.5s visibility',
      visibility: 'visible'
    }}
  ${({ $hasChildren }) => !$hasChildren && 'position: absolute;  margin-top: 41px; width: 27%;'}
`
const ResultList = styled.ul<{ $hasResults: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  list-style-type: none;
  padding: 0px;
  width: 100%;
  ${({ $hasResults }) => !$hasResults && 'margin-top: 37px;'}
`
