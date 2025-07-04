import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton, Size, TextInput } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export function SearchInput({
  displayRegFilters,
  filteredAmpTypes,
  filteredRegulatoryTags,
  filteredRegulatoryThemes,
  filteredVigilanceAreaPeriod,
  globalSearchText,
  placeholder,
  setGlobalSearchText,
  toggleRegFilters
}) {
  const defaultVigilanceAreaPeriod =
    filteredVigilanceAreaPeriod === VigilanceArea.VigilanceAreaFilterPeriod.NEXT_THREE_MONTHS
  const { status: statusFilter, visibility: visibilityFilter } = useAppSelector(state => state.vigilanceAreaFilters)

  const numberOfFilters =
    filteredRegulatoryTags.length +
    filteredRegulatoryThemes.length +
    (filteredAmpTypes?.length ?? 0) +
    (!defaultVigilanceAreaPeriod ? 1 : 0) +
    (statusFilter.length !== 2 ? 1 : 0) +
    (visibilityFilter.length !== 2 ? 1 : 0)

  return (
    <SearchHeader>
      <StyledTextInput
        isLabelHidden
        isLight
        isSearchInput
        label={placeholder}
        name={placeholder}
        onChange={setGlobalSearchText}
        placeholder={placeholder}
        size={Size.LARGE}
        value={globalSearchText}
      />
      <div>
        {!displayRegFilters && numberOfFilters > 0 && <NumberOfFilters>{numberOfFilters}</NumberOfFilters>}
        <IconButton
          accent={Accent.PRIMARY}
          className={displayRegFilters ? '_active' : ''}
          Icon={Icon.FilterBis}
          onClick={toggleRegFilters}
          size={Size.LARGE}
          title="Filtrer par type de zones"
        />
      </div>
    </SearchHeader>
  )
}

const SearchHeader = styled.div`
  display: flex;
  width: 400px;
`
const StyledTextInput = styled(TextInput)`
  width: 310px;
  > div > input {
    height: 42px;
  }
`

const NumberOfFilters = styled.div`
  position: absolute;
  top: -9px;
  right: -5px;
  z-index: 100;
  font-size: 12px;
  background-color: ${p => p.theme.color.maximumRed};
  border-radius: 50%;
  color: ${p => p.theme.color.white};
  width: 20px;
  height: 20px;
  margin: auto;
  text-align: center;
`
