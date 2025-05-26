import { useGetNearbyUnitsQuery } from '@api/nearbyUnitsAPI'
import { ResultList } from '@features/Dashboard/components/DashboardForm/ControlUnits'
import { Item } from '@features/Dashboard/components/DashboardForm/NearbyUnits/Item'
import { SelectedAccordion } from '@features/Dashboard/components/DashboardForm/SelectedAccordion'
import { SelectedLayerList } from '@features/Dashboard/components/DashboardForm/style'
import { dashboardActions } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { pluralize } from '@mtes-mct/monitor-ui'
import { forwardRef, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { Accordion, Title, TitleContainer } from '../Accordion'
import { StyledToggleSelectAll } from '../ToggleSelectAll'
import { getSelectionState, handleSelection } from '../ToggleSelectAll/utils'

import type { GeoJSON } from '../../../../../domain/types/GeoJSON'

type NearbyUnitsProps = {
  geometry: GeoJSON.Geometry
  isExpanded: boolean
  isSelectedAccordionOpen: boolean
  setExpandedAccordion: () => void
}
export const NearbyUnits = forwardRef<HTMLDivElement, NearbyUnitsProps>(
  ({ geometry, isExpanded, isSelectedAccordionOpen, setExpandedAccordion }, ref) => {
    const dispatch = useAppDispatch()
    const [isExpandedSelectedAccordion, setExpandedSelectedAccordion] = useState(false)
    const { data: nearbyUnits } = useGetNearbyUnitsQuery(geometry)
    const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)
    const selectedNearbyUnitIds = useAppSelector(state =>
      activeDashboardId ? state.dashboard.dashboards?.[activeDashboardId]?.selectedNearbyUnitIds : []
    )
    useEffect(() => {
      if (isSelectedAccordionOpen) {
        setExpandedSelectedAccordion(isSelectedAccordionOpen)
      }
    }, [isSelectedAccordionOpen])

    const selectionState = useMemo(
      () =>
        getSelectionState(selectedNearbyUnitIds ?? [], nearbyUnits?.map(nearbyUnit => nearbyUnit.controlUnit.id) ?? []),
      [selectedNearbyUnitIds, nearbyUnits]
    )

    return (
      <div>
        <Accordion
          isExpanded={isExpanded}
          setExpandedAccordion={setExpandedAccordion}
          title={
            <TitleContainer>
              <Title>Unités proches</Title>
              {(nearbyUnits?.length !== 0 || nearbyUnits.length !== 0) && (
                <StyledToggleSelectAll
                  onSelection={() =>
                    handleSelection({
                      allIds: nearbyUnits?.map(nearbyUnit => nearbyUnit.controlUnit.id) ?? [],
                      onRemove: payload => dispatch(dashboardActions.removeItems(payload)),
                      onSelect: payload => dispatch(dashboardActions.addItems(payload)),
                      selectedIds: selectedNearbyUnitIds ?? [],
                      selectionState,
                      type: Dashboard.Block.NEARBY_UNITS
                    })
                  }
                  selectionState={selectionState}
                />
              )}
            </TitleContainer>
          }
          titleRef={ref}
        >
          <Wrapper>
            <ResultList $hasResults>
              {Object.values(nearbyUnits ?? [])
                .sort((a, b) => (a.controlUnit.name > b.controlUnit.name ? 1 : -1))
                .map(nearbyUnit => (
                  <Item nearbyUnit={nearbyUnit} />
                ))}
            </ResultList>
          </Wrapper>
        </Accordion>
        <SelectedAccordion
          isExpanded={isExpandedSelectedAccordion}
          isReadOnly={selectedNearbyUnitIds?.length === 0}
          setExpandedAccordion={() => setExpandedSelectedAccordion(!isExpandedSelectedAccordion)}
          title={`${selectedNearbyUnitIds?.length} ${pluralize(
            'unité',
            selectedNearbyUnitIds?.length ?? 0
          )} ${pluralize('proche', selectedNearbyUnitIds?.length ?? 0)} ${pluralize(
            'sélectionnée',
            selectedNearbyUnitIds?.length ?? 0
          )} `}
        >
          <SelectedLayerList>
            {nearbyUnits
              ?.filter(nearbyUnit => selectedNearbyUnitIds?.includes(nearbyUnit.controlUnit.id))
              ?.map(nearbyUnit => (
                <Item isSelected nearbyUnit={nearbyUnit} />
              ))}
          </SelectedLayerList>
        </SelectedAccordion>
      </div>
    )
  }
)

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 24px;
`
