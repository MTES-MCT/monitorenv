import { Italic } from '@components/style'
import { ValidateButton } from '@features/commonComponents/ValidateButton'
import {
  customDayjs,
  Accent,
  Button,
  FormikDatePicker,
  FormikTextarea,
  FormikTextInput,
  getLocalizedDayjs,
  Icon,
  IconButton,
  Label
} from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import { useState } from 'react'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

import { SubTitle } from './style'

import type { RegulatoryArea } from '@features/RegulatoryArea/types'

export type MainRefReg = {
  date?: string
  dateFin?: string
  refReg?: string
  url?: string
}
export function RegulatoryTexts({
  editingMainRefReg,
  onChangeRefReg
}: {
  editingMainRefReg: MainRefReg | undefined
  onChangeRefReg: (refReg?: MainRefReg) => void
}) {
  const { setFieldValue, values } = useFormikContext<RegulatoryArea.RegulatoryAreaFromAPI>()
  const [editingOtherRefReg, setEditingOtherRefReg] = useState<RegulatoryArea.OthersRegulatoryText | undefined>(
    undefined
  )

  const validateRefReg = () => {
    onChangeRefReg(undefined)
  }

  const cancelEditRefReg = () => {
    setFieldValue('date', editingMainRefReg?.date)
    setFieldValue('dateFin', editingMainRefReg?.dateFin)
    setFieldValue('refReg', editingMainRefReg?.refReg)
    setFieldValue('url', editingMainRefReg?.url)
    onChangeRefReg(undefined)
  }

  const validateOtherRefReg = (index: number) => {
    const updatedOtherRefReg = values.othersRefReg ? values.othersRefReg[index] : undefined
    const isOtherRefRegEmpty =
      !updatedOtherRefReg?.refReg && !updatedOtherRefReg?.startDate && !updatedOtherRefReg?.endDate
    if (isOtherRefRegEmpty) {
      deleteOtherRefReg(index)

      return
    }
    setEditingOtherRefReg(undefined)
  }

  const cancelEditOtherRefReg = (index: number) => {
    const updatedOtherRefReg = values.othersRefReg ? values.othersRefReg[index] : undefined
    const isOtherRefRegEmpty =
      !editingOtherRefReg?.refReg && !editingOtherRefReg?.startDate && !editingOtherRefReg?.endDate

    if (isOtherRefRegEmpty) {
      deleteOtherRefReg(index)

      return
    }
    if (updatedOtherRefReg) {
      setFieldValue(`othersRefReg[${index}]`, editingOtherRefReg)

      setEditingOtherRefReg(undefined)
    }
  }

  const getPeriodText = (startDate, endDate) => {
    const startDateFormatted = startDate ? getLocalizedDayjs(startDate).format('DD/MM/YYYY') : undefined
    const endDateFormatted = endDate ? getLocalizedDayjs(endDate).format('DD/MM/YYYY') : undefined

    if (!startDateFormatted && !endDateFormatted) {
      return undefined
    }

    if (startDateFormatted && !endDateFormatted) {
      return (
        <>
          En vigueur depuis <span>{startDateFormatted}</span>
        </>
      )
    }

    if (!startDateFormatted && endDateFormatted) {
      return (
        <>
          En vigueur jusqu&apos;au <span>{endDateFormatted}</span>
        </>
      )
    }

    return (
      <>
        En vigueur depuis <span>{startDateFormatted}</span> jusqu&apos;au <span>{endDateFormatted}</span>
      </>
    )
  }

  const addOtherRefReg = () => {
    onChangeRefReg(undefined)
    const newRefReg = {
      endDate: undefined,
      id: uuidv4(),
      refReg: undefined,
      startDate: customDayjs().toISOString()
    }
    setFieldValue('othersRefReg', [...(values.othersRefReg ?? []), newRefReg])
    setEditingOtherRefReg(newRefReg)
  }

  const deleteOtherRefReg = (index: number) => {
    const updatedOthersRefReg = [...(values.othersRefReg ?? [])]
    updatedOthersRefReg.splice(index, 1)
    setFieldValue('othersRefReg', updatedOthersRefReg)
    setEditingOtherRefReg(undefined)
  }

  const renderMainRegulatoryText = () => {
    if (editingMainRefReg) {
      return (
        <EditingRefRegContainer>
          <div>
            <Label>Titre de la réglementation</Label>
            <RefRegText>{values.refReg} </RefRegText>
          </div>
          <RefRegSecondLine>
            <FormikTextInput isErrorMessageHidden isLight label="URL du lien" name="url" style={{ width: '65%' }} />
            <DateContainer>
              <FormikDatePicker
                isErrorMessageHidden
                isLight
                isRequired
                isStringDate
                label="Début de validité"
                name="date"
              />
              <StyledFormikDatePicker
                isErrorMessageHidden
                isLight
                isStringDate
                label="Fin de validité"
                name="dateFin"
              />
            </DateContainer>
          </RefRegSecondLine>
          <ButtonsWrapper>
            <Button accent={Accent.SECONDARY} onClick={cancelEditRefReg}>
              Annuler
            </Button>
            <ValidateButton onClick={validateRefReg}>Valider</ValidateButton>
          </ButtonsWrapper>
        </EditingRefRegContainer>
      )
    }

    if (values.refReg && !editingMainRefReg) {
      const mainRefReg = {
        date: values.date,
        dateFin: values.dateFin,
        refReg: values.refReg,
        url: values.url
      }

      return (
        <RefRegContainer>
          <RefRegTextContainer>
            <RefRegText title={values?.refReg}>{values?.refReg} </RefRegText>
            <Link href={values?.url}>{values?.url}</Link>
            <PeriodText>{getPeriodText(values.date, values.dateFin)}</PeriodText>
          </RefRegTextContainer>
          <IconButton accent={Accent.TERTIARY} Icon={Icon.EditUnbordered} onClick={() => onChangeRefReg(mainRefReg)} />
        </RefRegContainer>
      )
    }

    return <StyledItalic>Sélectionner un tracé pour remplir le titre de la réglementation</StyledItalic>
  }

  return (
    <>
      <SubTitleContainer>
        <StyledSubTitle>TEXTE(S) RÉGLEMENTAIRE(S) EN VIGUEUR</StyledSubTitle>
        <Button disabled={!values.refReg} onClick={addOtherRefReg}>
          Ajouter un texte supplémentaire
        </Button>
      </SubTitleContainer>
      {renderMainRegulatoryText()}
      {(values?.othersRefReg?.length || editingOtherRefReg) && <Separator />}
      <OtherRefRegContainer>
        {values?.othersRefReg &&
          values?.othersRefReg.length > 0 &&
          values.othersRefReg.map((otherRefReg, index) => {
            const refRegindex = values.othersRefReg?.findIndex(refReg => refReg.id === otherRefReg.id)

            if (editingOtherRefReg?.id === otherRefReg.id) {
              return (
                <EditingRefRegContainer key={otherRefReg.id}>
                  <FormikTextarea isLight label="Titre du texte" name={`othersRefReg[${refRegindex}].refReg`} />
                  <RefRegSecondLine>
                    <DateContainer>
                      <FormikDatePicker
                        isLight
                        isRequired
                        isStringDate
                        label="Début de validité"
                        name={`othersRefReg[${refRegindex}].startDate`}
                      />
                      <FormikDatePicker
                        isLight
                        isStringDate
                        label="Fin de validité"
                        name={`othersRefReg[${refRegindex}].endDate`}
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
              <RefRegContainer key={otherRefReg.id}>
                <RefRegTextContainer>
                  <RefRegText title={otherRefReg.refReg}>{otherRefReg.refReg} </RefRegText>
                  <PeriodText>{getPeriodText(otherRefReg.startDate, otherRefReg.endDate)}</PeriodText>
                </RefRegTextContainer>
                <ActionButtons>
                  <IconButton
                    accent={Accent.TERTIARY}
                    Icon={Icon.EditUnbordered}
                    onClick={() => setEditingOtherRefReg(otherRefReg)}
                  />
                  <IconButton accent={Accent.TERTIARY} Icon={Icon.Delete} onClick={() => deleteOtherRefReg(index)} />
                </ActionButtons>
              </RefRegContainer>
            )
          })}
      </OtherRefRegContainer>
    </>
  )
}

const SubTitleContainer = styled.div`
  align-items: baseline;
  border-bottom: ${p => `1px solid ${p.theme.color.lightGray}`};
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  margin-top: 24px;
`
const StyledSubTitle = styled(SubTitle)`
  border-bottom: none;
  margin-bottom: 0;
  margin-top: 0;
`
const RefRegTextContainer = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
const RefRegContainer = styled.div`
  background-color: ${p => p.theme.color.gainsboro};
  display: flex;
  gap: 16px;
  justify-content: space-between;
  padding: 8px;
`

const EditingRefRegContainer = styled(RefRegContainer)`
  flex-direction: column;
`

const RefRegSecondLine = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`

const RefRegText = styled.p`
  font-size: 13px;
  white-space: wrap;
`

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`

const DateContainer = styled.div`
  display: flex;
  gap: 8px;
`
const Link = styled.a`
  color: ${p => p.theme.color.blueGray};
  font-size: 13px;
  text-decoration: underline;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const PeriodText = styled.p`
  font-size: 13px;
  color: ${p => p.theme.color.slateGray};
  margin-top: 6px;
  > span {
    color: ${p => p.theme.color.gunMetal};
  }
`
const StyledItalic = styled(Italic)`
  color: ${p => p.theme.color.slateGray};
  font-size: 13px;
`
const Separator = styled.div`
  border-top: ${p => `1px solid ${p.theme.color.lightGray}`};
  margin: 16px 0;
`

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`
const OtherRefRegContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const StyledFormikDatePicker = styled(FormikDatePicker)`
  .Field-DatePicker__CalendarPicker {
    > .rs-picker-popup {
      left: unset !important;
      right: 0px;
    }
  }
`
