import { useGetAdministrationsQuery } from '@api/administrationsAPI'
import { RTK_DEFAULT_QUERY_OPTIONS } from '@api/constants'
import { useGetStationsQuery } from '@api/stationsAPI'
import { getFilteredControlUnits } from '@features/ControlUnit/useCases/getFilteredControlUnits'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import {
  ControlUnit,
  CustomSearch,
  getOptionsFromIdAndName,
  getOptionsFromLabelledEnum,
  Icon,
  Select,
  TextInput
} from '@mtes-mct/monitor-ui'
import { isNotArchived } from '@utils/isNotArchived'
import { forwardRef, useMemo } from 'react'
import styled from 'styled-components'

import { Accordion, Title, TitleContainer } from '../Accordion'
import { dashboardFiltersActions } from '../slice'
import { Item } from './Item'
import { SelectedControlUnits } from './SelectedControlUnits'

type ControlUnitsProps = {
  controlUnits: ControlUnit.ControlUnit[]
  isExpanded: boolean
  isSelectedAccordionOpen: boolean
  setExpandedAccordion: () => void
}

export const ControlUnits = forwardRef<HTMLDivElement, ControlUnitsProps>(
  ({ controlUnits, isExpanded, isSelectedAccordionOpen, setExpandedAccordion }, ref) => {
    const dispatch = useAppDispatch()
    const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)
    const filters = useAppSelector(state =>
      activeDashboardId ? state.dashboardFilters.dashboards[activeDashboardId]?.controlUnitFilters : undefined
    )
    const selectedControlUnitIds = useAppSelector(state =>
      activeDashboardId ? state.dashboard.dashboards?.[activeDashboardId]?.dashboard.controlUnitIds : []
    )
    const selectedControlUnits = controlUnits.filter(controlUnit => selectedControlUnitIds?.includes(controlUnit.id))

    const controlUnitResults = useMemo(() => {
      if (!filters) {
        return []
      }

      return getFilteredControlUnits('DASHBOARD_CONTROL_UNIT_LIST', filters, controlUnits)
    }, [filters, controlUnits])

    const { data: administrations } = useGetAdministrationsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)
    const { data: bases } = useGetStationsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)

    const administrationsAsOptions = useMemo(
      () => getOptionsFromIdAndName((administrations ?? []).filter(isNotArchived)),
      [administrations]
    )
    const basesAsOptions = useMemo(() => getOptionsFromIdAndName(bases), [bases])
    const typesAsOptions = useMemo(() => getOptionsFromLabelledEnum(ControlUnit.ControlUnitResourceTypeLabel), [])

    const updateQuery = (nextValue: string | undefined) => {
      dispatch(
        dashboardFiltersActions.setControlUnitsFilters({ id: activeDashboardId, key: 'query', value: nextValue })
      )
    }

    const updateAdministrationId = (nextValue: number | undefined) => {
      dispatch(
        dashboardFiltersActions.setControlUnitsFilters({
          id: activeDashboardId,
          key: 'administrationId',
          value: nextValue
        })
      )
    }

    const updateBaseId = (nextValue: number | undefined) => {
      dispatch(
        dashboardFiltersActions.setControlUnitsFilters({ id: activeDashboardId, key: 'stationId', value: nextValue })
      )
    }

    const updateType = (nextValue: string | undefined) => {
      dispatch(dashboardFiltersActions.setControlUnitsFilters({ id: activeDashboardId, key: 'type', value: nextValue }))
    }

    const administrationCustomSearch = new CustomSearch(administrationsAsOptions ?? [], ['label'], {
      cacheKey: 'DASHBOARD_CONTROL_UNIT_FILTERS_ADMINISTRATIONS',
      isStrict: true,
      withCacheInvalidation: true
    })

    const typeCustomSearch = new CustomSearch(typesAsOptions ?? [], ['label'], {
      cacheKey: 'DASHBOARD_CONTROL_UNIT_FILTERS_TYPES',
      isStrict: true,
      withCacheInvalidation: true
    })

    const baseCustomSearch = new CustomSearch(basesAsOptions ?? [], ['label'], {
      cacheKey: 'DASHBOARD_CONTROL_UNIT_FILTERS_BASES',
      isStrict: true,
      withCacheInvalidation: true
    })

    const hasChildren = controlUnitResults && controlUnitResults?.length > 5

    return (
      <div>
        <Accordion
          isExpanded={isExpanded}
          setExpandedAccordion={setExpandedAccordion}
          title={
            <TitleContainer>
              <Title>Unités</Title>
            </TitleContainer>
          }
          titleRef={ref}
        >
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
                customSearch={administrationCustomSearch}
                isLabelHidden
                isTransparent
                label="Administration"
                menuStyle={{ width: '300px' }}
                name="administrationId"
                onChange={updateAdministrationId}
                options={administrationsAsOptions ?? []}
                placeholder="Administration"
                searchable
                value={filters?.administrationId}
              />
              <TypesSelect
                customSearch={typeCustomSearch}
                isLabelHidden
                isTransparent
                label="Type de moyen"
                name="type"
                onChange={updateType}
                options={typesAsOptions}
                placeholder="Type de moyen"
                searchable
                value={filters?.type}
              />
              <StyledSelect
                customSearch={baseCustomSearch}
                isLabelHidden
                isTransparent
                label="Base du moyen"
                name="stationId"
                onChange={updateBaseId}
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
        <SelectedControlUnits
          isSelectedAccordionOpen={isSelectedAccordionOpen}
          selectedControlUnits={selectedControlUnits}
        />
      </div>
    )
  }
)

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

const StyledSelect = styled(Select<number>)`
  flex: 1;
`
const TypesSelect = styled(Select<ControlUnit.ControlUnitResourceType>)`
  flex: 1;
`

const SelectFilters = styled.div<{ $hasChildren: boolean; $isExpanded: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
  width: 100%;
  visibility: hidden;
  max-height: 0;
  transition: 0.3s max-height ease-out, 0.3s visibility;

  ${p =>
    p.$isExpanded && {
      maxHeight: '100vh',
      transition: '0.5s max-height ease-in, 0.5s visibility',
      visibility: 'visible'
    }}
  ${({ $hasChildren }) => !$hasChildren && 'position: absolute;  margin-top: 41px; width: 27%;'}
`
export const ResultList = styled.ul<{ $hasResults: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  list-style-type: none;
  padding: 0;
  width: 100%;
  ${({ $hasResults }) => !$hasResults && 'margin-top: 37px;'}
`
