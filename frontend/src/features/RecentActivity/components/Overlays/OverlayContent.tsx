import { updateSelectedControlId } from '@features/RecentActivity/useCases/updateSelectedControlId'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useGetControlPlans } from '@hooks/useGetControlPlans'
import { pluralize, THEME } from '@mtes-mct/monitor-ui'
import { TargetTypeLabels } from 'domain/entities/targetType'
import styled from 'styled-components'

import { RecentActivityControlCard } from './RecentActivityControlCard'

import type { RecentActivity } from '@features/RecentActivity/types'
import type { OverlayItem } from 'domain/types/map'
import type { Feature } from 'ol'

export function OverlayContent({
  isSelected,
  items,
  singleFeature
}: {
  isSelected?: boolean
  items: OverlayItem<string, RecentActivity.RecentControlsActivity>[]
  singleFeature?: Feature
}) {
  const dispatch = useAppDispatch()
  const { themes } = useGetControlPlans()

  const selectControl = id => {
    if (!isSelected) {
      return
    }
    dispatch(updateSelectedControlId(id))
  }

  if (singleFeature) {
    return <RecentActivityControlCard control={singleFeature} />
  }

  return (
    <div>
      {items.map(item => {
        const { actionNumberOfControls, actionTargetType, id, infractions, themeIds } = item.properties
        const controlThemes = themeIds?.map(themeId => themes[themeId]?.theme).join(',')

        return (
          <Wrapper key={id} onClick={() => selectControl(id)}>
            {themeIds?.length > 0 ? (
              <StyledThemes>{controlThemes} /</StyledThemes>
            ) : (
              <StyledGrayText>Thématique à renseigner /</StyledGrayText>
            )}
            <Accented>
              {actionNumberOfControls} {pluralize('contrôle', actionNumberOfControls)}{' '}
              {TargetTypeLabels[actionTargetType] ? (
                <>({TargetTypeLabels[actionTargetType]})</>
              ) : (
                <StyledGrayText>(cible non renseignée)</StyledGrayText>
              )}
              <Bullet $color={infractions?.length > 0 ? THEME.color.maximumRed : THEME.color.mediumSeaGreen} />
            </Accented>
          </Wrapper>
        )
      })}
    </div>
  )
}

const Wrapper = styled.div`
  background-color: ${p => p.theme.color.white};
  display: flex;
  padding: 7px 8px;
  &:not(:last-child) {
    border-bottom: 1px solid ${p => p.theme.color.lightGray};
  }
`
const StyledThemes = styled.div`
  font-weight: 500;
  white-space: nowrap;
`

const Accented = styled.div`
  align-items: baseline;
  display: flex;
  gap: 5px;
  white-space: nowrap;
`

const Bullet = styled.div<{ $color: string }>`
  border-radius: 50%;
  background-color: ${p => p.$color};
  height: 10px;
  width: 10px;
`

const StyledGrayText = styled.p`
  color: ${p => p.theme.color.slateGray};
`
