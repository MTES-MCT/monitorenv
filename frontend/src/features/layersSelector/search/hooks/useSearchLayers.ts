import { useGetAMPsQuery } from '@api/ampsAPI'
import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { closeMetadataPanel } from '@features/layersSelector/metadataPanel/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import * as Comlink from 'comlink'
import { debounce } from 'lodash'
import { useMemo, useEffect } from 'react'

import Worker from '../MonitorEnvWebWorker?worker'
import { setAMPsSearchResult, setRegulatoryLayersSearchResult } from '../slice'

import type { AMPIndexItem, RegulatoryIndexItem, SearchLayersParams, SearchLayersResult } from '../MonitorEnvWebWorker'

export function useSearchLayers() {
  const dispatch = useAppDispatch()
  const { data: amps } = useGetAMPsQuery()
  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()

  const searchExtent = useAppSelector(s => s.layerSearch.searchExtent)
  const globalSearchText = useAppSelector(s => s.layerSearch.globalSearchText)
  const filteredRegulatoryTags = useAppSelector(s => s.layerSearch.filteredRegulatoryTags)
  const filteredRegulatoryThemes = useAppSelector(s => s.layerSearch.filteredRegulatoryThemes)
  const controlPlan = useAppSelector(s => s.layerSearch.controlPlan)
  const filteredAmpTypes = useAppSelector(s => s.layerSearch.filteredAmpTypes)
  const shouldFilterSearchOnMapExtent = useAppSelector(s => s.layerSearch.shouldFilterSearchOnMapExtent)

  const workerRef = useMemo(() => {
    const w = new Worker()

    return Comlink.wrap<{
      initAMPIndex(layers: AMPIndexItem[], version: string): void
      initRegulatoryIndex(layers: RegulatoryIndexItem[], version: string): void
      searchLayers(
        params: Omit<SearchLayersParams, 'regulatoryLayers' | 'regulatoryVersion'>
      ): Promise<SearchLayersResult>
    }>(w)
  }, [])

  const regulatoryVersion = useMemo(() => {
    if (!regulatoryLayers) {
      return '0'
    }

    return `${Date.now()}`
  }, [regulatoryLayers])

  useEffect(() => {
    if (!workerRef || !regulatoryLayers) {
      return
    }

    const layers: RegulatoryIndexItem[] = Object.values(regulatoryLayers.entities).map(l => ({
      ...l,
      tags: l.tags ?? [],
      themes: l.themes ?? []
    }))
    workerRef.initRegulatoryIndex(layers, regulatoryVersion)
  }, [workerRef, regulatoryLayers, regulatoryVersion])

  useEffect(() => {
    if (!amps) {
      return
    }

    const items: AMPIndexItem[] = Object.values(amps.entities).map(a => ({
      bbox: a.bbox,
      designation: a.designation,
      geom: a.geom,
      id: a.id,
      name: a.name,
      refReg: a.refReg,
      searchText: `${a.name} ${a.type ?? ''}`.toLowerCase(),
      type: a.type ?? '',
      urlLegicem: a.urlLegicem
    }))

    workerRef.initAMPIndex(items, `${items.length}`)
  }, [workerRef, amps])

  // --- Fonction de recherche ---
  const search = async () => {
    dispatch(closeMetadataPanel())

    // Regulatory via worker
    if (!workerRef) {
      return
    }

    const params: SearchLayersParams = {
      controlPlan,
      filteredAmpTypes,
      filteredRegulatoryTags,
      filteredRegulatoryThemes,
      globalSearchText,
      searchExtent,
      shouldFilterSearchOnMapExtent
    }
    try {
      const result: SearchLayersResult = await workerRef.searchLayers(params)
      dispatch(setRegulatoryLayersSearchResult(result.regulatoryResult))
      dispatch(setAMPsSearchResult(result.ampResult))
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Worker search error', err)
    }
  }

  const debouncedSearch = useMemo(
    () => debounce(search, 300),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      controlPlan,
      filteredAmpTypes,
      filteredRegulatoryTags,
      filteredRegulatoryThemes,
      globalSearchText,
      searchExtent,
      shouldFilterSearchOnMapExtent
    ]
  )

  useEffect(() => {
    debouncedSearch()

    return () => debouncedSearch.cancel()
  }, [debouncedSearch])
}
