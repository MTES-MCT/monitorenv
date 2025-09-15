import { vigilanceAreaFiltersActions } from '@features/VigilanceArea/components/VigilanceAreasList/Filters/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { type Option, Select } from '@mtes-mct/monitor-ui'
import React from 'react'

import { VigilanceArea } from '../types'

export function PeriodFilter({ style }: { style?: React.CSSProperties }) {
  const dispatch = useAppDispatch()
  const vigilanceAreaPeriodOptions = Object.entries(VigilanceArea.VigilanceAreaFilterPeriodLabel).map(
    ([value, label]) => ({ label, value })
  ) as Option<VigilanceArea.VigilanceAreaFilterPeriod>[]

  const filteredVigilanceAreaPeriod = useAppSelector(state => state.vigilanceAreaFilters.period)

  const handleSetFilteredVigilancePeriod = (
    nextVigilanceAreaPeriod: VigilanceArea.VigilanceAreaFilterPeriod | undefined
  ) => {
    if (!nextVigilanceAreaPeriod) {
      return
    }

    dispatch(vigilanceAreaFiltersActions.updateFilters({ key: 'period', value: nextVigilanceAreaPeriod }))

    if (nextVigilanceAreaPeriod !== VigilanceArea.VigilanceAreaFilterPeriod.SPECIFIC_PERIOD) {
      dispatch(vigilanceAreaFiltersActions.updateFilters({ key: 'specificPeriod', value: undefined }))
    }
  }

  return (
    <Select
      isCleanable={false}
      isLabelHidden
      isTransparent
      label="Période de vigilance"
      name="periodOfVigilanceArea"
      onChange={handleSetFilteredVigilancePeriod}
      options={vigilanceAreaPeriodOptions}
      placeholder="Période de vigilance"
      style={style}
      value={filteredVigilanceAreaPeriod}
    />
  )
}
