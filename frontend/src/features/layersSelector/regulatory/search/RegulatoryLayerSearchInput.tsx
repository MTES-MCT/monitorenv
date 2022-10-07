import { IconButton, Input, InputGroup } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../../constants/constants'
import { ReactComponent as CloseIconSVG } from '../../../../uiMonitor/icons/Close.svg'
import { ReactComponent as FiltreIconSVG } from '../../../../uiMonitor/icons/filtres.svg'
import { ReactComponent as SearchIconSVG } from '../../../../uiMonitor/icons/Search.svg'

export function RegulatoryLayerSearchInput({ globalSearchText, setGlobalSearchText }) {
  const handleResetSearch = () => {
    setGlobalSearchText('')
  }

  return (
    <SearchHeader>
      <SearchInputGroup>
        <SearchBoxInput
          classPrefix="input ghost"
          data-cy="regulatory-search-input"
          onChange={setGlobalSearchText}
          placeholder="Rechercher une zone reg."
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
      <FilterIconButton appearance="primary" icon={<FiltreIconSVG className="rs-icon" />} />
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
const FilterIconButton = styled(IconButton)`
  width: 40px;
`
