import { useGetThemesQuery } from '@api/themesAPI'
import { BackofficeWrapper, Title, TitleContainer } from '@features/BackOffice/components/style'
import { THEME_TABLE_COLUMNS } from '@features/Themes/components/Table/Columns/constants'
import { ThemeForm } from '@features/Themes/components/Table/Form/ThemeForm'
import { useAppSelector } from '@hooks/useAppSelector'
import { Button, DataTable, Dialog } from '@mtes-mct/monitor-ui'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

import { FilterBar } from './FilterBar'
import { getFilters } from './utils'

import type { ThemeTable as ThemeTableType } from '../../../../domain/entities/themes'

export function ThemeTable() {
  const { filtersState } = useAppSelector(store => store.themeTable)

  const [startDate, endDate] = ['2000-01-01T00:00:00.000Z', '2999-12-31T23:59:59.000Z']
  const { data } = useGetThemesQuery([startDate, endDate], {
    refetchOnMountOrArgChange: true
  })

  const [themes, setThemes] = useState<ThemeTableType[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const [editingTheme, setEditingTheme] = useState<ThemeTableType | undefined>(undefined)

  useEffect(() => {
    const entityThemes = Object.values(data ?? [])

    if (!entityThemes) {
      return
    }

    const formattedThemes = [...entityThemes].map(theme => ({
      // Put rowId first because it can be overrided by new themes
      rowId: uuidv4(),
      ...theme,
      subThemes: theme.subThemes?.map(subTheme => ({ parentId: theme.id, rowId: uuidv4(), ...subTheme })) ?? []
    }))
    setThemes(formattedThemes)
  }, [data])

  const themesDataTable = useMemo(() => {
    const filters = getFilters(themes, filtersState)

    const filteredThemes = filters.reduce((previousThemes: ThemeTableType[], filter) => filter(previousThemes), themes)

    return filteredThemes.map(theme => ({
      ...theme,
      subRows: theme.subThemes
    }))
  }, [filtersState, themes])

  const addNewTheme = useCallback(() => {
    const newTheme: ThemeTableType = {
      endedAt: undefined,
      id: undefined,
      name: undefined,
      parentId: undefined,
      rowId: uuidv4(),
      startedAt: undefined,
      subThemes: []
    }
    setEditingTheme(newTheme)
    setIsOpen(true)
  }, [])

  const columns = useMemo(() => THEME_TABLE_COLUMNS, [])

  const onEdit = useCallback(
    (rowId: string) => {
      const themeToEdit = themes.find(theme => theme.rowId === rowId)
      if (!themeToEdit) {
        return
      }
      setEditingTheme(themeToEdit)
      setIsOpen(true)
    },
    [themes]
  )

  return (
    <BackofficeWrapper>
      {isOpen && (
        <Dialog>
          <ThemeForm
            onCancel={() => {
              setIsOpen(false)
              setEditingTheme(undefined)
            }}
            onSubmit={() => {
              setIsOpen(false)
              setEditingTheme(undefined)
            }}
            theme={editingTheme}
          />
        </Dialog>
      )}
      <TitleContainer>
        <Title>Thématiques</Title>
        <Button onClick={addNewTheme}>Ajouter une nouvelle thématique</Button>
      </TitleContainer>
      <FilterBar />
      <Wrapper>
        <DataTable
          columns={columns}
          data={themesDataTable}
          initialSorting={[{ desc: false, id: 'name' }]}
          tableOptions={{
            getRowId: row => row.rowId,
            meta: { onEdit }
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
