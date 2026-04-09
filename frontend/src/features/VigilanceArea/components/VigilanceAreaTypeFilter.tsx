import { OptionValue } from '@features/Reportings/Filters/style'
import { vigilanceAreaFiltersActions } from '@features/VigilanceArea/components/VigilanceAreasList/Filters/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { CheckPicker, type Option } from '@mtes-mct/monitor-ui'
import { type CSSProperties } from 'react'

import { VigilanceArea } from '../types'

export function VigilanceAreaTypeFilter({ menuStyle, style }: { menuStyle?: CSSProperties; style?: CSSProperties }) {
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
      cleanable
      isLabelHidden
      isTransparent
      label="Type de zone de vigilance"
      menuStyle={menuStyle}
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
