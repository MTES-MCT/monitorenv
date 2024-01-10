import { Accent, IconButton, Icon, Size, TextInput } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export function SearchInput({
  displayRegFilters,
  filteredAmpTypes,
  filteredRegulatoryThemes,
  globalSearchText,
  placeholder,
  setGlobalSearchText,
  toggleRegFilters
}) {
  const numberOfFilters = (filteredRegulatoryThemes?.length || 0) + (filteredAmpTypes?.length || 0)

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
        {!displayRegFilters && numberOfFilters > 0 && <NumberOfFilteredReg>{numberOfFilters}</NumberOfFilteredReg>}
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

const NumberOfFilteredReg = styled.span`
  background: ${p => p.theme.color.maximumRed};
  color: ${p => p.theme.color.white};
  position: absolute;
  top: -5px;
  right: -5px;
  z-index: 100;
  border-radius: 8px;
  height: 16px;
  font-size: 12px;
  min-width: 16px;
  line-height: 16px;
`
