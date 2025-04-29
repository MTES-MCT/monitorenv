import type { TagFromAPI } from 'domain/entities/tags'
import type { ThemeFromAPI } from 'domain/entities/themes'

export function filterByThemes(themes: ThemeFromAPI[]) {
  return {
    $or: [
      ...themes.map(theme => ({ $path: ['themes.name'], $val: theme.name })),
      ...themes.flatMap(theme =>
        theme.subThemes.map(subTheme => ({ $path: ['themes.subThemes.name'], $val: subTheme.name }))
      )
    ]
  }
}

export function filterByTags(tags: TagFromAPI[]) {
  return {
    $or: [
      ...tags.map(tag => ({ $path: ['tags.name'], $val: tag.name })),
      ...tags.flatMap(tag => tag.subTags.map(subTag => ({ $path: ['tags.subTags.name'], $val: subTag.name })))
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
