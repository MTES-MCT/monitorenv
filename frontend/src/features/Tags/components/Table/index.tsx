import { useGetTagsQuery } from '@api/tagsAPI'
import { BackofficeWrapper, Title, TitleContainer } from '@features/BackOffice/components/style'
import { TAG_TABLE_COLUMNS } from '@features/Tags/components/Table/constants'
import { Button, DataTable } from '@mtes-mct/monitor-ui'
import { useMemo, useState } from 'react'

import { FilterBar } from './FilterBar'
import { getFilters } from './utils'
import { RTK_DEFAULT_QUERY_OPTIONS } from '../../../../api/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'

import type { TagFromAPI, TagToAPI } from '../../../../domain/entities/tags'

export function TagTable() {
  const tagFilters = useAppSelector(store => store.tagTable.filtersState)
  const { data: entityTags } = useGetTagsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)

  const [newTags, setNewTags] = useState<TagToAPI[]>([])

  const tagsDataTable = useMemo(() => {
    const tags = Object.values(entityTags ?? [])
    if (!tags) {
      return undefined
    }

    const filters = getFilters(tags, tagFilters)

    return newTags.concat(
      filters
        .reduce((previousTags: TagFromAPI[], filter) => filter(previousTags), tags)
        .map(tag => ({
          ...tag,
          subRows: tag.subTags
        }))
    )
  }, [tagFilters, entityTags, newTags])

  // const onAddSubTag = (parentId: number) => {}

  const columns = useMemo(() => TAG_TABLE_COLUMNS, [])

  return (
    <BackofficeWrapper>
      <TitleContainer>
        <Title>Tags</Title>
        <Button
          onClick={() => {
            const newTag: TagToAPI = {
              endedAt: undefined,
              id: undefined,
              name: undefined,
              startedAt: undefined,
              subTags: []
            }
            setNewTags(oldTags => [...oldTags, newTag])
          }}
        >
          Ajouter un nouveau tag
        </Button>
      </TitleContainer>
      <FilterBar />
      <DataTable columns={columns()} data={tagsDataTable} initialSorting={[{ desc: false, id: 'name' }]} />
    </BackofficeWrapper>
  )
}
