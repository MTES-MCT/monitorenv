import { IconButton, Input, InputGroup } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../../constants/constants'
import { ReactComponent as CloseIconSVG } from '../../../../uiMonitor/icons/Close.svg'
import { ReactComponent as FiltreIconSVG } from '../../../../uiMonitor/icons/Filtres.svg'
import { ReactComponent as SearchIconSVG } from '../../../../uiMonitor/icons/Search.svg'

export function RegulatoryLayerSearchInput({
  displayRegFilters,
  filteredRegulatoryThemes,
  globalSearchText,
  placeholder,
  setGlobalSearchText,
  toggleRegFilters
}) {
  const handleResetSearch = () => {
    setGlobalSearchText('')
  }
  const numberOfFilteredRegulatoryThemes = filteredRegulatoryThemes?.length

  return (
    <SearchHeader>
      <SearchInputGroup>
        <SearchBoxInput
          classPrefix="input ghost"
          data-cy="regulatory-search-input"
          onChange={setGlobalSearchText}
          placeholder={placeholder}
          type="text"
          value={globalSearchText}
        />

        {globalSearchText === '' ? (
          <InputGroup.Addon>
            <SearchIcon className="rs-icon" />
          </InputGroup.Addon>
        ) : (
          <InputGroup.Button onClick={handleResetSearch}>
            <CloseIcon className="rs-icon" />
          </InputGroup.Button>
        )}
      </SearchInputGroup>
      <FilterIcon>
        {!displayRegFilters && numberOfFilteredRegulatoryThemes > 0 && (
          <NumberOfFilteredReg>{numberOfFilteredRegulatoryThemes}</NumberOfFilteredReg>
        )}
        <FilterIconButton
          active={displayRegFilters}
          appearance="primary"
          icon={<FiltreIconSVG className="rs-icon" />}
          onClick={toggleRegFilters}
          size="lg"
        />
      </FilterIcon>
    </SearchHeader>
  )
}

const SearchHeader = styled.div`
  display: flex;
  width: 400px;
`
const SearchInputGroup = styled(InputGroup)`
  width: 310px;
  background: ${COLORS.white};
  border: 0;
`
const SearchBoxInput = styled(Input)`
  padding-left: 12px;
  height: 40px;
`
const SearchIcon = styled(SearchIconSVG)`
  width: 16px;
  height: 16px;
`

const CloseIcon = styled(CloseIconSVG)`
  width: 16px;
  height: 16px;
`
const FilterIcon = styled.div``

const FilterIconButton = styled(IconButton)`
  width: 40px;
`
const NumberOfFilteredReg = styled.span`
  background: ${COLORS.maximumRed};
  color: ${COLORS.white};
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
