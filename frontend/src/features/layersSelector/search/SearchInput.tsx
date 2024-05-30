import { Accent, IconButton, Icon, Size, TextInput, Tag, THEME } from '@mtes-mct/monitor-ui'
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
        {!displayRegFilters && numberOfFilters > 0 && (
          <NumberOfFilters backgroundColor={THEME.color.maximumRed} color={THEME.color.white}>
            {numberOfFilters}
          </NumberOfFilters>
        )}
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

const NumberOfFilters = styled(Tag)`
  position: absolute;
  top: -5px;
  right: -5px;
  z-index: 100;
  font-size: 12px;
`
