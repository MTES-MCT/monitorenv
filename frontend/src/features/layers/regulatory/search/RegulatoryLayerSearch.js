import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import _ from 'lodash'
import { transformExtent } from 'ol/proj'
import { intersects } from 'ol/extent';
import Document from 'flexsearch/dist/module/document'

import { resetRegulatoryZonesChecked } from './RegulatoryLayerSearch.slice'
import { addRegulatoryZonesToMyLayers } from '../../../../domain/shared_slices/Regulatory'

import RegulatoryLayerSearchResultList from './RegulatoryLayerSearchResultList'
import { RegulatoryLayerSearchInput } from './RegulatoryLayerSearchInput'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../../domain/entities/map'

import { COLORS } from '../../../../constants/constants'

const RegulatoryLayerSearch = () => {
  const { regulatoryLayers } = useSelector(state => state.regulatory)
  const { regulatoryZonesChecked, filterSearchOnMapExtent } = useSelector(state => state.regulatoryLayerSearch)
  const { currentMapExtentTracker } = useSelector(state => state.map)
  const dispatch = useDispatch()

  const indexRef = useRef(null)
  const GetIndex = () => {
    if (indexRef.current === null) {
      indexRef.current = new Document({
        document: {
          id: "id",
          index: [ "properties:layer_name", "properties:entity_name", "properties:ref_reg", "properties:thematique", "properties:type"],
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
      const allResults = GetIndex()?.search(globalSearchText, { index: [ "properties:layer_name", "properties:entity_name", "properties:type", "properties:thematique", "properties:ref_reg"], enrich: true})
      const uniqueResults = _.uniqWith(_.flatMap(allResults, field => field.result), (a,b) => a.id === b.id)
      if (currentMapExtentTracker && filterSearchOnMapExtent) {
        const currentExtent = transformExtent(currentMapExtentTracker,  OPENLAYERS_PROJECTION, WSG84_PROJECTION)
        const filteredResults = _.filter(uniqueResults, (result => {
          return intersects(result?.doc?.bbox, currentExtent)
      }))
      setResults(filteredResults)
      } else {
        setResults(uniqueResults)
      }
    } else {
      if (currentMapExtentTracker && filterSearchOnMapExtent) {
        const currentExtent = transformExtent(currentMapExtentTracker,  OPENLAYERS_PROJECTION, WSG84_PROJECTION)
        const filteredResults = _.map(_.filter(regulatoryLayers, (layer => {
            return intersects(layer.bbox, currentExtent)
        })), layer => ({
          id: layer.id,
          doc: layer
        }))
        setResults(filteredResults)
      } else {
        setResults([])
      }
    }

  }, [globalSearchText, currentMapExtentTracker, filterSearchOnMapExtent, regulatoryLayers])

   const [ numberOfRegulatoryLayersSaved, setNumberOfRegulatoryLayersSaved] = useState(0)
  function addRegulatoryLayers () {
    setNumberOfRegulatoryLayersSaved(regulatoryZonesChecked.length)
    setTimeout(() => { setNumberOfRegulatoryLayersSaved(0) }, 2000)
    dispatch(addRegulatoryZonesToMyLayers(regulatoryZonesChecked))
    dispatch(resetRegulatoryZonesChecked())
  }

  return (
    <Search>
      <RegulatoryLayerSearchInput setGlobalSearchText={setGlobalSearchText} globalSearchText={globalSearchText} />
      <RegulatoryLayerSearchResultList results={results} searchedText={globalSearchText}/>
      <AddRegulatoryLayer
          data-cy={'regulatory-search-add-zones-button'}
          onClick={addRegulatoryLayers}
          $isShown={regulatoryZonesChecked && regulatoryZonesChecked.length}
      >
        {
          numberOfRegulatoryLayersSaved
              ? `${numberOfRegulatoryLayersSaved} zone${numberOfRegulatoryLayersSaved.length > 1 ? 's' : ''} ajout??e${numberOfRegulatoryLayersSaved.length > 1 ? 's' : ''}`
              : `Ajouter ${regulatoryZonesChecked.length} zone${regulatoryZonesChecked.length > 1 ? 's' : ''}`
        }
      </AddRegulatoryLayer>
    </Search>
  )
}

const Search = styled.div`
  width: 350px;
`

const AddRegulatoryLayer = styled.div`
  cursor: pointer;
  border-radius: 0;
  font-size: 13px;
  background: ${COLORS.charcoal};
  color: ${COLORS.gray};
  padding: 0;
  line-height: 2.5em;
  margin: 0;
  height: 0;
  width: 100%;
  overflow: hidden;
  user-select: none;
  height: ${props => props.$isShown ? '36' : '0'}px;
  max-height: 600px;
  transition: 0.5s all;
`

export default RegulatoryLayerSearch
