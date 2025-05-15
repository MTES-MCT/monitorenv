import { useGetThemesQuery } from '@api/themesAPI'
import { updateSelectedControlId } from '@features/RecentActivity/useCases/updateSelectedControlId'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { pluralize, THEME } from '@mtes-mct/monitor-ui'
import { displayThemes } from '@utils/getThemesAsOptions'
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
  const { data } = useGetThemesQuery()

  const selectControl = id => {
    if (!isSelected) {
      return
    }
    dispatch(updateSelectedControlId(id))
  }

  if (singleFeature) {
    return <RecentActivityControlCard control={singleFeature} />
  }

  const getThemes = (themeId: number[]) => {
    const themes = Object.values(data ?? [])

    return displayThemes(themes.filter(theme => themeId.includes(theme.id)))
  }

  return (
    <Wrapper>
      {items.map(item => {
        const { actionNumberOfControls, actionTargetType, id, infractions, themeIds } = item.properties

        return (
          <ItemContainer key={id} onClick={() => selectControl(id)}>
            {themeIds?.length > 0 ? (
              <StyledThemes title={getThemes(themeIds)}>{getThemes(themeIds)} </StyledThemes>
            ) : (
              <StyledGrayText>Thématique à renseigner</StyledGrayText>
            )}
            <Accented>
              &nbsp;/&nbsp;
              {actionNumberOfControls} {pluralize('contrôle', actionNumberOfControls)}{' '}
              {TargetTypeLabels[actionTargetType] ? (
                <>({TargetTypeLabels[actionTargetType]})</>
              ) : (
                <StyledGrayText>(cible non renseignée)</StyledGrayText>
              )}
              <Bullet $color={infractions?.length > 0 ? THEME.color.maximumRed : THEME.color.mediumSeaGreen} />
            </Accented>
          </ItemContainer>
        )
      })}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  max-height: 300px;
  overflow-y: auto;
`
const ItemContainer = styled.div`
  background-color: ${p => p.theme.color.white};
  display: flex;
  padding: 7px 8px;
  &:not(:last-child) {
    border-bottom: 1px solid ${p => p.theme.color.lightGray};
  }
`
const StyledThemes = styled.span`
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 280px;
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

const StyledGrayText = styled.span`
  color: ${p => p.theme.color.slateGray};
`
