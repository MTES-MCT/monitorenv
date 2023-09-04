import { Accent, FieldError, FormikTextarea, Icon, IconButton, getOptionsFromLabelledEnum } from '@mtes-mct/monitor-ui'
import { useField, useFormikContext } from 'formik'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Toggle } from 'rsuite'

import { CancelEditDialog } from './FormComponents/Dialog/CancelEditDialog'
import { Footer } from './FormComponents/Footer'
import { Position } from './FormComponents/Position'
import { Source } from './FormComponents/Source'
import { Target } from './FormComponents/Target'
import { ThemeSelector } from './FormComponents/ThemeSelector'
import { SubThemesSelector } from './FormComponents/ThemeSelector/SubThemesSelector'
import { Validity } from './FormComponents/Validity'
import { Reporting, ReportingTypeEnum, ReportingTypeLabels } from '../../../domain/entities/reporting'
import { hideSideButtons, setReportingFormVisibility } from '../../../domain/shared_slices/Global'
import { multiReportingsActions } from '../../../domain/shared_slices/MultiReportings'
import { ReportingContext, VisibilityState, reportingStateActions } from '../../../domain/shared_slices/ReportingState'
import { closeReporting } from '../../../domain/use_cases/reportings/closeReporting'
import { deleteReporting } from '../../../domain/use_cases/reportings/deleteReporting'
import { reduceOrExpandReportingForm } from '../../../domain/use_cases/reportings/reduceOrExpandReportingForm'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useSyncFormValuesWithRedux } from '../../../hooks/useSyncFormValuesWithRedux'
import { DeleteModal } from '../../commonComponents/Modals/Delete'
import {
  Separator,
  StyledForm,
  StyledFormContainer,
  StyledHeader,
  StyledThemeContainer,
  StyledToggle,
  StyledHeaderButtons,
  StyledTitle,
  StyledChevronIcon,
  StyledFormikTextInput,
  ReportTypeMultiRadio
} from '../style'
import { getReportingInitialValues, getReportingTitle } from '../utils'

export function ReportingForm({ selectedReporting, setShouldValidateOnChange }) {
  const dispatch = useDispatch()
  const {
    global: { reportingFormVisibility },
    reportingState: { isConfirmCancelDialogVisible }
  } = useAppSelector(state => state)

  const { dirty, errors, setFieldValue, setValues, values } = useFormikContext<Partial<Reporting>>()
  const [themeField] = useField('theme')

  const [isDeleteModalOpen, setIsDeletModalOpen] = useState(false)
  const [mustIncreaseValidity, setMustIncreaseValidity] = useState(false)

  const isSideWindowContext = selectedReporting.context === ReportingContext.SIDE_WINDOW

  useSyncFormValuesWithRedux(reportingStateActions.setReportingState, reportingStateActions.setIsDirty)

  useEffect(() => {
    if (selectedReporting.reporting) {
      setValues(getReportingInitialValues(selectedReporting.reporting))
      dispatch(reportingStateActions.setReportingContext(selectedReporting.context))
    }
  }, [setValues, selectedReporting, dispatch])

  const reportTypeOptions = getOptionsFromLabelledEnum(ReportingTypeLabels)

  const changeReportType = reportType => {
    setFieldValue('reportType', reportType)
    if (reportType === ReportingTypeEnum.OBSERVATION) {
      setFieldValue('isControlRequired', undefined)
    }
  }

  const changeNeedControlValue = checked => {
    setFieldValue('isControlRequired', checked)
  }

  const reduceOrExpandReporting = () => {
    if (!isSideWindowContext) {
      dispatch(hideSideButtons())
    }
    dispatch(reduceOrExpandReportingForm(selectedReporting.context))
  }

  const returnToEdition = () => {
    dispatch(reportingStateActions.setIsConfirmCancelDialogVisible(false))
  }

  const confirmCloseReporting = () => {
    dispatch(reportingStateActions.setIsConfirmCancelDialogVisible(false))
    dispatch(multiReportingsActions.deleteSelectedReporting(selectedReporting.reporting.id))
    dispatch(
      setReportingFormVisibility({
        context: selectedReporting.context,
        visibility: VisibilityState.NONE
      })
    )
  }

  const deleteCurrentReporting = () => {
    setIsDeletModalOpen(true)
  }

  const cancelNewReporting = () => {
    if (dirty) {
      dispatch(reportingStateActions.setIsConfirmCancelDialogVisible(true))
    } else {
      setReportingFormVisibility({
        context: selectedReporting.context,
        visibility: VisibilityState.NONE
      })
    }
  }

  const cancelDeleteReporting = () => {
    setIsDeletModalOpen(false)
  }

  const confirmDeleteReporting = () => {
    dispatch(deleteReporting(values.id))
  }

  return (
    <StyledFormContainer>
      <CancelEditDialog
        onCancel={returnToEdition}
        onConfirm={confirmCloseReporting}
        open={isConfirmCancelDialogVisible}
      />
      <DeleteModal
        context="reporting"
        isAbsolute={false}
        onCancel={cancelDeleteReporting}
        onConfirm={confirmDeleteReporting}
        open={isDeleteModalOpen}
        subTitle="Êtes-vous sûr de vouloir supprimer le signalement&nbsp;?"
        title="Supprimer le signalement&nbsp;?"
      />
      <StyledHeader>
        <StyledTitle>
          <Icon.Report />
          {getReportingTitle(selectedReporting.reporting)}
        </StyledTitle>

        <StyledHeaderButtons>
          <StyledChevronIcon
            $isOpen={
              reportingFormVisibility.context === selectedReporting.context &&
              reportingFormVisibility.visibility === VisibilityState.REDUCED
            }
            accent={Accent.TERTIARY}
            Icon={Icon.Chevron}
            onClick={reduceOrExpandReporting}
          />
          <IconButton
            accent={Accent.TERTIARY}
            Icon={Icon.Close}
            onClick={() => dispatch(closeReporting(selectedReporting.reporting.id, selectedReporting.context))}
          />
        </StyledHeaderButtons>
      </StyledHeader>
      <StyledForm>
        <Source />
        <Target />
        <Position />
        <FormikTextarea label="Description du signalement" name="description" />
        <Separator />

        <div>
          <ReportTypeMultiRadio
            data-cy="reporting-type"
            isInline
            label="Type de signalement"
            name="reportType"
            onChange={changeReportType}
            options={reportTypeOptions}
            value={values.reportType}
          />
          {errors.reportType && <FieldError>{errors.reportType}</FieldError>}
        </div>
        <StyledThemeContainer>
          <ThemeSelector isLight={false} label="Thématique du signalement" name="theme" />
          <SubThemesSelector
            isLight={false}
            label="Sous-thématique du signalement"
            name="subThemes"
            theme={themeField?.value}
          />
        </StyledThemeContainer>
        <Validity mustIncreaseValidity={mustIncreaseValidity} />
        <Separator />
        <FormikTextarea label="Actions effectuées" name="actionTaken" />

        <StyledToggle>
          <Toggle
            checked={values.isControlRequired || false}
            data-cy="reporting-is-control-required"
            onChange={changeNeedControlValue}
          />
          <span>Le signalement nécessite un contrôle</span>
        </StyledToggle>
        <Separator />
        <StyledFormikTextInput label="Saisi par" name="openBy" />
      </StyledForm>
      <Footer
        onCancel={cancelNewReporting}
        onDelete={deleteCurrentReporting}
        setMustIncreaseValidity={setMustIncreaseValidity}
        setShouldValidateOnChange={setShouldValidateOnChange}
      />
    </StyledFormContainer>
  )
}
