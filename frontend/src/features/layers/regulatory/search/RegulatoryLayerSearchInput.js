import React from 'react'
import styled from 'styled-components'
import {  useSelector } from 'react-redux'

import { COLORS } from '../../../../constants/constants'
import SearchIconSVG from '../../../icons/Loupe_dark.svg'

const RegulatoryLayerSearchInput = ({globalSearchText, setGlobalSearchText}) => {

  const {
    advancedSearchIsOpen,
  } = useSelector(state => state.regulatoryLayerSearch)

  return (
    <>
      <PrincipalSearchInput>
        <SearchBoxInput
          data-cy={'regulatory-search-input'}
          placeholder={'Rechercher une zone reg.'}
          type="text"
          value={globalSearchText}
          onChange={e => setGlobalSearchText(e.target.value)}/>
        <AdvancedSearch
          data-cy={'regulatory-layers-advanced-search'}
          advancedSearchIsOpen={advancedSearchIsOpen}
        >
          {
            advancedSearchIsOpen
              ? '-'
              : '+'
          }
        </AdvancedSearch>
      </PrincipalSearchInput>
      
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
  border-bottom: 1px ${COLORS.lightGray} solid;
  border-radius: 0;
  color: ${COLORS.gunMetal};
  font-size: 13px;
  height: 40px;
  width: 290px;
  padding: 0 5px 0 10px;
  flex: 3;
  background-image: url(${SearchIconSVG});
  background-size: 30px;
  background-position: bottom 3px right 5px;
  background-repeat: no-repeat;
  
  :hover, :focus {
    border-bottom: 1px ${COLORS.lightGray} solid;
  }
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

export default RegulatoryLayerSearchInput
