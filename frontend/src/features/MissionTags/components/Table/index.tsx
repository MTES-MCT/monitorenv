import { useGetMissionsTagsQuery } from '@api/missionTagsAPI'
import { BackofficeWrapper, Title, TitleContainer } from '@features/BackOffice/components/style'
import { MISSION_TAG_TABLE_COLUMNS } from '@features/MissionTags/components/Table/Columns/constants'
import { saveMissionTag } from '@features/MissionTags/components/useCases/saveMissionTag'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Button, DataTable } from '@mtes-mct/monitor-ui'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useBeforeUnload } from 'react-router'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

import { FilterBar } from './FilterBar'
import { getFilters, isMissionTagValid } from './utils'

import type { MissionTagTable as MissionTagTableType, MissionTagToAPI } from '../../../../domain/entities/missionTags'

export function MissionTagTable() {
  const dispatch = useAppDispatch()
  const { filtersState } = useAppSelector(store => store.missionTagTable)

  const { data } = useGetMissionsTagsQuery(undefined)

  const [missionTags, setMissionTags] = useState<MissionTagTableType[]>([])
  const [draftMissionTags, setDraftMissionTags] = useState<MissionTagTableType[]>([])
  const [newMissionTags, setNewMissionTags] = useState<MissionTagTableType[]>([])

  useEffect(() => {
    const entityTags = Object.values(data ?? [])

    if (!entityTags) {
      return
    }

    const formattedTags = [...newMissionTags, ...entityTags].map(tag => ({
      // Put rowId first because it can be overrided by new missionTags
      rowId: uuidv4(),
      ...tag
    }))
    setMissionTags(formattedTags)
  }, [data, newMissionTags])

  const missionTagsDataTable = useMemo(() => {
    const filters = getFilters(missionTags, filtersState)

    return filters.reduce((previousTags: MissionTagTableType[], filter) => filter(previousTags), missionTags)
  }, [filtersState, missionTags])

  const addNewMissionTag = useCallback(() => {
    const newTag: MissionTagTableType = {
      id: undefined,
      isArchived: false,
      name: undefined,
      rowId: uuidv4()
    }
    setNewMissionTags(previousTags => [...previousTags, newTag])
    setDraftMissionTags(previousTags => [...previousTags, newTag])
  }, [])

  const addDraftRow = useCallback(
    (rowId: string) => {
      const draftTag = missionTags.find(tag => tag.rowId === rowId)
      if (!draftTag) {
        return
      }
      setDraftMissionTags(previous => [...previous, draftTag])
    },
    [missionTags]
  )

  const removeDraftRow = useCallback((rowId: string) => {
    setDraftMissionTags(previous => previous.filter(draftMissionTag => draftMissionTag.rowId !== rowId))
  }, [])

  const getMissionTag = useCallback(
    (rowId: string) => missionTagsDataTable.find(missionTag => missionTag.rowId === rowId),
    [missionTagsDataTable]
  )

  const getDraftMissionTag = useCallback(
    (rowId: string) => draftMissionTags.find(draftMissionTag => draftMissionTag.rowId === rowId),
    [draftMissionTags]
  )

  const isEditing = useCallback(({ id, original }) => !original.id || !!getDraftMissionTag(id), [getDraftMissionTag])

  const updateData = useCallback((rowId: string, columnId: string, value: string | boolean) => {
    setDraftMissionTags(previousDraft =>
      previousDraft.map(missionTag => {
        if (missionTag.rowId === rowId) {
          return { ...missionTag, [columnId]: value }
        }

        return missionTag
      })
    )
  }, [])

  const isValid = useCallback(
    (rowId: string) => {
      const missionTagToValidate = getDraftMissionTag(rowId)

      return missionTagToValidate && isMissionTagValid(missionTagToValidate)
    },
    [getDraftMissionTag]
  )

  const onEdit = useCallback((rowId: string) => addDraftRow(rowId), [addDraftRow])

  const onSubmit = useCallback(
    (rowId: string) => {
      const handleSave = async () => {
        const tagToSave = draftMissionTags.find(draftTag => draftTag.rowId === rowId)
        if (!tagToSave) {
          return
        }
        const missionTagToApi: MissionTagToAPI = {
          id: tagToSave.id,
          isArchived: tagToSave.isArchived,
          name: tagToSave.name ?? ''
        }
        const savedMissionTag = await dispatch(saveMissionTag(missionTagToApi))
        if (savedMissionTag) {
          // Updating table
          setMissionTags(previousTags =>
            previousTags.map(missionTag => {
              if (missionTag.rowId === rowId) {
                return { ...missionTag, ...(savedMissionTag as MissionTagTableType) }
              }

              return missionTag
            })
          )
        }
      }

      handleSave()
      removeDraftRow(rowId)
    },
    [dispatch, draftMissionTags, removeDraftRow]
  )

  const columns = useMemo(() => MISSION_TAG_TABLE_COLUMNS, [])

  const beforeUnload = useCallback(
    event => {
      if (draftMissionTags.length > 0) {
        event.preventDefault()

        // eslint-disable-next-line no-return-assign, no-param-reassign
        return (event.returnValue = 'blocked')
      }

      return undefined
    },
    [draftMissionTags]
  )

  useBeforeUnload(beforeUnload)

  return (
    <BackofficeWrapper>
      <TitleContainer>
        <Title>Étiquettes de mission</Title>
        <Button onClick={addNewMissionTag}>Ajouter une étiquette de mission</Button>
      </TitleContainer>
      <FilterBar />
      <Wrapper>
        <DataTable
          columns={columns}
          data={missionTagsDataTable}
          initialSorting={[{ desc: false, id: 'name' }]}
          tableOptions={{
            getRowId: row => row.rowId,
            meta: {
              getMissionTag,
              isEditing,
              isValid,
              onEdit,
              onSubmit,
              updateData
            }
          }}
        />
      </Wrapper>
    </BackofficeWrapper>
  )
}

const Wrapper = styled.div`
  overflow-y: auto;
  width: 100%;
  table {
    width: 100%;
  }
  td:nth-child(2) {
    overflow: visible !important;
  }
`
