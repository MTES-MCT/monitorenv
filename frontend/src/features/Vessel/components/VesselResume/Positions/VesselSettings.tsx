import { useGetPositionsQuery } from '@api/positionsApi'
import { PositionsTable } from '@features/Vessel/components/VesselResume/Positions/PositionsTable'
import { getDatesFromFilters } from '@features/Vessel/components/VesselResume/utils'
import { vesselAction } from '@features/Vessel/slice'
import { Vessel } from '@features/Vessel/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import {
  type DateAsStringRange,
  DateRangePicker,
  getOptionsFromLabelledEnum,
  Label,
  MapMenuDialog,
  Select
} from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/query'
import { useEffect, useState } from 'react'
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
  const { data: positions } = useGetPositionsQuery(
    filter === defaultFilter || !vessel.mmsi
      ? skipToken
      : {
          from,
          mmsi: vessel.mmsi,
          to
        }
  )

  useEffect(() => {
    dispatch(vesselAction.setDisplayedPositions(filter === defaultFilter ? vessel.positions : positions))
  }, [defaultFilter, dispatch, filter, positions, vessel.positions])

  return (
    <Wrapper>
      <MapMenuDialog.Header>
        <MapMenuDialog.Title>Paramétrer l&apos;affichage de la piste AIS</MapMenuDialog.Title>
      </MapMenuDialog.Header>
      <Body>
        <FilterWrapper>
          <Select
            isLabelHidden
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
            <div>
              <Label>Date et heure de début et de fin</Label>
              <DateRangePicker
                key="dateRange"
                defaultValue={specificPeriod}
                isLabelHidden
                isRequired
                isStringDate
                label="Période spécifique"
                name="dateRange"
                onChange={dateRange => {
                  setSpecificPeriod(dateRange)
                }}
              />
            </div>
          )}
        </FilterWrapper>
        <PositionsTable
          positions={filter === defaultFilter ? vessel.positions ?? [] : Object.values(positions ?? [])}
        />
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
`

const FilterWrapper = styled.div`
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`
