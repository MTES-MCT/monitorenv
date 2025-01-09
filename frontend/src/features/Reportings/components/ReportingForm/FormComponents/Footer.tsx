import { reportingActions } from '@features/Reportings/slice'
import { StyledButton, ButtonWithWiteBg, StyledDeleteButton, StyledFooter } from '@features/Reportings/style'
import { reopenReporting } from '@features/Reportings/useCases/reopenReporting'
import { saveReporting } from '@features/Reportings/useCases/saveReporting'
import { getTimeLeft, isNewReporting } from '@features/Reportings/utils'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, THEME, customDayjs, getLocalizedDayjs } from '@mtes-mct/monitor-ui'
import { ReportingStatusEnum, type Reporting, getReportingStatus } from 'domain/entities/reporting'
import { ReportingContext } from 'domain/shared_slices/Global'
import { useFormikContext } from 'formik'
import { isEmpty } from 'lodash'

type ReportingFooterProps = {
  isAutoSaveEnabled: boolean
  onClose: () => void
  onDelete: () => void
  onSave: () => void
  setMustIncreaseValidity: (value: boolean) => void
}
export function Footer({
  isAutoSaveEnabled,
  onClose,
  onDelete,
  onSave,
  setMustIncreaseValidity
}: ReportingFooterProps) {
  const activeReportingId = useAppSelector(state => state.reporting.activeReportingId)
  const reportingContext =
    useAppSelector(state => (activeReportingId ? state.reporting.reportings[activeReportingId]?.context : undefined)) ??
    ReportingContext.MAP

  const dispatch = useAppDispatch()
  const { setFieldValue, validateForm, values } = useFormikContext<Reporting>()

  const reportingStatus = getReportingStatus(values)

  const handleReopen = () => {
    const endOfValidity = getLocalizedDayjs(values?.createdAt ?? customDayjs().toISOString()).add(
      values?.validityTime ?? 0,
      'hour'
    )
    const timeLeft = getTimeLeft(endOfValidity)

    if (timeLeft < 0) {
      setMustIncreaseValidity(true)

      return
    }
    setMustIncreaseValidity(false)

    validateForm({ ...values, isArchived: false }).then(async errors => {
      if (!isEmpty(errors)) {
        return
      }
      setFieldValue('isArchived', false)
      dispatch(reopenReporting({ ...values, isArchived: false }, reportingContext))
    })
  }

  const handleArchive = async () => {
    validateForm().then(async errors => {
      if (!isEmpty(errors)) {
        dispatch(reportingActions.setIsConfirmCancelDialogVisible(true))

        return
      }

      dispatch(saveReporting({ ...values, isArchived: true }, reportingContext, true))
    })
  }

  if (isNewReporting(values.id)) {
    return (
      <StyledFooter $justify="end">
        <ButtonWithWiteBg accent={Accent.SECONDARY} onClick={onClose}>
          Fermer
        </ButtonWithWiteBg>
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
        title="Supprimer le signalement"
      />

      <div>
        {reportingStatus === ReportingStatusEnum.ARCHIVED || values.isArchived ? (
          <StyledButton Icon={Icon.Unlock} onClick={handleReopen}>
            Rouvrir le signalement
          </StyledButton>
        ) : (
          <StyledButton Icon={Icon.Archive} onClick={handleArchive}>
            Archiver
          </StyledButton>
        )}
        {isAutoSaveEnabled ? (
          <ButtonWithWiteBg accent={Accent.SECONDARY} data-cy="close-reporting" onClick={onClose}>
            Fermer
          </ButtonWithWiteBg>
        ) : (
          <ButtonWithWiteBg accent={Accent.SECONDARY} data-cy="save-reporting" Icon={Icon.Save} onClick={onSave}>
            Enregistrer et quitter
          </ButtonWithWiteBg>
        )}
      </div>
    </StyledFooter>
  )
}
