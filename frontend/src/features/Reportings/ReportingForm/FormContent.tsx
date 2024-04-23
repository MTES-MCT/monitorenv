import { Italic } from '@components/style'
import { AutoSaveTag } from '@features/missions/MissionForm/AutoSaveTag'
import {
  customDayjs,
  FormikEffect,
  FormikMultiRadio,
  FormikTextarea,
  getOptionsFromLabelledEnum,
  Toggle
} from '@mtes-mct/monitor-ui'
import { getDateAsLocalizedStringVeryCompact } from '@utils/getDateAsLocalizedString'
import { saveReporting } from 'domain/use_cases/reporting/saveReporting'
import { useField, useFormikContext } from 'formik'
import { debounce, isEmpty } from 'lodash'
import { useEffect, useMemo, useState } from 'react'

import { AttachMission } from './AttachMission'
import { CancelEditDialog } from './FormComponents/Dialog/CancelEditDialog'
import { Footer } from './FormComponents/Footer'
import { Position } from './FormComponents/Position'
import { Source } from './FormComponents/Source'
import { Target } from './FormComponents/Target'
import { ThemeSelector } from './FormComponents/ThemeSelector'
import { SubThemesSelector } from './FormComponents/ThemeSelector/SubThemesSelector'
import { Validity } from './FormComponents/Validity'
import { Header } from './Header'
import {
  type Reporting,
  ReportingTypeEnum,
  ReportingTypeLabels,
  type ReportingDetailed,
  INDIVIDUAL_ANCHORING_THEME_ID
} from '../../../domain/entities/reporting'
import {
  setReportingFormVisibility,
  ReportingContext,
  VisibilityState,
  hideSideButtons
} from '../../../domain/shared_slices/Global'
import { reportingActions } from '../../../domain/shared_slices/reporting'
import { deleteReporting } from '../../../domain/use_cases/reporting/deleteReporting'
import { reduceOrCollapseReportingForm } from '../../../domain/use_cases/reporting/reduceOrCollapseReportingForm'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { DeleteModal } from '../../commonComponents/Modals/Delete'
import { mainWindowActions } from '../../MainWindow/slice'
import { useSyncFormValuesWithRedux } from '../hooks/useSyncFormValuesWithRedux'
import { attachMissionToReportingSliceActions } from '../slice'
import {
  Separator,
  StyledForm,
  StyledFormContainer,
  StyledThemeContainer,
  StyledToggle,
  StyledFormikTextInput,
  ReportTypeMultiRadio,
  SaveBanner
} from '../style'
import { isReportingAutoSaveEnabled, shouldSaveReporting } from '../utils'

import type { AtLeast } from '../../../types'

const validateBeforeOnChange = debounce(
  async (nextValues, dispatch, validateForm, isAutoSaveEnabled, selectedReporting, context) => {
    const errors = await validateForm()
    const isValid = isEmpty(errors)

    if (!isAutoSaveEnabled || !isValid) {
      return
    }

    if (!shouldSaveReporting(selectedReporting, nextValues)) {
      return
    }

    dispatch(saveReporting(nextValues, context))
  },
  250
)

type FormContentProps = {
  reducedReportingsOnContext: number
  selectedReporting: AtLeast<ReportingDetailed, 'id'> | undefined
}

