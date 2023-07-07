import { Accent, IconButton, Icon, Size } from '@mtes-mct/monitor-ui'
import { Input, InputGroup } from 'rsuite'
import styled from 'styled-components'

import { ReactComponent as CloseIconSVG } from '../../../uiMonitor/icons/Close.svg'
import { ReactComponent as SearchIconSVG } from '../../../uiMonitor/icons/Search.svg'

export function SearchInput({
  displayRegFilters,
  filteredAmpTypes,
  filteredRegulatoryThemes,
  globalSearchText,
  placeholder,
  setGlobalSearchText,
  toggleRegFilters
}) {
  const handleResetSearch = () => {
    setGlobalSearchText('')
  }
  const numberOfFilters = (filteredRegulatoryThemes?.length || 0) + (filteredAmpTypes?.length || 0)

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
          <InputGroup.Button appearance="ghost" onClick={handleResetSearch}>
            <CloseIcon className="rs-icon" />
          </InputGroup.Button>
        )}
      </SearchInputGroup>
      <FilterIcon>
        {!displayRegFilters && numberOfFilters > 0 && <NumberOfFilteredReg>{numberOfFilters}</NumberOfFilteredReg>}
        <IconButton
          accent={Accent.PRIMARY}
          className={displayRegFilters ? '_active' : ''}
          Icon={Icon.FilterBis}
          onClick={toggleRegFilters}
          size={Size.LARGE}
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
  background: ${p => p.theme.color.white};
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
