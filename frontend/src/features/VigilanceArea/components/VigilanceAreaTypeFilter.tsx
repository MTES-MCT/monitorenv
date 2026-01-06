import { OptionValue } from '@features/Reportings/Filters/style'
import { vigilanceAreaFiltersActions } from '@features/VigilanceArea/components/VigilanceAreasList/Filters/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { CheckPicker, type Option } from '@mtes-mct/monitor-ui'
import React from 'react'

import { VigilanceArea } from '../types'

export function VigilanceAreaTypeFilter({ style }: { style?: React.CSSProperties }) {
  const dispatch = useAppDispatch()
  const vigilanceAreaTypeOptions = Object.entries(VigilanceArea.VigilanceAreaFilterTypeLabel).map(([value, label]) => ({
    label,
    value
  })) as Option<VigilanceArea.VigilanceAreaFilterType>[]

  const filteredVigilanceAreaType = useAppSelector(state => state.vigilanceAreaFilters.type)

  const handleSetFilteredVigilanceType = (
    nextVigilanceAreaType: VigilanceArea.VigilanceAreaFilterType[] | undefined
  ) => {
    dispatch(vigilanceAreaFiltersActions.updateFilters({ key: 'type', value: nextVigilanceAreaType ?? [] }))
  }

  return (
    <CheckPicker
      isCleanable
      isLabelHidden
      isTransparent
      label="Type de zone de vigilance"
      name="periodOfVigilanceArea"
      onChange={handleSetFilteredVigilanceType}
      options={vigilanceAreaTypeOptions}
      placeholder="Type de zone de vigilance"
      renderValue={() =>
        filteredVigilanceAreaType && (
          <OptionValue>{`Type de zone de vigilance (${filteredVigilanceAreaType.length})`}</OptionValue>
        )
      }
      style={style}
      value={filteredVigilanceAreaType}
    />
  )
}
