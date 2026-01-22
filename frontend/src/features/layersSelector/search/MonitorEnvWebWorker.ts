/// <reference lib="webworker" />
import * as Comlink from 'comlink'
import Fuse from 'fuse.js'

import { getIntersectingLayerIds } from '../utils/getIntersectingLayerIds'

import type { AMP } from 'domain/entities/AMPs'
import type { RegulatoryLayerCompact } from 'domain/entities/regulatory'
import type { TagFromAPI, TagOption } from 'domain/entities/tags'
import type { ThemeFromAPI, ThemeOption } from 'domain/entities/themes'

/** Paramètres passés au worker pour la recherche */
export interface SearchLayersParams {
  controlPlan?: string
  filteredAmpTypes: string[]
  filteredRegulatoryTags: TagOption[]
  filteredRegulatoryThemes: ThemeOption[]
  globalSearchText?: string
  searchExtent: any
  shouldFilterSearchOnMapExtent: boolean
}

export interface SearchLayersResult {
  ampResult?: number[]
  regulatoryResult?: number[]
}

/** Item minimal pour l’index Fuse côté worker */
export interface RegulatoryIndexItem extends RegulatoryLayerCompact {
  searchText?: string
  tags: TagFromAPI[]
  themes: ThemeFromAPI[]
}

export interface AMPIndexItem extends AMP {
  bbox: any
  id: number
  name: string
  type: string
}

let fuseAMP: Fuse<AMPIndexItem> | null = null
let ampIndex: AMPIndexItem[] = []
let ampVersionCached: string | null = null

let fuseRegulatory: Fuse<RegulatoryIndexItem> | null = null
let regulatoryIndex: RegulatoryIndexItem[] = []
let regulatoryVersionCached: string | null = null
let lastQueryKey: string | null = null
let lastResultIds: number[] | null = null

function flattenTags(tags: TagFromAPI[]): string[] {
  return tags.flatMap(t => {
    const names = [t.name]
    if (t.subTags) {
      names.push(...t.subTags.map(st => st.name))
    }

    return names
  })
}

function flattenThemes(themes: ThemeFromAPI[]): string[] {
  return themes.flatMap(t => {
    const names = [t.name]
    if (t.subThemes) {
      names.push(...t.subThemes.map(st => st.name))
    }

    return names
  })
}

function buildRegulatoryAreaSearchText(layer: RegulatoryIndexItem): string {
  const tagNames = flattenTags(layer.tags)
  const themeNames = flattenThemes(layer.themes)

  return [
    layer.layerName,
    layer.resume,
    layer.polyName,
    layer.refReg,
    layer.type,
    layer.plan,
    themeNames.join(' '),
    tagNames.join(' ')
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

export function initRegulatoryIndex(layers: RegulatoryIndexItem[], version: string) {
  if (regulatoryVersionCached === version) {
    return
  }

  regulatoryIndex = layers.map(layer => ({ ...layer, searchText: buildRegulatoryAreaSearchText(layer) }))

  fuseRegulatory = new Fuse(regulatoryIndex, {
    ignoreLocation: true,
    keys: ['searchText'],
    minMatchCharLength: 2,
    threshold: 0.3
  })
  regulatoryVersionCached = version
  lastQueryKey = null
  lastResultIds = null
}

export function initAMPIndex(amps: AMPIndexItem[], version: string) {
  if (ampVersionCached === version) {
    return
  }

  ampIndex = amps
  fuseAMP = new Fuse(ampIndex, {
    ignoreLocation: true,
    keys: ['searchText'],
    minMatchCharLength: 2,
    threshold: 0.3
  })

  ampVersionCached = version
}
function searchAMPs(params: SearchLayersParams): number[] | undefined {
  if (!fuseAMP) {
    return undefined
  }

  const { filteredAmpTypes, globalSearchText, searchExtent, shouldFilterSearchOnMapExtent } = params

  let candidates: AMPIndexItem[] = ampIndex

  if (globalSearchText && globalSearchText.length > 2) {
    candidates = fuseAMP.search(globalSearchText.toLowerCase()).map(r => r.item)
  }

  if (filteredAmpTypes.length) {
    candidates = candidates.filter(a => filteredAmpTypes.includes(a.type ?? ''))
  }

  return getIntersectingLayerIds(shouldFilterSearchOnMapExtent, candidates, searchExtent, {
    bboxPath: 'bbox',
    idPath: 'id'
  })
}

// Filtre métier côté worker
function applyBusinessFilters(items: RegulatoryIndexItem[], params: SearchLayersParams) {
  const { controlPlan, filteredRegulatoryTags, filteredRegulatoryThemes } = params

  return items.filter(item => {
    if (controlPlan && item.plan.includes(controlPlan) === false) {
      return false
    }

    if (filteredRegulatoryTags.length && !filteredRegulatoryTags.some(t => item.tags.some(tag => tag.id === t.id))) {
      return false
    }
    if (
      filteredRegulatoryThemes.length &&
      !filteredRegulatoryThemes.some(t => item.themes.some(theme => theme.id === t.id))
    ) {
      return false
    }

    return true
  })
}

// Génère une clé pour le cache interne du worker
function buildQueryKey(params: SearchLayersParams) {
  return JSON.stringify({
    extent: params.shouldFilterSearchOnMapExtent,
    plan: params.controlPlan,
    q: params.globalSearchText,
    tags: params.filteredRegulatoryTags,
    themes: params.filteredRegulatoryThemes
  })
}

const api = {
  initAMPIndex,
  initRegulatoryIndex,
  async searchLayers(
    params: Omit<SearchLayersParams, 'regulatoryLayers' | 'regulatoryVersion'>
  ): Promise<SearchLayersResult> {
    if (!fuseRegulatory) {
      return { regulatoryResult: undefined }
    }

    const {
      controlPlan,
      filteredAmpTypes,
      filteredRegulatoryTags,
      filteredRegulatoryThemes,
      globalSearchText,
      searchExtent,
      shouldFilterSearchOnMapExtent
    } = params

    const hasFilters =
      !!globalSearchText ||
      filteredRegulatoryTags.length ||
      filteredRegulatoryThemes.length ||
      filteredAmpTypes.length ||
      !!controlPlan ||
      shouldFilterSearchOnMapExtent
    if (!hasFilters) {
      return { regulatoryResult: undefined }
    }

    const queryKey = buildQueryKey(params)
    if (queryKey === lastQueryKey && lastResultIds) {
      return { regulatoryResult: lastResultIds }
    }

    // Fuse search
    let candidates: RegulatoryIndexItem[] = regulatoryIndex
    if (globalSearchText && globalSearchText.length > 2) {
      candidates = fuseRegulatory!.search(globalSearchText.toLowerCase()).map(r => r.item)
    }

    const filtered = applyBusinessFilters(candidates, params)
    const resultIds = getIntersectingLayerIds(shouldFilterSearchOnMapExtent, filtered, searchExtent, {
      bboxPath: 'bbox',
      idPath: 'id'
    })

    lastQueryKey = queryKey
    lastResultIds = resultIds

    return { ampResult: searchAMPs(params), regulatoryResult: resultIds }
  }
}

Comlink.expose(api)
