import { Section, SectionTitle } from '@features/layersSelector/metadataPanel/MetadataPanel.style'
import { THEME, Icon } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

type PeriodsProps = {
  authorizationPeriods?: string
  prohibitionPeriods?: string
}

export function Periods({ authorizationPeriods, prohibitionPeriods }: PeriodsProps) {
  return (
    <PeriodsWrapper>
      {authorizationPeriods && (
        <StyledSection>
          <SectionTitle>
            <StyledIcon color={THEME.color.mediumSeaGreen} size={10} />
            Période d&apos;autorisation
          </SectionTitle>
          <Text>{authorizationPeriods}</Text>
        </StyledSection>
      )}
      {prohibitionPeriods && (
        <StyledSection>
          <SectionTitle>
            <StyledIcon color={THEME.color.maximumRed} size={10} />
            Période d&apos;interdiction
          </SectionTitle>
          <Text>{prohibitionPeriods}</Text>
        </StyledSection>
      )}
    </PeriodsWrapper>
  )
}

const PeriodsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledSection = styled(Section)`
  border-bottom: 1px solid ${p => p.theme.color.lightGray};
`
const StyledIcon = styled(Icon.CircleFilled)`
  margin-right: 8px;
`
const Text = styled.p`
  margin-top: 8px;
`
