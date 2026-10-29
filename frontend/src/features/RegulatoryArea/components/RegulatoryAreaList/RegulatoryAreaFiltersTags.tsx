import { ResetButton } from '@features/commonComponents/ResetButton'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { SingleTag } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { regulatoryAreaTableActions, type FiltersState } from './slice'
import { PeriodFilter, RegHelperFilter } from './types'

export function RegulatoryAreaFiltersTags() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector(store => store.regulatoryAreaTable.filtersState)

  const deleteSimpleFilter = (filterKey: keyof FiltersState) => {
    dispatch(regulatoryAreaTableActions.setFilter({ key: filterKey, value: undefined }))
  }

  const deleteThemeOrTagFilter = (filterKey: 'themes' | 'tags', id: number) => {
    const nextValue = filters[filterKey]?.filter(item => item.id !== id)
    dispatch(regulatoryAreaTableActions.setFilter({ key: filterKey, value: nextValue }))
  }

  const deleteSubThemeFilter = (themeId: number, subThemeId: number) => {
    const nextValue = filters.themes
      ?.map(item => {
        if (item.id === themeId) {
          const updatedSubThemes = item.subThemes?.filter(subTheme => subTheme.id !== subThemeId)
          if (updatedSubThemes?.length === 0) {
            return null
          }

          return {
            ...item,
            subThemes: updatedSubThemes
          }
        }

        return item
      })
      .filter(item => item !== null)
    dispatch(regulatoryAreaTableActions.setFilter({ key: 'themes', value: nextValue }))
  }

  const deleteSubTagFilter = (tagId: number, subTagId: number) => {
    const nextValue = filters.tags
      ?.map(item => {
        if (item.id === tagId) {
          const updatedSubTags = item.subTags?.filter(subTag => subTag.id !== subTagId)
          if (updatedSubTags?.length === 0) {
            return null
          }

          return {
            ...item,
            subTags: updatedSubTags
          }
        }

        return item
      })
      .filter(item => item !== null)
    dispatch(regulatoryAreaTableActions.setFilter({ key: 'tags', value: nextValue }))
  }

  const deleteSeaFrontFilter = (seaFront: string) => {
    const nextValue = filters.seaFronts?.filter(item => item !== seaFront)
    dispatch(regulatoryAreaTableActions.setFilter({ key: 'seaFronts', value: nextValue }))
  }

  const resetFilters = () => {
    dispatch(regulatoryAreaTableActions.resetFilters())
  }

  return (
    <Wrapper>
      {filters.period && filters.period !== 'CUSTOM' && (
        <SingleTag key="period" onDelete={() => deleteSimpleFilter('period')}>
          {PeriodFilter[filters.period]}
        </SingleTag>
      )}
      {filters.themes &&
        filters.themes.map(theme => (
          <Wrapper key={theme.name}>
            <SingleTag key={theme.name} onDelete={() => deleteThemeOrTagFilter('themes', theme.id)}>
              {theme.name}
            </SingleTag>
            {theme.subThemes &&
              theme.subThemes.map(subTheme => (
                <SingleTag key={subTheme.name} onDelete={() => deleteSubThemeFilter(theme.id, subTheme.id)}>
                  {subTheme.name}
                </SingleTag>
              ))}
          </Wrapper>
        ))}
      {filters.tags &&
        filters.tags.map(tag => (
          <Wrapper key={tag.name}>
            <SingleTag key={tag.name} onDelete={() => deleteThemeOrTagFilter('tags', tag.id)}>
              {tag.name}
            </SingleTag>
            {tag.subTags &&
              tag.subTags.map(subTag => (
                <SingleTag key={subTag.name} onDelete={() => deleteSubTagFilter(tag.id, subTag.id)}>
                  {subTag.name}
                </SingleTag>
              ))}
          </Wrapper>
        ))}
      {filters.seaFronts &&
        filters.seaFronts.map(seaFront => (
          <SingleTag key={seaFront} onDelete={() => deleteSeaFrontFilter(seaFront)}>
            {seaFront}
          </SingleTag>
        ))}
      {filters.regHelper && (
        <SingleTag key="regHelper" onDelete={() => deleteSimpleFilter('regHelper')}>
          {RegHelperFilter[filters.regHelper]}
        </SingleTag>
      )}
      <ResetButton onClick={resetFilters} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`
