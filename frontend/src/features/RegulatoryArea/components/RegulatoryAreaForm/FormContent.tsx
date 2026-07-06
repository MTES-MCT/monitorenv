import { MarkdownEditor } from '@components/MarkdownEditor'
import { Icon, Label, THEME } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import { useState } from 'react'
import styled from 'styled-components'

import { Identification } from './Identification'
import { RegulatoryTexts, type MainRefReg } from './RegulatoryTexts'
import { SubTitle } from './style'

export function FormContent({ isEditing }: { isEditing: boolean }) {
  const [editingMainRefReg, setEditingMainRefReg] = useState<MainRefReg | undefined>(undefined)
  const [authorizationField, , authorizationHelpers] = useField('authorizationPeriods')
  const [prohibitionField, , prohibitionHelpers] = useField('prohibitionPeriods')

  return (
    <>
      <Identification isEditing={isEditing} onChangeRefReg={setEditingMainRefReg} />
      <RegulatoryTexts editingMainRefReg={editingMainRefReg} onChangeRefReg={setEditingMainRefReg} />

      <SubTitle>PÉRIODE(S)</SubTitle>
      <PeriodContainer>
        <Period>
          <Label>
            <StyledIcon color={THEME.color.mediumSeaGreen} size={10} />
            Période d&apos;autorisation
          </Label>
          <MarkdownEditor
            onChange={val => {
              authorizationHelpers.setValue(val)
            }}
            value={authorizationField.value}
          />
        </Period>
        <Period>
          <Label>
            <StyledIcon color={THEME.color.maximumRed} size={10} />
            Période d&apos;interdiction
          </Label>
          <MarkdownEditor
            onChange={val => {
              prohibitionHelpers.setValue(val ?? '')
            }}
            value={prohibitionField.value}
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
