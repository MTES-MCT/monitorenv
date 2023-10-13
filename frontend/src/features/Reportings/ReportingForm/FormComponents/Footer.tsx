import { Accent, Icon, THEME, customDayjs, getLocalizedDayjs } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import _ from 'lodash'

import { ReportingStatusEnum, type Reporting, getReportingStatus } from '../../../../domain/entities/reporting'
import { ReportingContext } from '../../../../domain/shared_slices/Global'
import { reopenReporting } from '../../../../domain/use_cases/reporting/reopenReporting'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { StyledButton, StyledSubmitButton, StyledDeleteButton, StyledFooter } from '../../style'
import { isNewReporting } from '../../utils'

export function Footer({ onCancel, onDelete, setMustIncreaseValidity, setShouldValidateOnChange }) {
  const activeReportingId = useAppSelector(state => state.reporting.activeReportingId)
  const reportings = useAppSelector(state => state.reporting.reportings)
  const reportingContext = useAppSelector(state =>
    activeReportingId ? state.reporting.reportings[activeReportingId]?.context : undefined
  )
  const dispatch = useAppDispatch()
  const { handleSubmit, setFieldValue, validateForm, values } = useFormikContext<Reporting>()

  const reportingStatus = getReportingStatus(values)

  const handleReopen = () => {
    const endOfValidity = getLocalizedDayjs(values?.createdAt).add(values?.validityTime || 0, 'hour')
    const timeLeft = customDayjs(endOfValidity).diff(getLocalizedDayjs(customDayjs().toISOString()), 'hour', true)

    if (timeLeft < 0) {
      setMustIncreaseValidity(true)

      return
    }
    setMustIncreaseValidity(false)
    validateForm({ ...values, isArchived: false }).then(async errors => {
      if (_.isEmpty(errors)) {
        if (!activeReportingId || !reportings || !reportings[activeReportingId]) {
          return
        }
        dispatch(reopenReporting({ ...values, isArchived: false }, reportingContext || ReportingContext.MAP))

        return
      }
      setShouldValidateOnChange(true)
    })
  }

  const handleArchive = async () => {
    await setFieldValue('isArchived', true)
    validateForm().then(async errors => {
      if (_.isEmpty(errors)) {
        handleSubmit()

        return
      }
      await setFieldValue('isArchived', false)
      setShouldValidateOnChange(true)
    })
  }

  if (isNewReporting(values.id)) {
    return (
      <StyledFooter $justify="end">
        <StyledButton onClick={onCancel}>Annuler</StyledButton>
        <StyledSubmitButton accent={Accent.SECONDARY} Icon={Icon.Save} onClick={() => handleSubmit()}>
          Valider le signalement
        </StyledSubmitButton>
      </StyledFooter>
    )
  }

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
        <StyledSubmitButton
          accent={Accent.SECONDARY}
          data-cy="save-reporting"
          Icon={Icon.Save}
          onClick={() => handleSubmit()}
        >
          Enregistrer et quitter
        </StyledSubmitButton>
      </div>
    </StyledFooter>
  )
}
