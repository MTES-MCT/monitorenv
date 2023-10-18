import { DataTable, THEME } from '@mtes-mct/monitor-ui'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import { FilterBar } from './FilterBar'
import { getBaseTableColumns, getFilters } from './utils'
import { DELETE_BASE_ERROR_MESSAGE, basesAPI, useGetBasesQuery } from '../../../../api/basesAPI'
import { ConfirmationModal } from '../../../../components/ConfirmationModal'
import { Dialog } from '../../../../components/Dialog'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { NavButton } from '../../../../ui/NavButton'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../../../BackOfficeMenu/constants'

import type { Base } from '../../../../domain/entities/base'
import type { CellContext } from '@tanstack/react-table'

export function BaseTable() {
  const [isDeletionConfirnationModalOpen, setIsDeletionConfirnationModalOpen] = useState(false)
  const [isImpossibleDeletionDialogOpen, setIsImpossibleDeletionDialogOpen] = useState(false)
  const [targetedBase, setTargettedBase] = useState<Base.Base | undefined>(undefined)

  const backOfficeBaseList = useAppSelector(store => store.backOfficeBaseList)
  const dispatch = useAppDispatch()
  const { data: bases } = useGetBasesQuery()

  const filteredBases = useMemo(() => {
    if (!bases) {
      return undefined
    }

    const filters = getFilters(bases, backOfficeBaseList.filtersState)

    return filters.reduce((previousBases, filter) => filter(previousBases), bases)
  }, [backOfficeBaseList.filtersState, bases])

  const askForDeletionConfirmation = useCallback(
    async (cellContext: CellContext<Base.Base, unknown>) => {
      const base = cellContext.getValue<Base.Base>()

      const { data: canDeleteBase } = await dispatch(basesAPI.endpoints.canDeleteBase.initiate(base.id))
      if (!canDeleteBase) {
        setIsImpossibleDeletionDialogOpen(true)

        return
      }

      setTargettedBase(base)
      setIsDeletionConfirnationModalOpen(true)
    },
    [dispatch]
  )

  const close = useCallback(() => {
    setIsDeletionConfirnationModalOpen(false)
    setIsImpossibleDeletionDialogOpen(false)
  }, [])

  const confirmDeletion = useCallback(
    async (baseId: number) => {
      await dispatch(basesAPI.endpoints.deleteBase.initiate(baseId))

      close()
    },
    [close, dispatch]
  )

  const baseTableColumns = useMemo(() => getBaseTableColumns(askForDeletionConfirmation), [askForDeletionConfirmation])

  return (
    <>
      <Title>Gestion des bases</Title>

      <FilterBar />

      <ActionGroup>
        <NavButton to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.BASE_LIST]}/new`}>Nouvelle base</NavButton>
      </ActionGroup>

      <DataTable columns={baseTableColumns} data={filteredBases} initialSorting={[{ desc: false, id: 'name' }]} />

      {isDeletionConfirnationModalOpen && targetedBase && (
        <ConfirmationModal
          confirmationButtonLabel="Supprimer"
          message={`Êtes-vous sûr de vouloir supprimer la base "${targetedBase.name}" ?`}
          onCancel={close}
          onConfirm={() => confirmDeletion(targetedBase.id)}
          title="Suppression de la base"
        />
      )}

      {isImpossibleDeletionDialogOpen && (
        <Dialog
          color={THEME.color.maximumRed}
          message={DELETE_BASE_ERROR_MESSAGE}
          onClose={close}
          title="Suppression impossible"
          titleBackgroundColor={THEME.color.maximumRed}
        />
      )}
    </>
  )
}

const Title = styled.h1`
  line-height: 1;
  font-size: 24px;
  margin: 0 0 24px;
`

const ActionGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
`
