import React from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'

import { setAdvancedSearchIsOpen, setFilterSearchOnMapExtent } from './RegulatoryLayerSearch.slice'
import { resetRegulatoryGeometriesToPreview } from '../../../../domain/shared_slices/Regulatory'
import { COLORS } from '../../../../constants/constants'
import { ReactComponent as SearchIconSVG } from '../../../icons/Loupe_dark.svg'
import { ReactComponent as CloseIconSVG } from '../../../icons/Croix_grise.svg'
import { Checkbox } from 'rsuite'

export const RegulatoryLayerSearchInput = ({globalSearchText, setGlobalSearchText}) => {

  const { advancedSearchIsOpen, filterSearchOnMapExtent } = useSelector(state => state.regulatoryLayerSearch)
  const dispatch = useDispatch()
  
  const handleResetSearch = () => {
    setGlobalSearchText('')
    dispatch(resetRegulatoryGeometriesToPreview())
  }
  const toggleFilterSearchOnMapExtent = () => dispatch(setFilterSearchOnMapExtent(!filterSearchOnMapExtent))
  return (
    <>
      <PrincipalSearchInput>
        <SearchBoxInput
          data-cy={'regulatory-search-input'}
          placeholder={'Rechercher une zone reg.'}
          type="text"
          value={globalSearchText}
          onChange={e => setGlobalSearchText(e.target.value)}/>
          {
          globalSearchText === ''
            ? <SearchIcon/>
            : <CloseIcon onClick={handleResetSearch }/>
        }
        <AdvancedSearch
          data-cy={'regulatory-layers-advanced-search'}
          advancedSearchIsOpen={advancedSearchIsOpen}
          onClick={()=>dispatch(setAdvancedSearchIsOpen(!advancedSearchIsOpen))}
        >
          {
            advancedSearchIsOpen
              ? '-'
              : '+'
          }
        </AdvancedSearch>
      </PrincipalSearchInput>
      {advancedSearchIsOpen && (
        <AdvancedSearchInput>
          <Checkbox checked={filterSearchOnMapExtent} onChange={toggleFilterSearchOnMapExtent} >voir la réglementation dans l&apos;affichage actuel de la carte</Checkbox>
        </AdvancedSearchInput>
      )}
    </>)
}

const PrincipalSearchInput = styled.div`
  height: 40px;
  width: 100%;
`
const SearchBoxInput = styled.input`
  margin: 0;
  background-color: white;
  border: none;
  border-radius: 0;
  color: ${COLORS.gunMetal};
  font-size: 13px;
  height: 40px;
  width: 250px;
  flex: 1;
  padding: 0 5px 0 10px;
  border-bottom: 1px ${COLORS.lightGray} solid;
  :hover, :focus {
    border-bottom: 1px ${COLORS.lightGray} solid;
  }
`
const SearchIcon = styled(SearchIconSVG)`
  width: 25px;
  height: 25px;
  padding: 9px 11px 6px 9px;
  background: ${COLORS.background};
  vertical-align: top;
  border-bottom: 1px ${COLORS.lightGray} solid;
`

const CloseIcon = styled(CloseIconSVG)`
  width: 20px;
  height: 17px;
  padding: 13px 11px 10px 9px;
  background: ${COLORS.background};
  vertical-align: top;
  border-bottom: 1px ${COLORS.lightGray} solid;
  cursor: pointer;
`

const AdvancedSearch = styled.div`
  width: 40px;
  height: 40px;
  float: right;
  background: ${props => props.advancedSearchIsOpen ? COLORS.shadowBlue : COLORS.charcoal};
  cursor: pointer;
  font-size: 32px;
  line-height: 29px;
  color: ${COLORS.gainsboro};
  font-weight: 300;
  transition: 0.5s all;
`
const AdvancedSearchInput = styled.div`
  height: 32px;
  background: white;
  border-bottom: 1px ${COLORS.lightGray} solid;
`
