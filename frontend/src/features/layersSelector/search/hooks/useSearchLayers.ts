import { useGetAMPsQuery } from '@api/ampsAPI'
import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { useGetVigilanceAreasQuery } from '@api/vigilanceAreasAPI'
import { closeMetadataPanel } from '@features/layersSelector/metadataPanel/slice'
import { getIntersectingLayerIds } from '@features/layersSelector/utils/getIntersectingLayerIds'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useGetCurrentUserAuthorizationQueryOverride } from '@hooks/useGetCurrentUserAuthorizationQueryOverride'
import Fuse, { type Expression } from 'fuse.js'
import { debounce } from 'lodash'
import { useMemo } from 'react'

import { getFilterVigilanceAreasPerPeriod } from '../../utils/getFilteredVigilanceAreasPerPeriod'
import { setAMPsSearchResult, setRegulatoryLayersSearchResult, setVigilanceAreasSearchResult } from '../slice'

import type { AMP } from 'domain/entities/AMPs'
import type { RegulatoryLayerCompact } from 'domain/entities/regulatory'
import type { TagFromAPI } from 'domain/entities/tags'
import type { ThemeFromAPI } from 'domain/entities/themes'

export type SearchProps = {
  ampTypes: string[]
  extent: number[] | undefined
  regulatoryTags: TagFromAPI[]
  regulatoryThemes: ThemeFromAPI[]
  searchedText: string
  shouldSearchByExtent: boolean
  vigilanceAreaPeriodFilter: VigilanceArea.VigilanceAreaFilterPeriod | undefined
  vigilanceAreaSpecificPeriodFilter: string[] | undefined
}
export function useSearchLayers() {
  const dispatch = useAppDispatch()
  const { data: user } = useGetCurrentUserAuthorizationQueryOverride()
  const isSuperUser = user?.isSuperUser

  const { data: amps } = useGetAMPsQuery()
  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()
  const { data: vigilanceAreaLayers } = useGetVigilanceAreasQuery(undefined, { skip: !isSuperUser })

  const debouncedSearchLayers = useMemo(() => {
    const fuseRegulatory = new Fuse((regulatoryLayers?.entities && Object.values(regulatoryLayers?.entities)) || [], {
      ignoreLocation: true,
      includeScore: false,
      keys: [
        'layerName',
        'entityName',
        'refReg',
        'type',
        'tags.name',
        'tags.subTags.name',
        'themes.name',
        'themes.subThemes.name'
      ],
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
        keys: ['name', 'comments', 'themes', 'tags.name', 'tags.subTags.name', 'themes.name', 'themes.subThemes.name'],
        minMatchCharLength: 2,
        threshold: 0.2
      }
    )

    const searchFunction = async ({
      ampTypes,
      extent,
      regulatoryTags,
      regulatoryThemes,
      searchedText,
      shouldSearchByExtent,
      vigilanceAreaPeriodFilter,
      vigilanceAreaSpecificPeriodFilter
    }: SearchProps) => {
      const shouldSearchByText = searchedText?.length > 2
      const shouldSearchThroughAMPTypes = ampTypes?.length > 0
      const shouldSearchThroughRegulatoryTags = regulatoryTags?.length > 0
      const shouldSearchThroughRegulatoryThemes = regulatoryThemes?.length > 0

      let vigilanceAreasPerPeriod = [] as Array<VigilanceArea.VigilanceArea>
      let vigilanceAreaIdsPerPeriod = [] as number[]

      if (vigilanceAreaPeriodFilter) {
        vigilanceAreasPerPeriod = getFilterVigilanceAreasPerPeriod(
          vigilanceAreaLayers?.entities ? Object.values(vigilanceAreaLayers.entities) : [],
          vigilanceAreaPeriodFilter,
          vigilanceAreaSpecificPeriodFilter
        )

        vigilanceAreaIdsPerPeriod = vigilanceAreasPerPeriod
          .filter(vigilanceArea => !!vigilanceArea.id)
          .map(({ id }) => id) as number[]
      }

      if (shouldSearchByText || shouldSearchThroughAMPTypes || shouldSearchByExtent) {
        let searchedAMPS
        let itemSchema
        if (shouldSearchByText || shouldSearchThroughAMPTypes) {
          const filterWithTextExpression = shouldSearchByText
            ? {
                $or: [
                  { $path: ['name'], $val: searchedText },
                  { $path: ['type'], $val: searchedText }
                ],
                $val: searchedText
              }
            : undefined
          const filterWithType = shouldSearchThroughAMPTypes
            ? { $or: ampTypes.map(type => ({ $path: 'type', $val: type })) }
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
        dispatch(setAMPsSearchResult(undefined))
      }

      if (
        shouldSearchByText ||
        shouldSearchThroughRegulatoryTags ||
        shouldSearchByExtent ||
        shouldSearchThroughRegulatoryThemes
      ) {
        // Regulatory layers
        let searchedRegulatory
        let itemSchema
        if (shouldSearchByText || shouldSearchThroughRegulatoryTags || shouldSearchThroughRegulatoryThemes) {
          const filterWithTextExpression = shouldSearchByText
            ? {
                $or: [
                  { $path: ['layerName'], $val: searchedText },
                  { $path: ['entityName'], $val: searchedText },
                  { $path: ['refReg'], $val: searchedText },
                  { $path: ['type'], $val: searchedText },
                  { $path: ['tags.name'], $val: searchedText },
                  { $path: ['tags.subTags.name'], $val: searchedText },
                  { $path: ['themes.name'], $val: searchedText },
                  { $path: ['themes.subThemes.name'], $val: searchedText }
                ]
              }
            : undefined

          const filterWithTags = shouldSearchThroughRegulatoryTags
            ? {
                $or: [
                  ...regulatoryTags.map(tag => ({ $path: ['tags.name'], $val: tag.name })),
                  ...regulatoryTags.flatMap(tag =>
                    tag.subTags.map(subTag => ({ $path: ['tags.subTags.name'], $val: subTag.name }))
                  )
                ]
              }
            : undefined

          const filterWithThemes = shouldSearchThroughRegulatoryThemes
            ? {
                $or: [
                  ...regulatoryThemes.map(theme => ({ $path: ['themes.name'], $val: theme.name })),
                  ...regulatoryThemes.flatMap(theme =>
                    theme.subThemes.map(subTheme => ({
                      $path: ['themes.subThemes.name'],
                      $val: subTheme.name
                    }))
                  )
                ]
              }
            : undefined

          const filterExpression = [filterWithTextExpression, filterWithTags, filterWithThemes].filter(
            f => !!f
          ) as Expression[]
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
        if (shouldSearchByText || shouldSearchThroughRegulatoryTags || shouldSearchThroughRegulatoryThemes) {
          const filterVigilanceAreaWithTextExpression = shouldSearchByText
            ? {
                $or: [
                  { $path: ['name'], $val: searchedText },
                  { $path: ['comments'], $val: searchedText },
                  { $path: ['tags.name'], $val: searchedText },
                  { $path: ['tags.subTags.name'], $val: searchedText },
                  { $path: ['themes.name'], $val: searchedText },
                  { $path: ['themes.subThemes.name'], $val: searchedText }
                ]
              }
            : undefined

          const filterWithTags = shouldSearchThroughRegulatoryTags
            ? {
                $or: [
                  ...regulatoryTags.map(tag => ({ $path: ['tags.name'], $val: tag.name })),
                  ...regulatoryTags.flatMap(tag =>
                    tag.subTags.map(subTag => ({ $path: ['tags.subTags.name'], $val: subTag.name }))
                  )
                ]
              }
            : undefined

          const filterWithThemes = shouldSearchThroughRegulatoryThemes
            ? {
                $or: [
                  ...regulatoryThemes.map(theme => ({ $path: ['themes.name'], $val: theme.name })),
                  ...regulatoryThemes.flatMap(theme =>
                    theme.subThemes.map(subTheme => ({ $path: ['themes.subThemes.name'], $val: subTheme.name }))
                  )
                ]
              }
            : undefined

          const filterExpression = [filterVigilanceAreaWithTextExpression, filterWithTags, filterWithThemes].filter(
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
        dispatch(setRegulatoryLayersSearchResult(undefined))
      }
    }

    return (args: SearchProps) => {
      dispatch(closeMetadataPanel())
      debounce(searchFunction, 300, { trailing: true })(args)
    }
  }, [dispatch, regulatoryLayers, amps, vigilanceAreaLayers])

  return debouncedSearchLayers
}
