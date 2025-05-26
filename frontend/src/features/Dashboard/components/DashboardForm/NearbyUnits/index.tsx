import { useGetNearbyUnitsQuery } from '@api/nearbyUnitsAPI'
import { dashboardActions } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { forwardRef, useEffect, useMemo, useState } from 'react'

import { Accordion, Title, TitleContainer } from '../Accordion'
import { StyledToggleSelectAll } from '../ToggleSelectAll'
import { handleSelection } from '../ToggleSelectAll/utils'

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

    useEffect(() => {
      if (isSelectedAccordionOpen) {
        setExpandedSelectedAccordion(isSelectedAccordionOpen)
      }
    }, [isSelectedAccordionOpen])

    const selectionState: 'ALL' = useMemo(() => 'ALL', [])

    return (
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
                    allIds: nearbyUnits?.flatMap(amp => amp.controlUnits.map(controlUnit => controlUnit.id)) ?? [],
                    onRemove: payload => dispatch(dashboardActions.removeItems(payload)),
                    onSelect: payload => dispatch(dashboardActions.addItems(payload)),
                    selectedIds: [],
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
        Coucou
      </Accordion>
    )
  }
)
