import { recentActivityActions } from '@features/RecentActivity/slice'
import { RecentActivity } from '@features/RecentActivity/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { getOptionsFromLabelledEnum, Icon, Select, THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export function DistinctionFilters() {
  const dispatch = useAppDispatch()
  const distinctionFilter = useAppSelector(state => state.recentActivity.distinctionFilter)
  const controlUnitsWithInfraction = useAppSelector(
    state => state.recentActivity.distinctionFiltersItems.infractions.withInfraction
  )
  const controlUnitsWithoutInfraction = useAppSelector(
    state => state.recentActivity.distinctionFiltersItems.infractions.withoutInfraction
  )
  const distinctionOptions = getOptionsFromLabelledEnum(RecentActivity.DistinctionFilterLabels)

  const updateDistinctionFilter = (value: string | undefined) => {
    if (!value) {
      return
    }
    dispatch(recentActivityActions.updateDistinctionFilter(value as RecentActivity.DistinctionFilterEnum))
  }

  return (
    <Wrapper>
      <Select
        isCleanable={false}
        isLabelHidden
        isTransparent
        label="Distinction"
        name="distinction"
        onChange={updateDistinctionFilter}
        options={distinctionOptions}
        placeholder="Sélectionner une distinction"
        value={distinctionFilter}
      />
      {distinctionFilter === RecentActivity.DistinctionFilterEnum.WITH_DISTINCTION && (
        <>
          <Separator />
          <InfractionsContainer>
            <InfractionLine>
              <Icon.Close color={THEME.color.maximumRed} size={10} />
              <span>{`Avec infraction (${controlUnitsWithInfraction})`}</span>
            </InfractionLine>
            <InfractionLine>
              <Icon.Close color={THEME.color.yellowGreen} size={10} />
              <span>{`Sans infraction (${controlUnitsWithoutInfraction})`}</span>
            </InfractionLine>
          </InfractionsContainer>
        </>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  padding: 12px;
`
export const Separator = styled.div`
  margin-top: 16px;
  border: 1px solid ${p => p.theme.color.slateGray};
`

const InfractionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
`

const InfractionLine = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`
