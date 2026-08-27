import { SubTitle } from '@features/RegulatoryArea/components/RegulatoryAreaForm/style'
import { SubTitleWrapper } from '@features/RegulatoryArea/components/RegulatoryAreaGroupForm/index'
import { OtherRefRegForm } from '@features/RegulatoryArea/components/RegulatoryAreaGroupForm/OtherRefRegForm'
import { RefRegForm } from '@features/RegulatoryArea/components/RegulatoryAreaGroupForm/RefRegForm'
import { RegulatoryArea } from '@features/RegulatoryArea/types'
import { Button, customDayjs, CustomSearch, FormikSelect, getOptionsFromLabelledEnum } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import { useState } from 'react'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

export type MainRefReg = {
  date?: string
  dateFin?: string
  refReg?: string
  url?: string
}

export function RegulatoryTexts() {
  const { setFieldValue, values } = useFormikContext<RegulatoryArea.RegulatoryAreaGroupToApi>()
  const [editingOtherRefReg, setEditingOtherRefReg] = useState<RegulatoryArea.AdditionalRegulatoryText | undefined>(
    undefined
  )

  const regulatoryTypeOptions = getOptionsFromLabelledEnum(RegulatoryArea.RegulatoryAreaTypeLabel).sort((a, b) =>
    a.label.localeCompare(b.label)
  )
  const typeCustomSearch = new CustomSearch(regulatoryTypeOptions ?? [], ['label'], {
    isStrict: true
  })
  const addOtherRefReg = () => {
    const newOtherRefReg = {
      endDate: undefined,
      id: uuidv4(),
      refReg: undefined,
      startDate: customDayjs().toISOString()
    }
    setFieldValue('additionalRefReg', [...(values.additionalRefReg ?? []), newOtherRefReg])
    setEditingOtherRefReg(newOtherRefReg)
  }

  return (
    <div>
      <SubTitleWrapper>
        <StyledSubTitle>TEXTE(S) RÉGLEMENTAIRE(S) EN VIGUEUR</StyledSubTitle>
        <Button disabled={!values.refReg} onClick={addOtherRefReg}>
          Ajouter un texte supplémentaire
        </Button>
      </SubTitleWrapper>
      <Fields>
        <FormikSelect
          customSearch={typeCustomSearch}
          isErrorMessageHidden
          isRequired
          label="Type d’acte administratif"
          name="type"
          options={regulatoryTypeOptions}
        />
        <RefRegForm />
        <OtherRefRegForm editingOtherRefReg={editingOtherRefReg} setEditingOtherRefReg={setEditingOtherRefReg} />
      </Fields>
    </div>
  )
}

const StyledSubTitle = styled(SubTitle)`
  border-bottom: none;
  margin-bottom: 0;
  margin-top: 0;
`
const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`
