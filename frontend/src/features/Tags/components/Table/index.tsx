import { useGetTagsQuery } from '@api/tagsAPI'
import { BackofficeWrapper, Title, TitleContainer } from '@features/BackOffice/components/style'
import { TAG_TABLE_COLUMNS } from '@features/Tags/components/Table/Columns/constants'
import { saveTag } from '@features/Tags/components/useCases/saveTag'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Button, DataTable } from '@mtes-mct/monitor-ui'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { FilterBar } from './FilterBar'
import { getFilters, isTagValid } from './utils'

import type { TagTable as TagTableType, TagToAPI } from '../../../../domain/entities/tags'

export function TagTable() {
  const dispatch = useAppDispatch()
  const { filtersState } = useAppSelector(store => store.tagTable)

  const [startDate, endDate] = ['2000-01-01T00:00:00.000Z', '2999-12-31T23:59:59.000Z']
  const { data } = useGetTagsQuery([startDate, endDate], undefined)

  const [tags, setTags] = useState<TagTableType[]>([])
  const [draftTags, setDraftTags] = useState<TagTableType[]>([])
  const [newTags, setNewTags] = useState<TagTableType[]>([])

  useEffect(() => {
    const entityTags = Object.values(data ?? [])

    if (!entityTags) {
      return
    }

    const formattedTags = [...newTags, ...entityTags].map(tag => ({
      // Put rowId first because it can be overrided by new tags
      rowId: uuidv4(),
      ...tag,
      subTags: tag.subTags?.map(subTag => ({ ...subTag, parentId: tag.id, rowId: uuidv4() })) ?? []
    }))
    setTags(formattedTags)
  }, [data, newTags])

  const tagsDataTable = useMemo(() => {
    const filters = getFilters(tags, filtersState)

    const filteredTags = filters.reduce((previousTags: TagTableType[], filter) => filter(previousTags), tags)

    return filteredTags.map(tag => ({
      ...tag,
      subRows: tag.subTags
    }))
  }, [filtersState, tags])

  const addDraftRow = useCallback(
    (rowId: string) => {
      const allTagsAndSubTags = tags.flatMap(tag => [tag, ...tag.subTags])
      const draftTag = allTagsAndSubTags.find(tag => tag.rowId === rowId)
      if (!draftTag) {
        return
      }
      setDraftTags(previous => [...previous, draftTag])
    },
    [tags]
  )

  const removeDraftRow = useCallback((rowId: string) => {
    setDraftTags(previous => previous.filter(draftTag => draftTag.rowId !== rowId))
  }, [])

  const getDraftTag = useCallback((rowId: string) => draftTags.find(draftTag => draftTag.rowId === rowId), [draftTags])

  const isEditing = useCallback(({ id, original }) => !original.id || !!getDraftTag(id), [getDraftTag])

  const onAddSubTag = useCallback((rowId: string) => {
    setTags(previousTags =>
      previousTags.map(tag => {
        if (tag.rowId === rowId) {
          const newSubTag: TagTableType = {
            endedAt: undefined,
            id: undefined,
            name: undefined,
            parentId: tag.id,
            rowId: uuidv4(),
            startedAt: undefined,
            subTags: []
          }
          // Added to drafted tags
          setDraftTags(previousDraftTags => [...previousDraftTags, newSubTag])

          return {
            ...tag,
            subTags: [...(tag.subTags ?? []), newSubTag]
          }
        }

        return tag
      })
    )
  }, [])

  const updateData = useCallback((rowId: string, columnId: string, value: string) => {
    setDraftTags(previousDraft =>
      previousDraft.map(tag => {
        if (tag.rowId === rowId) {
          return { ...tag, [columnId]: value }
        }

        return tag
      })
    )
  }, [])

  const isValid = useCallback(
    (rowId: string) => {
      const tagToValidate = getDraftTag(rowId)

      return tagToValidate && isTagValid(tagToValidate)
    },
    [getDraftTag]
  )

  const onEdit = useCallback((rowId: string) => addDraftRow(rowId), [addDraftRow])

  const onSubmit = useCallback(
    (rowId: string) => {
      const handleSave = async () => {
        const tagToSave = draftTags.find(draftTag => draftTag.rowId === rowId)
        if (!tagToSave) {
          return
        }
        const tagToApi: TagToAPI = {
          endedAt: tagToSave.endedAt,
          id: tagToSave.id,
          name: tagToSave.name,
          parentId: tagToSave.parentId,
          startedAt: tagToSave.startedAt
        }
        const savedTag = await dispatch(saveTag(tagToApi))
        if (savedTag) {
          // Updating table
          setTags(previousTags =>
            previousTags.map(tag => {
              if (tag.rowId === rowId) {
                return { ...tag, ...(savedTag as TagTableType) }
              }

              return {
                ...tag,
                subTags: tag.subTags.map(subTag => {
                  if (subTag.rowId === rowId) {
                    return { ...subTag, ...(savedTag as TagTableType) }
                  }

                  return subTag
                })
              }
            })
          )
        }
      }

      handleSave()
      removeDraftRow(rowId)
    },
    [dispatch, draftTags, removeDraftRow]
  )

  const columns = useMemo(() => TAG_TABLE_COLUMNS, [])

  return (
    <BackofficeWrapper>
      <TitleContainer>
        <Title>Tags</Title>
        <Button
          onClick={() => {
            const newTag: TagTableType = {
              endedAt: undefined,
              id: undefined,
              name: undefined,
              rowId: uuidv4(),
              startedAt: undefined,
              subTags: []
            }
            setNewTags(previousTags => [...previousTags, newTag])
            setDraftTags(previousTags => [...previousTags, newTag])
          }}
        >
          Ajouter un nouveau tag
        </Button>
      </TitleContainer>
      <FilterBar />
      <DataTable
        columns={columns}
        data={tagsDataTable}
        initialSorting={[{ desc: false, id: 'name' }]}
        tableOptions={{
          getRowId: row => row.rowId,
          meta: {
            getDraftTag,
            isEditing,
            isValid,
            onAddSubTag,
            onEdit,
            onSubmit,
            updateData
          }
        }}
      />
    </BackofficeWrapper>
  )
}
