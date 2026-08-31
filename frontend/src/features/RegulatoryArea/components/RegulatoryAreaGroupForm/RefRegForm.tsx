import { useGetLayerNamesQuery } from '@api/regulatoryAreasAPI'
import { Bold } from '@components/style'
import { Tooltip } from '@components/Tooltip'
import { ValidateButton } from '@features/commonComponents/ValidateButton'
import { REQUIRED_FIELD } from '@features/RegulatoryArea/components/RegulatoryAreaForm/Schema'
import { ReadOnlyRefRegText } from '@features/RegulatoryArea/components/RegulatoryAreaGroupForm/ReadOnlyRefRegText'
import { RegulatoryArea } from '@features/RegulatoryArea/types'
import { formatLayerName } from '@features/RegulatoryArea/utils'
import {
  Accent,
  Button,
  FormikDatePicker,
  FormikTextarea,
  FormikTextInput,
  Icon,
  IconButton,
  pluralize,
  THEME
} from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import { useState } from 'react'
import styled from 'styled-components'

import type { MainRefReg } from '@features/RegulatoryArea/components/RegulatoryAreaGroupForm/RegulatoryTexts'

export function RefRegForm({ isNew }: { isNew: boolean }) {
  const { setFieldError, setFieldValue, values } = useFormikContext<
    RegulatoryArea.RegulatoryAreaGroupToApi | RegulatoryArea.RegulatoryAreaFromAPI
  >()
  const mainRefReg = {
    date: values.date,
    dateFin: values.dateFin,
    refReg: values.refReg,
    url: values.url
  }
  const [isEditing, setIsEditing] = useState(isNew)
  const { data: layerNames } = useGetLayerNamesQuery()
  const [duplicateUrls, setDuplicateUrls] = useState<RegulatoryArea.RegulatoryAreaGroupWithTotal[]>([])

  const [editingMainRefReg, setEditingMainRefReg] = useState<MainRefReg | undefined>(mainRefReg)

  const editRefReg = () => {
    setEditingMainRefReg(mainRefReg)
    setIsEditing(true)
  }

  const validateRefReg = async () => {
    if (values.refReg && values.url && values.date) {
      setEditingMainRefReg(undefined)
      setIsEditing(false)

      return
    }
    if (!values.url) {
      setFieldError('url', REQUIRED_FIELD)
    }

    if (!values.date) {
      setFieldError('date', REQUIRED_FIELD)
    }
  }

  const cancelEditRefReg = () => {
    setFieldValue('date', editingMainRefReg?.date)
    setFieldValue('dateFin', editingMainRefReg?.dateFin)
    setFieldValue('refReg', editingMainRefReg?.refReg)
    setFieldValue('url', editingMainRefReg?.url)
    setEditingMainRefReg(undefined)
    setIsEditing(false)
  }

  const computeDuplicateUrls = () => {
    setDuplicateUrls(
      layerNames?.filter(group => values.url && group.group.url === values.url && group.group.id !== values.id) ?? []
    )
  }

  if (isEditing) {
    return (
      <EditingRefRegContainer>
        {duplicateUrls.length > 0 && (
          <Duplicates>
            <dt>Détection de doublons :</dt>
            <dd>
              <Bold>
                {duplicateUrls.length} {pluralize('autre', duplicateUrls.length)}{' '}
                {pluralize('groupe', duplicateUrls.length)}
              </Bold>{' '}
              avec cette référence réglementaire
            </dd>
            <Tooltip linkText="En savoir plus" linkTextColor={THEME.color.charcoal} orientation="BOTTOM_LEFT">
              <ul>
                {duplicateUrls.map(group => (
                  <li key={group.group.id}>{formatLayerName(group.group.layerName, group.group.location)}</li>
                ))}
              </ul>
            </Tooltip>
          </Duplicates>
        )}

        <FormikTextarea isLight label="Titre de la réglementation" name="refReg" />
        <RefRegSecondLine>
          <FormikTextInput
            isErrorMessageHidden
            isLight
            isRequired
            label="URL du lien"
            name="url"
            onBlur={computeDuplicateUrls}
            style={{ flex: 1 }}
          />
          <DateContainer>
            <FormikDatePicker
              isErrorMessageHidden
              isLight
              isRequired
              isStringDate
              label="Début de validité"
              name="date"
            />
            <StyledFormikDatePicker isErrorMessageHidden isLight isStringDate label="Fin de validité" name="dateFin" />
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

  return (
    <ReadOnlyRefRegText date={values.date} dateFin={values.dateFin} refReg={values.refReg} url={values.url}>
      <IconButton
        accent={Accent.TERTIARY}
        Icon={Icon.EditUnbordered}
        onClick={editRefReg}
        title="Editer le texte réglementaire"
      />
    </ReadOnlyRefRegText>
  )
}

export const RefRegTextContainer = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
export const RefRegContainer = styled.div`
  background-color: ${p => p.theme.color.gainsboro};
  display: flex;
  gap: 16px;
  justify-content: space-between;
  padding: 8px;
`

export const EditingRefRegContainer = styled(RefRegContainer)`
  flex-direction: column;
`

export const RefRegSecondLine = styled.div`
  display: flex;
  gap: 16px;
`

export const RefRegText = styled.p`
  font-size: 13px;
  white-space: wrap;
`

export const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`

export const DateContainer = styled.div`
  display: flex;
  gap: 8px;
`

export const PeriodText = styled.p`
  color: ${p => p.theme.color.slateGray};
  font-size: 13px;
  margin-top: 6px;
  > span {
    color: ${p => p.theme.color.gunMetal};
  }
`

const StyledFormikDatePicker = styled(FormikDatePicker)`
  .Field-DatePicker__CalendarPicker {
    > .rs-picker-popup {
      left: unset !important;
      right: 0;
    }
  }
`

const Duplicates = styled.dl`
  display: flex;
  gap: 4px;
  margin: 0;
  dt {
    color: ${p => p.theme.color.slateGray};
    font-size: 11px;
    font-style: italic;
  }
`