export function FormContent({ reducedReportingsOnContext, selectedReporting }: FormContentProps) {
  const dispatch = useAppDispatch()

  const reportingFormVisibility = useAppSelector(state => state.global.reportingFormVisibility)
  const isConfirmCancelDialogVisible = useAppSelector(state => state.reporting.isConfirmCancelDialogVisible)
  const activeReportingId = useAppSelector(state => state.reporting.activeReportingId)
  const reportingContext =
    useAppSelector(state => (activeReportingId ? state.reporting.reportings[activeReportingId]?.context : undefined)) ??
    ReportingContext.MAP

  const { errors, setFieldValue, setValues, validateForm, values } = useFormikContext<Partial<Reporting>>()
  const [themeField] = useField('themeId')

  const [isDeleteModalOpen, setIsDeletModalOpen] = useState(false)
  const [mustIncreaseValidity, setMustIncreaseValidity] = useState(false)

  const isMapContext = reportingContext === ReportingContext.MAP
  const isFormDirty = useAppSelector(state =>
    activeReportingId ? state.reporting.reportings[activeReportingId]?.isFormDirty : false
  )

  const formattedUpdatedDate = useMemo(
    () => values.updatedAtUtc && getDateAsLocalizedStringVeryCompact(values.updatedAtUtc),
    [values.updatedAtUtc]
  )

  const isAutoSaveEnabled = useMemo(() => {
    if (!isReportingAutoSaveEnabled()) {
      return false
    }

    if (selectedReporting?.isArchived) {
      return false
    }

    return true
  }, [selectedReporting])

  useEffect(() => {
    if (selectedReporting) {
      setValues(selectedReporting)
      dispatch(reportingActions.setReportingContext(reportingContext))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useSyncFormValuesWithRedux(isAutoSaveEnabled)

  const reportTypeOptions = getOptionsFromLabelledEnum(ReportingTypeLabels)
  const withVHFAnswerOptions = [
    { label: 'Oui', value: true },
    { label: 'Non', value: false }
  ]
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
    if (reportingContext === ReportingContext.MAP) {
      dispatch(mainWindowActions.setHasFullHeightRightDialogOpen(false))
    }
  }

  const deleteCurrentReporting = () => {
    setIsDeletModalOpen(true)
  }

  const closeReporting = async () => {
    if (isFormDirty) {
      dispatch(reportingActions.setIsConfirmCancelDialogVisible(true))
    } else {
      await dispatch(reportingActions.deleteSelectedReporting(selectedReporting?.id))
      dispatch(
        setReportingFormVisibility({
          context: reportingContext,
          visibility: VisibilityState.NONE
        })
      )
      if (reportingContext === ReportingContext.MAP) {
        dispatch(mainWindowActions.setHasFullHeightRightDialogOpen(false))
      }
    }
  }

  const cancelDeleteReporting = () => {
    setIsDeletModalOpen(false)
  }

  const confirmDeleteReporting = () => {
    dispatch(deleteReporting(values.id))
  }

  const reduceOrCollapseReporting = () => {
    if (isMapContext) {
      dispatch(hideSideButtons())
    }
    dispatch(reduceOrCollapseReportingForm(reportingContext))
  }

  useEffect(() => {
    if (!isAutoSaveEnabled) {
      return
    }
    if (
      values?.updatedAtUtc &&
      !customDayjs(selectedReporting?.updatedAtUtc).isSame(customDayjs(values?.updatedAtUtc), 'minutes')
    ) {
      setFieldValue('updatedAtUtc', selectedReporting?.updatedAtUtc)
    }

    // there's no need to listen for changes in `values`, since `updatedAtUtc` is read-only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedReporting?.updatedAtUtc, isAutoSaveEnabled])

  if (!selectedReporting || isEmpty(values)) {
    return null
  }

  return (
    <StyledFormContainer>
      <FormikEffect
        onChange={nextValues =>
          validateBeforeOnChange(
            nextValues,
            dispatch,
            validateForm,
            isAutoSaveEnabled,
            selectedReporting,
            reportingContext
          )
        }
      />
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
      <Header
        isExpanded={
          reportingFormVisibility.context === reportingContext &&
          reportingFormVisibility.visibility === VisibilityState.REDUCED
        }
        reduceOrCollapseReporting={reduceOrCollapseReporting}
        reporting={selectedReporting}
      />
      <SaveBanner>
        {!values?.updatedAtUtc && <Italic>Signalement non créé</Italic>}
        {values?.updatedAtUtc && (
          <>
            <Italic>Dernière modification le {formattedUpdatedDate}</Italic>
            <AutoSaveTag isAutoSaveEnabled={isAutoSaveEnabled} />
          </>
        )}
      </SaveBanner>
      <StyledForm $totalReducedReportings={reducedReportingsOnContext}>
        <Source />
        <Target />
        <Position />
        <FormikTextarea label="Description du signalement" name="description" />
        <Separator />

        <div>
          <ReportTypeMultiRadio
            error={errors.reportType}
            isErrorMessageHidden
            isInline
            isRequired
            label="Type de signalement"
            name="reportType"
            onChange={changeReportType}
            options={reportTypeOptions}
            value={values.reportType}
          />
        </div>
        <StyledThemeContainer>
          <ThemeSelector isLight={false} label="Thématique du signalement" name="themeId" />
          <SubThemesSelector
            isLight={false}
            label="Sous-thématique du signalement"
            name="subThemeIds"
            theme={themeField?.value}
          />
          {values.themeId === INDIVIDUAL_ANCHORING_THEME_ID && (
            <FormikMultiRadio isInline label="Réponse à la VHF" name="withVHFAnswer" options={withVHFAnswerOptions} />
          )}
        </StyledThemeContainer>

        <Validity mustIncreaseValidity={mustIncreaseValidity} />

        <StyledFormikTextInput isErrorMessageHidden isRequired label="Saisi par" name="openBy" />

        <Separator />
        <FormikTextarea label="Actions effectuées" name="actionTaken" />

        <StyledToggle>
          <Toggle
            checked={!!values.isControlRequired || false}
            dataCy="reporting-is-control-required"
            disabled={values.isArchived}
            isLabelHidden
            label="Le signalement nécessite un contrôle"
            name="isControlRequired"
            onChange={changeNeedControlValue}
          />
          <span>Le signalement nécessite un contrôle</span>
        </StyledToggle>
        <AttachMission />
      </StyledForm>
      <Footer
        isAutoSaveEnabled={isAutoSaveEnabled}
        onClose={closeReporting}
        onDelete={deleteCurrentReporting}
        setMustIncreaseValidity={setMustIncreaseValidity}
      />
    </StyledFormContainer>
  )
}
