import type { TagFromAPI, TagOption } from 'domain/entities/tags'
import type { ThemeFromAPI, ThemeOption } from 'domain/entities/themes'

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

export function areArraysEqual(a?: number[], b?: number[]) {
  if (a === b) {
    return true
  }

  if (!a || !b) {
    return false
  }

  if (a.length !== b.length) {
    return false
  }

  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) {
      return false
    }
  }

  return true
}

export function flattenTags(tags: TagFromAPI[]): string[] {
  return tags.flatMap(t => {
    const names = [t.name]
    if (t.subTags) {
      names.push(...t.subTags.map(st => st.name))
    }

    return names
  })
}

export function flattenThemes(themes: ThemeFromAPI[]): string[] {
  return themes.flatMap(t => {
    const names = [t.name]
    if (t.subThemes) {
      names.push(...t.subThemes.map(st => st.name))
    }

    return names
  })
}

export function buildRegulatoryAreaSearchText(layer): string {
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
