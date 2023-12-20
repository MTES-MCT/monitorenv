import { Accent, FieldError, FormikTextarea, Icon, IconButton, getOptionsFromLabelledEnum } from '@mtes-mct/monitor-ui'
import { useField, useFormikContext } from 'formik'
import { isEmpty } from 'lodash'
import { useEffect, useState } from 'react'
import { Toggle } from 'rsuite'

import { AttachMission } from './AttachMission'
import { CancelEditDialog } from './FormComponents/Dialog/CancelEditDialog'
import { Footer } from './FormComponents/Footer'
import { Position } from './FormComponents/Position'
import { Source } from './FormComponents/Source'
import { Target } from './FormComponents/Target'
import { ThemeSelector } from './FormComponents/ThemeSelector'
import { SubThemesSelector } from './FormComponents/ThemeSelector/SubThemesSelector'
import { Validity } from './FormComponents/Validity'
import {
  type Reporting,
  ReportingTypeEnum,
  ReportingTypeLabels,
  type ReportingDetailed
} from '../../../domain/entities/reporting'
import {
  hideSideButtons,
  setReportingFormVisibility,
  ReportingContext,
  VisibilityState
} from '../../../domain/shared_slices/Global'
import { reportingActions } from '../../../domain/shared_slices/reporting'
import { closeReporting } from '../../../domain/use_cases/reporting/closeReporting'
import { deleteReporting } from '../../../domain/use_cases/reporting/deleteReporting'
import { reduceOrExpandReportingForm } from '../../../domain/use_cases/reporting/reduceOrExpandReportingForm'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { DeleteModal } from '../../commonComponents/Modals/Delete'
import { useSyncFormValuesWithRedux } from '../hooks/useSyncFormValuesWithRedux'
import { attachMissionToReportingSliceActions } from '../slice'
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
import { getReportingTitle } from '../utils'

import type { AtLeast } from '../../../types'

type FormContentProps = {
  onAttachMission: (value: boolean) => void
  reducedReportingsOnContext: number
  selectedReporting: AtLeast<ReportingDetailed, 'id'> | undefined
  setShouldValidateOnChange: (value: boolean) => void
}

