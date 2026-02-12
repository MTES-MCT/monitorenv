import { FormikTextarea, Icon, Label, THEME } from '@mtes-mct/monitor-ui'
import { useState } from 'react'
import styled from 'styled-components'

import { Identification } from './Identification'
import { RegulatoryTexts, type MainRefReg } from './RegulatoryTexts'
import { SubTitle } from './style'

export function FormContent({ isEditing }: { isEditing: boolean }) {
  const [editingMainRefReg, setEditingMainRefReg] = useState<MainRefReg | undefined>(undefined)

  return (
    <>
      <Identification isEditing={isEditing} setEditingMainRefReg={setEditingMainRefReg} />
      <RegulatoryTexts editingMainRefReg={editingMainRefReg} setEditingMainRefReg={setEditingMainRefReg} />

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
            name="authorizationPeriods"
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
            name="prohibitionPeriods"
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
