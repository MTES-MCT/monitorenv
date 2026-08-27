import { ValidateButton } from '@features/commonComponents/ValidateButton'
import { ReadOnlyOtherRefRegText } from '@features/RegulatoryArea/components/RegulatoryAreaGroupForm/ReadOnlyOtherRefRegText'
import { RegulatoryArea } from '@features/RegulatoryArea/types'
import { Accent, Button, FormikDatePicker, FormikTextarea, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import styled from 'styled-components'

import { ButtonsWrapper, DateContainer, EditingRefRegContainer, RefRegSecondLine } from './RefRegForm'
import { REQUIRED_FIELD } from '../RegulatoryAreaForm/Schema'

type OtherRefRegFormProps = {
  editingOtherRefReg: RegulatoryArea.AdditionalRegulatoryText | undefined
  setEditingOtherRefReg: (otherRefReg: RegulatoryArea.AdditionalRegulatoryText | undefined) => void
}
export function OtherRefRegForm({ editingOtherRefReg, setEditingOtherRefReg }: OtherRefRegFormProps) {
  const { setFieldError, setFieldValue, values } = useFormikContext<RegulatoryArea.RegulatoryAreaGroupToApi>()

  const deleteOtherRefReg = (index: number) => {
    const updatedAdditionalRefReg = [...(values.additionalRefReg ?? [])]
    updatedAdditionalRefReg.splice(index, 1)
    setFieldValue('additionalRefReg', updatedAdditionalRefReg)
    setEditingOtherRefReg(undefined)
  }

  const validateOtherRefReg = (index: number) => {
    const updatedOtherRefReg = values.additionalRefReg ? values.additionalRefReg[index] : undefined
    if (updatedOtherRefReg?.refReg && updatedOtherRefReg?.startDate) {
      setEditingOtherRefReg(undefined)

      return
    }

    if (!updatedOtherRefReg?.refReg) {
      setFieldError(`additionalRefReg[${index}].refReg`, REQUIRED_FIELD)
    }

    if (!updatedOtherRefReg?.startDate) {
      setFieldError(`additionalRefReg[${index}].startDate`, REQUIRED_FIELD)
    }
  }

  const cancelEditOtherRefReg = (index: number) => {
    const updatedOtherRefReg = values.additionalRefReg ? values.additionalRefReg[index] : undefined
    const isOtherRefRegEmpty =
      !editingOtherRefReg?.refReg && !editingOtherRefReg?.startDate && !editingOtherRefReg?.endDate

    if (isOtherRefRegEmpty) {
      deleteOtherRefReg(index)

      return
    }
    if (updatedOtherRefReg) {
      setFieldValue(`additionalRefReg[${index}]`, editingOtherRefReg)

      setEditingOtherRefReg(undefined)
    }
  }

  return (
    <>
      {(values?.additionalRefReg?.length || editingOtherRefReg) && <Separator />}

      {values?.additionalRefReg && values?.additionalRefReg.length > 0 && (
        <OtherRefRegContainer>
          {values.additionalRefReg.map((otherRefReg, index) => {
            const refRegIndex = values.additionalRefReg?.findIndex(refReg => refReg.id === otherRefReg.id)

            if (editingOtherRefReg?.id === otherRefReg.id) {
              return (
                <EditingRefRegContainer key={otherRefReg.id}>
                  <FormikTextarea
                    isErrorMessageHidden
                    isLight
                    isRequired
                    label="Titre du texte"
                    name={`additionalRefReg[${refRegIndex}].refReg`}
                  />
                  <RefRegSecondLine>
                    <DateContainer>
                      <FormikDatePicker
                        isErrorMessageHidden
                        isLight
                        isRequired
                        isStringDate
                        label="Début de validité"
                        name={`additionalRefReg[${refRegIndex}].startDate`}
                      />
                      <FormikDatePicker
                        isErrorMessageHidden
                        isLight
                        isStringDate
                        label="Fin de validité"
                        name={`additionalRefReg[${refRegIndex}].endDate`}
                      />
                    </DateContainer>
                  </RefRegSecondLine>
                  <ButtonsWrapper>
                    <Button accent={Accent.SECONDARY} onClick={() => cancelEditOtherRefReg(index)}>
                      Annuler
                    </Button>
                    <ValidateButton onClick={() => validateOtherRefReg(index)}>Valider</ValidateButton>
                  </ButtonsWrapper>
                </EditingRefRegContainer>
              )
            }

            return (
              <ReadOnlyOtherRefRegText
                key={otherRefReg.id}
                endDate={otherRefReg.endDate}
                refReg={otherRefReg.refReg}
                startDate={otherRefReg.startDate}
              >
                <ActionButtons>
                  <IconButton
                    accent={Accent.TERTIARY}
                    Icon={Icon.EditUnbordered}
                    onClick={() => setEditingOtherRefReg(otherRefReg)}
                    title="Editer le texte réglementaire"
                  />
                  <IconButton
                    accent={Accent.TERTIARY}
                    Icon={Icon.Delete}
                    onClick={() => deleteOtherRefReg(index)}
                    title="Supprimer le texte réglementaire"
                  />
                </ActionButtons>
              </ReadOnlyOtherRefRegText>
            )
          })}
        </OtherRefRegContainer>
      )}
    </>
  )
}

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`
const OtherRefRegContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Separator = styled.div`
  border-top: ${p => `1px solid ${p.theme.color.lightGray}`};
`