export function FormContent({
  onAttachMission,
  reducedReportingsOnContext,
  selectedReporting,
  setShouldValidateOnChange
}: FormContentProps) {
  const dispatch = useAppDispatch()
  const reportingFormVisibility = useAppSelector(state => state.global.reportingFormVisibility)

  const isConfirmCancelDialogVisible = useAppSelector(state => state.reporting.isConfirmCancelDialogVisible)
  const activeReportingId = useAppSelector(state => state.reporting.activeReportingId)
  const reportingContext =
    useAppSelector(state => (activeReportingId ? state.reporting.reportings[activeReportingId]?.context : undefined)) ||
    ReportingContext.MAP

  const { dirty, errors, setFieldValue, setValues, values } = useFormikContext<Partial<Reporting>>()
  const [themeField] = useField('themeId')

  const [isDeleteModalOpen, setIsDeletModalOpen] = useState(false)
  const [mustIncreaseValidity, setMustIncreaseValidity] = useState(false)

  const isMapContext = reportingContext === ReportingContext.MAP

  useEffect(() => {
    if (selectedReporting) {
      setValues(selectedReporting)
      dispatch(reportingActions.setReportingContext(reportingContext))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useSyncFormValuesWithRedux()

  const reportTypeOptions = getOptionsFromLabelledEnum(ReportingTypeLabels)

  const changeReportType = reportType => {
    setFieldValue('reportType', reportType)
    setFieldValue('isControlRequired', reportType === ReportingTypeEnum.INFRACTION_SUSPICION)
  }

  const changeNeedControlValue = async checked => {
    setFieldValue('isControlRequired', checked)
    if (!checked) {
      setFieldValue('hasNoUnitAvailable', false)
      await dispatch(attachMissionToReportingSliceActions.resetAttachMissionState())
    }
  }

  const reduceOrExpandReporting = () => {
    if (isMapContext) {
      dispatch(hideSideButtons())
    }
    dispatch(reduceOrExpandReportingForm(reportingContext))
  }

  const returnToEdition = () => {
    dispatch(reportingActions.setIsConfirmCancelDialogVisible(false))
  }

  const confirmCloseReporting = () => {
    dispatch(reportingActions.setIsConfirmCancelDialogVisible(false))
    dispatch(reportingActions.deleteSelectedReporting(selectedReporting?.id))
    dispatch(attachMissionToReportingSliceActions.setIsMissionAttachmentInProgress(false))
    dispatch(
      setReportingFormVisibility({
        context: reportingContext,
        visibility: VisibilityState.NONE
      })
    )
  }

  const deleteCurrentReporting = () => {
    setIsDeletModalOpen(true)
  }

  const cancelNewReporting = async () => {
    if (dirty) {
      dispatch(reportingActions.setIsConfirmCancelDialogVisible(true))
    } else {
      await dispatch(reportingActions.deleteSelectedReporting(selectedReporting?.id))
      dispatch(
        setReportingFormVisibility({
          context: reportingContext,
          visibility: VisibilityState.NONE
        })
      )
    }
  }

  const cancelDeleteReporting = () => {
    setIsDeletModalOpen(false)
  }

  const confirmDeleteReporting = () => {
    dispatch(deleteReporting(values.id))
  }

  if (!selectedReporting || isEmpty(values)) {
    return null
  }

  return (
    <StyledFormContainer>
      <CancelEditDialog
        key={`cancel-edit-modal-${selectedReporting.id}`}
        onCancel={returnToEdition}
        onConfirm={confirmCloseReporting}
        open={isConfirmCancelDialogVisible}
      />
      <DeleteModal
        key={`delete-modal-${selectedReporting.id}`}
        context="reporting"
        isAbsolute={false}
        onCancel={cancelDeleteReporting}
        onConfirm={confirmDeleteReporting}
        open={isDeleteModalOpen}
        subTitle="Êtes-vous sûr de vouloir supprimer le signalement&nbsp;?"
        title="Supprimer le signalement&nbsp;?"
      />
      <StyledHeader>
        <StyledTitle data-cy="reporting-title">
          <Icon.Report />
          {getReportingTitle(values)}
        </StyledTitle>

        <StyledHeaderButtons>
          <StyledChevronIcon
            $isOpen={
              reportingFormVisibility.context === reportingContext &&
              reportingFormVisibility.visibility === VisibilityState.REDUCED
            }
            accent={Accent.TERTIARY}
            data-cy="reporting-reduce-or-expand-button"
            Icon={Icon.Chevron}
            onClick={reduceOrExpandReporting}
          />
          <IconButton
            accent={Accent.TERTIARY}
            Icon={Icon.Close}
            onClick={() => dispatch(closeReporting(selectedReporting.id, reportingContext))}
          />
        </StyledHeaderButtons>
      </StyledHeader>
      <StyledForm $totalReducedReportings={reducedReportingsOnContext}>
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
          <ThemeSelector isLight={false} label="Thématique du signalement" name="themeId" />
          <SubThemesSelector
            isLight={false}
            label="Sous-thématique du signalement"
            name="subThemeIds"
            theme={themeField?.value}
          />
        </StyledThemeContainer>
        <Validity mustIncreaseValidity={mustIncreaseValidity} />
        <StyledFormikTextInput label="Saisi par" name="openBy" />
        <Separator />
        <FormikTextarea label="Actions effectuées" name="actionTaken" />

        <StyledToggle>
          <Toggle
            checked={values.isControlRequired || false}
            data-cy="reporting-is-control-required"
            disabled={values.isArchived}
            onChange={changeNeedControlValue}
          />
          <span>Le signalement nécessite un contrôle</span>
        </StyledToggle>
        <AttachMission onAttachMission={onAttachMission} />
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
