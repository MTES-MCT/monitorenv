import { Section, SectionTitle } from '@features/layersSelector/metadataPanel/MetadataPanel.style'
import { THEME, Icon } from '@mtes-mct/monitor-ui'
import ReactMarkdown from 'react-markdown'
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
          <ReactMarkdown components={{ ul: List }}>{authorizationPeriods}</ReactMarkdown>
        </StyledSection>
      )}
      {prohibitionPeriods && (
        <StyledSection>
          <SectionTitle>
            <StyledIcon color={THEME.color.maximumRed} size={10} />
            Période d&apos;interdiction
          </SectionTitle>
          <ReactMarkdown>{prohibitionPeriods}</ReactMarkdown>
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
  gap: 8px;
`
const StyledIcon = styled(Icon.CircleFilled)`
  margin-right: 8px;
`
const List = styled.ul`
  list-style-type: disc;
  margin-left: 16px;
`
