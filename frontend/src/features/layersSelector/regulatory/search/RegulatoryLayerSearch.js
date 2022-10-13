import Document from 'flexsearch/dist/module/document'
import _ from 'lodash'
import { intersects } from 'ol/extent'
import { transformExtent } from 'ol/proj'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { IconButton } from 'rsuite'
import styled from 'styled-components'

import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../../domain/entities/map'
import { ReactComponent as ZoomIconSVG } from '../../../../uiMonitor/icons/affichage_recherche_reg.svg'
import { ReactComponent as CloseIconSVG } from '../../../../uiMonitor/icons/Croix_grise.svg'
import { ReactComponent as SearchIconSVG } from '../../../../uiMonitor/icons/Loupe.svg'
import { setFilterSearchOnMapExtent } from './RegulatoryLayerSearch.slice'
import { RegulatoryLayerSearchInput } from './RegulatoryLayerSearchInput'
import RegulatoryLayerSearchResultList from './RegulatoryLayerSearchResultList'

function RegulatoryLayerSearch() {
  const dispatch = useDispatch()
  const { regulatoryLayers } = useSelector(state => state.regulatory)
  const { filterSearchOnMapExtent } = useSelector(state => state.regulatoryLayerSearch)
  const { currentMapExtentTracker } = useSelector(state => state.map)
  const [shouldRunSearchOnExtent, setShouldRunSearchOnExtent] = useState(false)
  const [globalSearchText, setGlobalSearchText] = useState('')
  const [results, setResults] = useState([])

  const indexRef = useRef(null)
  const GetIndex = () => {
    if (indexRef.current === null) {
      indexRef.current = new Document({
        charset: 'latin:extra',
        document: {
          id: 'id',
          index: [
            'properties:layer_name',
            'properties:entity_name',
            'properties:ref_reg',
            'properties:thematique',
            'properties:type'
          ],
          store: true
        },
        tokenize: 'full'
      })
    }

    return indexRef.current
  }

  useEffect(() => {
    if (filterSearchOnMapExtent) {
      setShouldRunSearchOnExtent(true)
    } else {
      setShouldRunSearchOnExtent(false)
    }
  }, [filterSearchOnMapExtent, currentMapExtentTracker])

  useEffect(() => {
    regulatoryLayers?.forEach(layer => GetIndex().add(layer))
  }, [regulatoryLayers])

  const searchLayers = useCallback(
    (searchedText, geofilter, extent) => {
      if (searchedText) {
        const allResults = GetIndex()?.search(searchedText, {
          enrich: true,
          index: [
            'properties:layer_name',
            'properties:entity_name',
            'properties:type',
            'properties:thematique',
            'properties:ref_reg'
          ]
        })
        const uniqueResults = _.uniqWith(
          _.flatMap(allResults, field => field.result),
          (a, b) => a.id === b.id
        )
        if (extent && geofilter) {
          const currentExtent = transformExtent(extent, OPENLAYERS_PROJECTION, WSG84_PROJECTION)
          const filteredResults = _.filter(uniqueResults, result => intersects(result?.doc?.bbox, currentExtent))
          setResults(filteredResults)
        } else {
          setResults(uniqueResults)
        }
      } else if (extent && geofilter) {
        const currentExtent = transformExtent(extent, OPENLAYERS_PROJECTION, WSG84_PROJECTION)
        const filteredResults = _.map(
          _.filter(regulatoryLayers, layer => intersects(layer.bbox, currentExtent)),
          layer => ({
            doc: layer,
            id: layer.id
          })
        )
        setResults(filteredResults)
      } else {
        setResults([])
      }
    },
    [regulatoryLayers]
  )

  const handleReloadSearch = () => {
    searchLayers(globalSearchText, filterSearchOnMapExtent, currentMapExtentTracker)
    setShouldRunSearchOnExtent(false)
  }
  const handleResetSearch = () => {
    setResults([])
    setShouldRunSearchOnExtent(false)
    dispatch(setFilterSearchOnMapExtent(false))
  }
  const allowResetResults = !_.isEmpty(results) && filterSearchOnMapExtent

  const handleSearchInputChange = searchedText => {
    setGlobalSearchText(searchedText)
    searchLayers(globalSearchText, filterSearchOnMapExtent, currentMapExtentTracker)
  }

  const toggleFilterSearchOnMapExtent = () => {
    dispatch(setFilterSearchOnMapExtent(!filterSearchOnMapExtent))
  }

  return (
    <>
      <Search>
        <RegulatoryLayerSearchInput globalSearchText={globalSearchText} setGlobalSearchText={handleSearchInputChange} />
        <RegulatoryLayerSearchResultList results={results} searchedText={globalSearchText} />
      </Search>
      <SearchOnExtentButton
        active={filterSearchOnMapExtent}
        appearance="primary"
        data-cy="regulatory-layers-advanced-search"
        icon={<ZoomIcon className="rs-icon" />}
        onClick={toggleFilterSearchOnMapExtent}
        title="Définir la zone de recherche et afficher les tracés"
      />
      {shouldRunSearchOnExtent && (
        <ReloadSearch appearance="primary" icon={<SearchIcon className="rs-icon" />} onClick={handleReloadSearch}>
          Relancer la recherche ici
        </ReloadSearch>
      )}
      {allowResetResults && (
        <ResetSearch icon={<ResetIcon className="rs-icon" />} onClick={handleResetSearch}>
          Effacer les résultats de la recherche
        </ResetSearch>
      )}
    </>
  )
}

const Search = styled.div`
  width: 350px;
`
const ReloadSearch = styled(IconButton)`
  position: fixed;
  top: 10px;
  left: 500px;
`
const ResetSearch = styled(IconButton)`
  position: fixed;
  top: 10px;
  left: 734px;
`

const SearchIcon = styled(SearchIconSVG)`
  width: 16px;
  height: 16px;
`
const ResetIcon = styled(CloseIconSVG)`
  width: 16px;
  height: 16px;
`

const ZoomIcon = styled(ZoomIconSVG)`
  width: 24px;
  height: 22px;
`
const SearchOnExtentButton = styled(IconButton)`
  position: fixed;
  top: 10px;
  left: 410px;
  margin-left: 5px;
  padding: 2px;
  flex-grow: 0;
  flex-shrink: 0;
  transition: 0.5s all;
`

export default RegulatoryLayerSearch
