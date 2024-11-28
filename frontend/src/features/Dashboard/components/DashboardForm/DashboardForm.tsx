import { CancelEditDialog } from '@features/commonComponents/Modals/CancelEditModal'
import { Dashboard } from '@features/Dashboard/types'
import { sideWindowActions } from '@features/SideWindow/slice'
import { SideWindowContent } from '@features/SideWindow/style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { sideWindowPaths } from 'domain/entities/sideWindow'
import { useCallback, useEffect, useRef, useState } from 'react'
import { generatePath } from 'react-router'
import styled, { css } from 'styled-components'

import { dashboardActions, type DashboardType, isCancelEditModalOpen } from '../../slice'
import { FirstColumn } from './Columns/FirstColumn'
import { SecondColumn } from './Columns/SecondColumn'
import { ThirdColumn } from './Columns/ThirdColumn'
import { Footer } from './Footer'
import { dashboardFiltersActions } from './slice'
import { Toolbar } from './Toolbar'

type DashboardProps = {
  dashboardForm: [string, DashboardType]
  isActive: boolean
}

export function DashboardForm({ dashboardForm: [key, dashboard], isActive }: DashboardProps) {
  const dispatch = useAppDispatch()
  const isCancelModalOpen = useAppSelector(state => isCancelEditModalOpen(state.dashboard, key))

  const filters = useAppSelector(state => state.dashboardFilters?.dashboards[key]?.filters)
  const previewSelectionFilter = filters?.previewSelection ?? false

  const toolbarRef = useRef<HTMLDivElement>(null)
  const toolbarHeight = toolbarRef.current?.clientHeight ?? 0

  const [expandedAccordionFirstColumn, setExpandedAccordionFirstColumn] = useState<Dashboard.Block | undefined>(
    undefined
  )
  const [expandedAccordionSecondColumn, setExpandedAccordionSecondColumn] = useState<Dashboard.Block | undefined>(
    undefined
  )
  const [expandedAccordionThirdColumn, setExpandedAccordionThirdColumn] = useState<Dashboard.Block | undefined>(
    undefined
  )

  const handleAccordionClick = useCallback(
    (type: Dashboard.Block) => {
      switch (type) {
        case Dashboard.Block.REGULATORY_AREAS:
        case Dashboard.Block.AMP:
        case Dashboard.Block.VIGILANCE_AREAS:
          setExpandedAccordionFirstColumn(expandedAccordionFirstColumn === type ? undefined : type)
          dispatch(dashboardActions.setDashboardPanel())
          dispatch(dashboardActions.removeAllPreviewedItems())
          break
        case Dashboard.Block.TERRITORIAL_PRESSURE:
        case Dashboard.Block.REPORTINGS:
          setExpandedAccordionSecondColumn(expandedAccordionSecondColumn === type ? undefined : type)
          break
        case Dashboard.Block.CONTROL_UNITS:
        case Dashboard.Block.COMMENTS:
          setExpandedAccordionThirdColumn(expandedAccordionThirdColumn === type ? undefined : type)
          break
        default:
          break
      }
    },
    [dispatch, expandedAccordionFirstColumn, expandedAccordionSecondColumn, expandedAccordionThirdColumn]
  )

  useEffect(() => {
    // remove openedPanel on mount
    dispatch(dashboardActions.setDashboardPanel())

    // cleanup preview on unmount
    return () => {
      dispatch(dashboardActions.removeAllPreviewedItems())
    }
  }, [dispatch])

  useEffect(() => {
    if (previewSelectionFilter) {
      setExpandedAccordionFirstColumn(undefined)
      setExpandedAccordionSecondColumn(undefined)
      setExpandedAccordionThirdColumn(undefined)
      dispatch(dashboardFiltersActions.setFilters({ filters: { previewSelection: false }, id: key }))
    }
  }, [previewSelectionFilter, dispatch, key])

  const confirmCancelEdit = () => {
    dispatch(dashboardActions.removeTab(key))
    dispatch(sideWindowActions.setCurrentPath(generatePath(sideWindowPaths.DASHBOARDS)))
  }

  return (
    <>
      <CancelEditDialog
        onCancel={() => {
          dispatch(dashboardActions.setIsCancelModalOpen({ isCancelModalOpen: false, key }))
        }}
        onConfirm={confirmCancelEdit}
        open={isCancelModalOpen}
        subText="Voulez-vous enregistrer les modifications avant de quitter ?"
        text={`Vous êtes en train d'abandonner l'édition du tableau de bord`}
        title="Enregistrer les modifications"
      />
      {isActive && (
        <>
          <Toolbar ref={toolbarRef} dashboardForm={[key, dashboard]} geometry={dashboard.dashboard.geom} />

          <Container>
            <StyledFirstColumn
              $filterHeight={toolbarHeight ?? 0}
              className="first-column"
              dashboard={dashboard}
              expandedAccordion={expandedAccordionFirstColumn}
              filters={filters}
              isSelectedAccordionOpen={previewSelectionFilter}
              onExpandedAccordionClick={handleAccordionClick}
            />
            <StyledSecondColumn
              $filterHeight={toolbarHeight ?? 0}
              className="second-column"
              dashboardForm={[key, dashboard]}
              expandedAccordion={expandedAccordionSecondColumn}
              isSelectedAccordionOpen={previewSelectionFilter}
              onExpandedAccordionClick={handleAccordionClick}
            />
            <StyledThirdColumn
              $filterHeight={toolbarHeight ?? 0}
              className="third-column"
              dashboardForm={[key, dashboard]}
              expandedAccordion={expandedAccordionThirdColumn}
              isSelectedAccordionOpen={previewSelectionFilter}
              onExpandedAccordionClick={handleAccordionClick}
            />
          </Container>
          <Footer dashboard={dashboard.dashboard} defaultName={dashboard.defaultName} />
        </>
      )}
    </>
  )
}

const Container = styled(SideWindowContent)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  // gap and padding are 8px less than the mockup because of box-shadow is hidden because of overflow @see AccordionWrapper
  column-gap: 40px;
  padding: 16px 16px 0 16px;
  position: relative;
  overflow: hidden;
`

const StyledFirstColumn = styled(FirstColumn)<{ $filterHeight: number }>`
  ${p => getHeight(p.$filterHeight)}

  padding: 8px;
`

const StyledSecondColumn = styled(SecondColumn)<{ $filterHeight: number }>`
  ${p => getHeight(p.$filterHeight)}

  padding: 8px;
`

const StyledThirdColumn = styled(ThirdColumn)<{ $filterHeight: number }>`
  // ${p => getHeight(p.$filterHeight)}
  padding: 8px;
`
const getHeight = ($filterHeight: number) => css`
  height: calc(
    100vh - 48px - 24px - 66px - ${$filterHeight}
  ); // 48px = navbar height, 24px = padding, 66px = bottom bar height, filterHeight is variable
`
