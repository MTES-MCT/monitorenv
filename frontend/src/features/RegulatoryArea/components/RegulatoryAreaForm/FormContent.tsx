import { FormikTextarea, Icon, Label, THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { Identification } from './Identification'
import { RegulatoryTexts } from './RegulatoryTexts'
import { SubTitle } from './style'

export function FormContent({ isEditing }: { isEditing: boolean }) {
  return (
    <>
      <Identification isEditing={isEditing} />
      <RegulatoryTexts />

      <SubTitle>PÉRIODE(S)</SubTitle>
      <PeriodContainer>
        <Period>
          <Label>
            <StyledIcon color={THEME.color.mediumSeaGreen} size={10} />
            Période d&apos;autorisation
          </Label>
          <FormikTextarea
            isLabelHidden
            label="Période autorisée"
            name="authorizePeriod"
            placeholder="Détail de la période d’autorisation"
          />
        </Period>
        <Period>
          <Label>
            <StyledIcon color={THEME.color.maximumRed} size={10} />
            Période d&apos;interdiction
          </Label>
          <FormikTextarea
            isLabelHidden
            label="Période d'interdiction"
            name="forbidPeriod"
            placeholder="Détail de la période d’interdiction"
          />
        </Period>
      </PeriodContainer>
    </>
  )
}

const PeriodContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 94px;
`

const Period = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`

const StyledIcon = styled(Icon.CircleFilled)`
  margin-right: 8px;
`
