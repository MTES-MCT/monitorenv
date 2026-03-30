import { useGetPositionsQuery } from '@api/positionsApi'
import { PositionsTable } from '@features/Vessel/components/VesselResume/Positions/PositionsTable'
import { getDatesFromFilters } from '@features/Vessel/components/VesselResume/utils'
import { vesselAction } from '@features/Vessel/slice'
import { Vessel } from '@features/Vessel/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import {
  customDayjs,
  type DateAsStringRange,
  DateRangePicker,
  getOptionsFromLabelledEnum,
  MapMenuDialog,
  Select
} from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/query'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

type VesselSettingsProps = {
  vessel: Vessel.Vessel
}

export function VesselSettings({ vessel }: VesselSettingsProps) {
  const dispatch = useAppDispatch()
  const defaultFilter = Vessel.AisTrackSettingsEnum.TWELVE_HOURS
  const [filter, setFilters] = useState<Vessel.AisTrackSettingsEnum | undefined>(defaultFilter)
  const [specificPeriod, setSpecificPeriod] = useState<DateAsStringRange | undefined>(undefined)
  const aisTrackSettingOptions = getOptionsFromLabelledEnum(Vessel.AisTrackSettingsLabel)

  const { from, to } = getDatesFromFilters(filter, specificPeriod)

  // API call for specific position
  const { data: positions } = useGetPositionsQuery(
    filter !== Vessel.AisTrackSettingsEnum.SPECIFIC_PERIOD || !vessel.mmsi || !from || !to
      ? skipToken
      : {
          from,
          mmsi: vessel.mmsi,
          to
        }
  )

  const displayedPositions = useMemo(
    () =>
      filter === Vessel.AisTrackSettingsEnum.SPECIFIC_PERIOD
        ? positions
        : vessel.positions?.filter(position =>
            customDayjs(position.sentAt).isBetween(customDayjs(from), customDayjs(to))
          ),
    [filter, from, positions, to, vessel.positions]
  )

  useEffect(() => {
    dispatch(vesselAction.setDisplayedPositions(displayedPositions))
  }, [dispatch, displayedPositions])

  return (
    <Wrapper>
      <MapMenuDialog.Header>
        <MapMenuDialog.Title>Paramétrer l&apos;affichage de la piste AIS</MapMenuDialog.Title>
      </MapMenuDialog.Header>
      <Body>
        <FilterWrapper>
          <Select
            isLabelHidden
            isLight={false}
            isTransparent
            label="Afficher la piste AIS depuis"
            name="aisTrackSettings"
            onChange={nextFilter => {
              setFilters(nextFilter ? Vessel.AisTrackSettingsEnum[nextFilter] : undefined)
            }}
            options={aisTrackSettingOptions}
            value={filter}
          />
          {filter === Vessel.AisTrackSettingsEnum.SPECIFIC_PERIOD && (
            <DateWrapper>
              <DateRangePicker
                key="dateRange"
                defaultValue={specificPeriod}
                isCompact
                isHistorical
                isRequired
                isStringDate
                label="Date et heure de début et de fin"
                name="dateRange"
                onChange={dateRange => {
                  setSpecificPeriod(dateRange)
                }}
                withTime
              />
            </DateWrapper>
          )}
        </FilterWrapper>
        <PositionsTable positions={displayedPositions ?? []} />
      </Body>
    </Wrapper>
  )
}

const Wrapper = styled(MapMenuDialog.Container)`
  height: fit-content;
  position: relative;
  right: 0;
  top: 110px;
  width: 375px;
`

const Body = styled(MapMenuDialog.Body)`
  padding: 0;
  overflow: hidden;
`

const FilterWrapper = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  top: 0;
`

const DateWrapper = styled.div`
  .Field-DateRangePicker__RangeCalendarPicker {
    position: absolute;
  }

  white-space: pre;
`
