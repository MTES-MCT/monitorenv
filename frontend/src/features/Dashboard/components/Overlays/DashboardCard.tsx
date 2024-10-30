import { useGetDashboardQuery } from '@api/dashboardsAPI'
import { editDashboard } from '@features/Dashboard/useCases/editDashboard'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Button, getLocalizedDayjs, Icon, IconButton, pluralize, Size } from '@mtes-mct/monitor-ui'
import { closeAllOverlays } from 'domain/use_cases/map/closeAllOverlays'
import { useEffect, useRef } from 'react'
import styled from 'styled-components'

type DashboardCardProps = {
  dashboardId: string
  isCardVisible?: boolean
  isSelected?: boolean
  onClose: () => void
  updateMargins: (margin: number) => void
}

export function DashboardCard({
  dashboardId,
  isCardVisible = true,
  isSelected = false,
  onClose,
  updateMargins
}: DashboardCardProps) {
  const dispatch = useAppDispatch()
  const ref = useRef<HTMLDivElement>(null)

  const { data: dashboard } = useGetDashboardQuery(dashboardId)

  useEffect(() => {
    if (dashboard && ref.current) {
      const cardHeight = ref.current.offsetHeight
      updateMargins(cardHeight === 0 ? 200 : cardHeight)
    }
  }, [dashboard, updateMargins])
  if (!dashboard) {
    return null
  }
  const creationDate = getLocalizedDayjs(dashboard.createdAt).format('DD MMM YYYY')
  const numberOfItemsSelected =
    dashboard.ampIds.length +
    dashboard.controlUnitIds.length +
    dashboard.regulatoryAreaIds.length +
    dashboard.vigilanceAreaIds.length +
    dashboard.reportingIds.length

  const handleEdit = () => {
    dispatch(editDashboard(dashboard.id))
    dispatch(closeAllOverlays())
  }

  return (
    isCardVisible && (
      <Wrapper ref={ref} data-cy="reporting-overlay">
        <StyledHeader>
          <StyledHeaderFirstLine>
            <StyledBoldText>{dashboard.name}</StyledBoldText>
            <div>
              <StyledGrayText>Créé le {creationDate}</StyledGrayText>
              <StyledGrayText>
                {numberOfItemsSelected} {pluralize('élément', numberOfItemsSelected)}{' '}
                {pluralize('sélectionné', numberOfItemsSelected)}
              </StyledGrayText>
            </div>
          </StyledHeaderFirstLine>

          <CloseButton
            $isVisible={isSelected}
            accent={Accent.TERTIARY}
            Icon={Icon.Close}
            iconSize={14}
            onClick={onClose}
          />
        </StyledHeader>

        <StyledButton disabled={!isSelected} Icon={Icon.Edit} onClick={handleEdit} size={Size.SMALL}>
          Éditer le tableau
        </StyledButton>
      </Wrapper>
    )
  )
}

const Wrapper = styled.div`
  padding: 10px;
  box-shadow: 0px 3px 6px #70778540;
  border-radius: 1px;
  background-color: ${p => p.theme.color.white};
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-basis: 0 0 345px;
`
const StyledHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: space-between;
`
const StyledGrayText = styled.span`
  color: ${p => p.theme.color.slateGray};
  display: flex;
  align-items: baseline;
`

const StyledHeaderFirstLine = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 16px;
  ${StyledGrayText} {
    max-width: 190px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const CloseButton = styled(IconButton)<{ $isVisible: boolean }>`
  padding: 0px;
  margin-left: 8px;
  ${p => !p.$isVisible && 'visibility: hidden;'};
`

const StyledBoldText = styled.span`
  font-weight: 700;
  color: ${p => p.theme.color.gunMetal};
`

// TODO delete when Monitor-ui component have good padding
const StyledButton = styled(Button)`
  padding: 4px 12px;
  align-self: start;
  width: inherit;
`
