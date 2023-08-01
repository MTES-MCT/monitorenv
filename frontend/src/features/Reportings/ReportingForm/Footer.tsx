import { Accent, Icon, THEME, customDayjs, getLocalizedDayjs } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import _ from 'lodash'
import { useDispatch } from 'react-redux'

import { ReportingStatusEnum, type Reporting, getReportingStatus } from '../../../domain/entities/reporting'
import { reopenReporting } from '../../../domain/use_cases/reportings/reopenReporting'
import { StyledButton, StyledSubmitButton, StyledDeleteButton, StyledFooter } from '../style'

export function Footer({ onCancel, onDelete, setMustIncreaseValidity, setShouldValidateOnChange }) {
  const dispatch = useDispatch()
  const { handleSubmit, setFieldValue, validateForm, values } = useFormikContext<Reporting>()

  const reportingStatus = getReportingStatus(values)

  const handleReopen = async () => {
    const endOfValidity = getLocalizedDayjs(values?.createdAt).add(values?.validityTime || 0, 'hour')
    const timeLeft = customDayjs(endOfValidity).diff(getLocalizedDayjs(customDayjs().toISOString()), 'hour', true)

    if (timeLeft < 0) {
      setMustIncreaseValidity(true)

      return
    }
    setMustIncreaseValidity(false)
    validateForm({ ...values, isArchived: false }).then(async errors => {
      if (_.isEmpty(errors)) {
        await dispatch(reopenReporting({ ...values, isArchived: false }))

        return
      }
      setShouldValidateOnChange(true)
    })
  }

  const handleArchive = async () => {
    await setFieldValue('isArchived', true)
    validateForm().then(errors => {
      if (_.isEmpty(errors)) {
        handleSubmit()

        return
      }
      setShouldValidateOnChange(true)
    })
  }

  if (values.id) {
    return (
      <StyledFooter>
        <StyledDeleteButton
          accent={Accent.SECONDARY}
          color={THEME.color.maximumRed}
          Icon={Icon.Delete}
          onClick={onDelete}
        />

        <div>
          {reportingStatus === ReportingStatusEnum.ARCHIVED || values.isArchived ? (
            <StyledButton Icon={Icon.Unlock} onClick={handleReopen}>
              Rouvrir le signalement
            </StyledButton>
          ) : (
            <StyledButton Icon={Icon.Archive} onClick={handleArchive}>
              Enregistrer et archiver
            </StyledButton>
          )}
          <StyledSubmitButton accent={Accent.SECONDARY} Icon={Icon.Save} onClick={() => handleSubmit()}>
            Enregistrer et quitter
          </StyledSubmitButton>
        </div>
      </StyledFooter>
    )
  }

  return (
    <StyledFooter $justify="end">
      <StyledButton onClick={onCancel}>Annuler</StyledButton>
      <StyledSubmitButton accent={Accent.SECONDARY} Icon={Icon.Save} onClick={() => handleSubmit()}>
        Valider le signalement
      </StyledSubmitButton>
    </StyledFooter>
  )
}
