import { closeMetadataPanel } from '@features/layersSelector/metadataPanel/slice'
import { getIntersectingLayerIds } from '@features/layersSelector/utils/getIntersectingLayerIds'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import Fuse, { type Expression } from 'fuse.js'
import { debounce } from 'lodash'
import { useMemo } from 'react'

import { getFilterVigilanceAreasPerPeriod } from '../../utils/getFilteredVigilanceAreasPerPeriod'
import { setAMPsSearchResult, setRegulatoryLayersSearchResult, setVigilanceAreasSearchResult } from '../slice'

import type { AMP } from 'domain/entities/AMPs'
import type { RegulatoryLayerCompact } from 'domain/entities/regulatory'

export function useSearchLayers({ amps, regulatoryLayers, vigilanceAreaLayers }) {
  const dispatch = useAppDispatch()
  const debouncedSearchLayers = useMemo(() => {
    const fuseRegulatory = new Fuse((regulatoryLayers?.entities && Object.values(regulatoryLayers?.entities)) || [], {
      ignoreLocation: true,
      includeScore: false,
      keys: ['layer_name', 'entity_name', 'ref_reg', 'type', 'thematique'],
      minMatchCharLength: 2,
      threshold: 0.2
    })
    const fuseAMPs = new Fuse((amps?.entities && Object.values(amps?.entities)) || [], {
      ignoreLocation: true,
      includeScore: false,
      keys: ['name', 'type'],
      minMatchCharLength: 2,
      threshold: 0.2
    })

    const fuseVigilanceAreas = new Fuse(
      (vigilanceAreaLayers?.entities && Object.values(vigilanceAreaLayers?.entities)) || [],
      {
        ignoreLocation: true,
        includeScore: false,
        keys: ['name', 'comments', 'themes'],
        minMatchCharLength: 2,
        threshold: 0.2
      }
    )

    const searchFunction = async ({
      ampTypes,
      extent,
      regulatoryThemes,
      searchedText,
      shouldSearchByExtent,
      vigilanceAreaPeriodFilter,
      vigilanceAreaSpecificPeriodFilter
    }: {
      ampTypes: string[]
      extent: number[] | undefined
      regulatoryThemes: string[]
      searchedText: string
      shouldSearchByExtent: boolean
      vigilanceAreaPeriodFilter: string | undefined
      vigilanceAreaSpecificPeriodFilter: string[] | undefined
    }) => {
      const shouldSearchByText = searchedText?.length > 2
      const shouldSeachTroughAMPTypes = ampTypes?.length > 0
      const shouldSearchThroughRegulatoryThemes = regulatoryThemes?.length > 0

      let vigilanceAreasPerPeriod = [] as Array<VigilanceArea.VigilanceArea>
      let vigilanceAreaIdsPerPeriod = [] as Array<number>

      if (vigilanceAreaPeriodFilter) {
        vigilanceAreasPerPeriod = getFilterVigilanceAreasPerPeriod(
          vigilanceAreaLayers?.entities,
          vigilanceAreaPeriodFilter,
          vigilanceAreaSpecificPeriodFilter
        )

        vigilanceAreaIdsPerPeriod = vigilanceAreasPerPeriod
          .filter(vigilanceArea => !!vigilanceArea.id)
          .map(({ id }) => id) as number[]
      }

      if (shouldSearchByText || shouldSeachTroughAMPTypes || shouldSearchByExtent) {
        let searchedAMPS
        let itemSchema
        if (shouldSearchByText || shouldSeachTroughAMPTypes) {
          const filterWithTextExpression = shouldSearchByText
            ? {
                $or: [
                  { $path: ['name'], $val: searchedText },
                  { $path: ['type'], $val: searchedText }
                ],
                $val: searchedText
              }
            : undefined
          const filterWithType = shouldSeachTroughAMPTypes
            ? { $or: ampTypes.map(theme => ({ $path: 'type', $val: theme })) }
            : undefined

          const filterExpression = [filterWithTextExpression, filterWithType].filter(f => !!f) as Expression[]

          searchedAMPS = fuseAMPs?.search<AMP>({
            $and: filterExpression
          })
          itemSchema = { bboxPath: 'item.bbox', idPath: 'item.id' }
        } else {
          searchedAMPS = amps?.entities && Object.values(amps?.entities)
          itemSchema = { bboxPath: 'bbox', idPath: 'id' }
        }
        const searchedAMPsInExtent = getIntersectingLayerIds<AMP>(
          shouldSearchByExtent,
          searchedAMPS,
          extent,
          itemSchema
        )
        dispatch(setAMPsSearchResult(searchedAMPsInExtent))
      } else {
        dispatch(setAMPsSearchResult([]))
      }

      if (shouldSearchByText || shouldSearchThroughRegulatoryThemes || shouldSearchByExtent) {
        // Regulatory layers
        let searchedRegulatory
        let itemSchema
        if (shouldSearchByText || shouldSearchThroughRegulatoryThemes) {
          const filterWithTextExpression = shouldSearchByText
            ? {
                $or: [
                  { $path: ['layer_name'], $val: searchedText },
                  { $path: ['entity_name'], $val: searchedText },
                  { $path: ['ref_reg'], $val: searchedText },
                  { $path: ['type'], $val: searchedText }
                ]
              }
            : undefined

          const filterWithTheme = shouldSearchThroughRegulatoryThemes
            ? { $or: regulatoryThemes.map(theme => ({ $path: ['thematique'], $val: theme })) }
            : undefined

          const filterExpression = [filterWithTextExpression, filterWithTheme].filter(f => !!f) as Expression[]
          searchedRegulatory = fuseRegulatory.search<RegulatoryLayerCompact>({
            $and: filterExpression
          })

          itemSchema = { bboxPath: 'item.bbox', idPath: 'item.id' }
        } else {
          searchedRegulatory = regulatoryLayers?.entities && Object.values(regulatoryLayers?.entities)
          itemSchema = { bboxPath: 'bbox', idPath: 'id' }
        }

        const searchedRegulatoryInExtent = getIntersectingLayerIds<RegulatoryLayerCompact>(
          shouldSearchByExtent,
          searchedRegulatory,
          extent,
          itemSchema
        )
        dispatch(setRegulatoryLayersSearchResult(searchedRegulatoryInExtent))

        // Vigilance area layers
        let searchedVigilanceArea
        let vigilanceAreaSchema
        if (shouldSearchByText || shouldSearchThroughRegulatoryThemes) {
          const filterVigilanceAreaWithTextExpression = shouldSearchByText
            ? {
                $or: [
                  { $path: ['name'], $val: searchedText },
                  { $path: ['comments'], $val: searchedText },
                  { $path: ['themes'], $val: searchedText }
                ]
              }
            : undefined

          const filterWithTheme = shouldSearchThroughRegulatoryThemes
            ? { $or: regulatoryThemes.map(theme => ({ $path: ['themes'], $val: theme })) }
            : undefined

          const filterExpression = [filterVigilanceAreaWithTextExpression, filterWithTheme].filter(
            f => !!f
          ) as Expression[]
          const resultSearchVigilanceAreas = fuseVigilanceAreas.search<VigilanceArea.VigilanceAreaLayer>({
            $and: filterExpression
          })

          searchedVigilanceArea = vigilanceAreaPeriodFilter
            ? resultSearchVigilanceAreas.filter(({ item }) => item.id && vigilanceAreaIdsPerPeriod.includes(item.id))
            : resultSearchVigilanceAreas
          vigilanceAreaSchema = { bboxPath: 'item.bbox', idPath: 'item.id' }
        } else {
          searchedVigilanceArea = vigilanceAreaPeriodFilter
            ? vigilanceAreasPerPeriod
            : Object.values(vigilanceAreaLayers?.entities ?? {})
          vigilanceAreaSchema = { bboxPath: 'bbox', idPath: 'id' }
        }

        const searchedVigilanceAreasInExtent = getIntersectingLayerIds<VigilanceArea.VigilanceAreaLayer>(
          shouldSearchByExtent,
          searchedVigilanceArea,
          extent,
          vigilanceAreaSchema
        )

        dispatch(setVigilanceAreasSearchResult(searchedVigilanceAreasInExtent))
      } else {
        dispatch(setVigilanceAreasSearchResult(vigilanceAreaIdsPerPeriod))
        dispatch(setRegulatoryLayersSearchResult([]))
      }
    }

    return args => {
      dispatch(closeMetadataPanel())
      debounce(searchFunction, 300, { trailing: true })(args)
    }
  }, [dispatch, regulatoryLayers, amps, vigilanceAreaLayers])

  return debouncedSearchLayers
}
