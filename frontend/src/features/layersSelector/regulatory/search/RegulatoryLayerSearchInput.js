import React from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { IconButton, Input, InputGroup } from 'rsuite'


import { resetRegulatoryGeometriesToPreview } from '../../../../domain/shared_slices/Regulatory'
import { ReactComponent as SearchIconSVG } from '../../../../uiMonitor/icons/Loupe.svg'
import { ReactComponent as CloseIconSVG } from '../../../../uiMonitor/icons/Croix_grise.svg'
import { ReactComponent as FiltreIconSVG } from '../../../../uiMonitor/icons/filtres.svg'

export const RegulatoryLayerSearchInput = ({globalSearchText, setGlobalSearchText}) => {

  
  const dispatch = useDispatch()
  
  const handleResetSearch = () => {
    setGlobalSearchText('')
    dispatch(resetRegulatoryGeometriesToPreview())
  }
  const handleSetSearch = (value) => {
    setGlobalSearchText(value)
  }
  
  return (
    <>
      <SearchHeader>
        <SearchInputGroup>
          <SearchBoxInput
            data-cy={'regulatory-search-input'}
            classPrefix="input ghost"
            placeholder={'Rechercher une zone reg.'}
            type="text"
            value={globalSearchText}
            onChange={handleSetSearch}
            />
            
            {(globalSearchText === '') ? <InputGroup.Addon ><SearchIcon className='rs-icon' /></InputGroup.Addon>
              : <InputGroup.Button onClick={handleResetSearch} ><CloseIcon className='rs-icon' /></InputGroup.Button>
            }
            
        </SearchInputGroup>
        <IconButton appearance='primary' icon={<FiltreIconSVG className='rs-icon' />} />
        
      </SearchHeader>
      
    </>)
}

const SearchHeader = styled.div`
  display: flex;
  width: 400px;
`
const SearchInputGroup = styled(InputGroup)`
  width: 310px;
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
