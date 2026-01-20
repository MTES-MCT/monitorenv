import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { get } from 'lodash'
import { transformExtent } from 'ol/proj'
import RBush, { type BBox } from 'rbush'

import type { TagOption } from 'domain/entities/tags'
import type { ThemeOption } from 'domain/entities/themes'

export function filterByThemes(themes: ThemeOption[]) {
  return {
    $or: [
      ...themes.map(theme => ({ $path: ['themes.name'], $val: theme.name })),
      ...themes.flatMap(theme =>
        (theme.subThemes ?? []).map(subTheme => ({ $path: ['themes.subThemes.name'], $val: subTheme.name }))
      )
    ]
  }
}

export function filterByTags(tags: TagOption[]) {
  return {
    $or: [
      ...tags.map(tag => ({ $path: ['tags.name'], $val: tag.name })),
      ...tags.flatMap(tag => (tag.subTags ?? []).map(subTag => ({ $path: ['tags.subTags.name'], $val: subTag.name })))
    ]
  }
}

export function filterThemesByText(searchedText: string) {
  return [
    { $path: ['themes.name'], $val: searchedText },
    { $path: ['themes.subThemes.name'], $val: searchedText }
  ]
}

export function filterTagsByText(searchedText: string) {
  return [
    { $path: ['tags.name'], $val: searchedText },
    { $path: ['tags.subTags.name'], $val: searchedText }
  ]
}

export interface BboxWithId extends BBox {
  id: number
}

export function searchAreaIdsByExtent<T extends BboxWithId>(
  searchExtent: number[] | undefined,
  searchedObject: T[],
  bboxPath: string,
  idPath: string,
  shouldFilter: boolean
) {
  const tree = new RBush<T>()

  if (!shouldFilter) {
    return searchedObject?.flatMap(item => get(item, idPath) as number)
  }
  if (searchExtent && searchExtent?.length > 0) {
    const itemBbox = searchedObject.flatMap(item => {
      const [minX, minY, maxX, maxY] = get(item, bboxPath)

      return { id: get(item, idPath), maxX, maxY, minX, minY } as T
    })

    tree.load(itemBbox)

    const extent = transformExtent(searchExtent, OPENLAYERS_PROJECTION, WSG84_PROJECTION)
    const [minX, minY, maxX, maxY] = extent
    if (minX && minY && maxX && maxY) {
      return tree.search({ maxX, maxY, minX, minY }).flatMap(item => item.id)
    }
  }

  return []
}
