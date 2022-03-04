import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
const { Document } = require("flexsearch")

import RegulatoryLayerSearchResultList from './RegulatoryLayerSearchResultList'
import RegulatoryLayerSearchInput from './RegulatoryLayerSearchInput'

const RegulatoryLayerSearch = () => {
  
  const { regulatoryLayers } = useSelector(state => state.regulatory)

  const indexRef = useRef(null)
  const GetIndex = () => {
    if (indexRef.current === null) {
      indexRef.current = new Document({
        document: {
          id: "id",
          index: ["properties:entity_name", "properties:layer_name", "properties:facade", "properties:ref_reg", "properties:thematique"],
          store: true
        },
        tokenize: 'full',
        charset: 'latin:extra'
      })
    }
    return indexRef.current
  }

  useEffect(()=> {
    regulatoryLayers?.forEach(layer=> GetIndex().add(layer))
  }, [regulatoryLayers])

  const [globalSearchText, setGlobalSearchText] = useState('')

  const [results, setResults ] = useState([])

  useEffect(()=> { 
    if (globalSearchText) {
      const result = GetIndex()?.search(globalSearchText,{ pluck: 'properties:layer_name', enrich: true})
      setResults(result)
    }

  }, [globalSearchText])

  return (
    <Search>
      <RegulatoryLayerSearchInput setGlobalSearchText={setGlobalSearchText} globalSearchText={globalSearchText} />
      <RegulatoryLayerSearchResultList results={results}/>
    </Search>
  )
}

const Search = styled.div`
  width: 350px;
`


export default RegulatoryLayerSearch
