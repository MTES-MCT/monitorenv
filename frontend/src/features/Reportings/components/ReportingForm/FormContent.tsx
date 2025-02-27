import { Italic } from '@components/style'
import { AutoSaveTag } from '@features/commonComponents/AutoSaveTag'
import { DeleteModal } from '@features/commonComponents/Modals/Delete'
import { mainWindowActions } from '@features/MainWindow/slice'
import { useSyncFormValuesWithRedux } from '@features/Reportings/hooks/useSyncFormValuesWithRedux'
import { reportingActions } from '@features/Reportings/slice'
import {
  ReportTypeMultiRadio,
  SaveBanner,
  Separator,
  StyledForm,
  StyledFormContainer,
  StyledFormikTextInput,
  StyledInfractionProven,
  StyledItalic,
  StyledThemeContainer,
  StyledToggle
} from '@features/Reportings/style'
import { deleteReporting } from '@features/Reportings/useCases/deleteReporting'
import { reduceOrCollapseReportingForm } from '@features/Reportings/useCases/reduceOrCollapseReportingForm'
import { saveReporting } from '@features/Reportings/useCases/saveReporting'
import { createNewReportingSource, isNewReporting } from '@features/Reportings/utils'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import {
  customDayjs,
  FormikEffect,
  FormikMultiRadio,
  FormikTextarea,
  getOptionsFromLabelledEnum,
  Label,
  Toggle
} from '@mtes-mct/monitor-ui'
import { getDateAsLocalizedStringVeryCompact } from '@utils/getDateAsLocalizedString'
import { useReportingEventContext } from 'context/reporting/useReportingEventContext'
import {
  type Reporting,
  INDIVIDUAL_ANCHORING_THEME_ID,
  InfractionProvenLabels,
  ReportingTypeEnum,
  ReportingTypeLabels
} from 'domain/entities/reporting'
import {
  hideAllDialogs,
  ReportingContext,
  setReportingFormVisibility,
  VisibilityState
} from 'domain/shared_slices/Global'
import {
  MapInteractionListenerEnum,
  updateMapInteractionListeners
} from 'domain/use_cases/map/updateMapInteractionListeners'
import { FieldArray, useFormikContext } from 'formik'
import { isEmpty } from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { useDebouncedCallback } from 'use-debounce'

import { AttachMission } from './AttachMission'
import { attachMissionToReportingSliceActions } from './AttachMission/slice'
import { CancelEditDialog } from './FormComponents/Dialog/CancelEditDialog'
import { Footer } from './FormComponents/Footer'
import { Position } from './FormComponents/Position'
import { Source } from './FormComponents/Source'
import { Target } from './FormComponents/Target'
import { ThemeSelector } from './FormComponents/ThemeSelector'
import { SubThemesSelector } from './FormComponents/ThemeSelector/SubThemesSelector'
import { Validity } from './FormComponents/Validity'
import { FormikSyncReportingFields } from './FormikSyncReportingFields'
import { Header } from './Header'
import { isReportingAutoSaveEnabled, shouldSaveReporting } from './utils'

import type { AtLeast } from '../../../../types'

const WITH_VHF_ANSWER_OPTIONS = [
  { label: 'Oui', value: true },
  { label: 'Non', value: false }
]

type FormContentProps = {
  reducedReportingsOnContext: number
  selectedReporting: AtLeast<Reporting, 'id'> | undefined
}

export function FormContent({ reducedReportingsOnContext, selectedReporting }: FormContentProps) {
  const dispatch = useAppDispatch()

  const openByRef = useRef<HTMLDivElement>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const { scrollPosition, setScrollPosition } = useReportingEventContext()

  const reportingFormVisibility = useAppSelector(state => state.global.visibility.reportingFormVisibility)
  const isConfirmCancelDialogVisible = useAppSelector(state => state.reporting.isConfirmCancelDialogVisible)
  const activeReportingId = useAppSelector(state => state.reporting.activeReportingId)
  const reportingContext =
    useAppSelector(state => (activeReportingId ? state.reporting.reportings[activeReportingId]?.context : undefined)) ??
    ReportingContext.MAP

  const { errors, setFieldValue, setValues, validateForm, values } = useFormikContext<AtLeast<Reporting, 'id'>>()

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

  const { getReportingEventById } = useReportingEventContext()
  const reportingEvent = getReportingEventById(activeReportingId)

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
    // Force rerender init values for thematiques and empty reporting sources
    if (selectedReporting) {
      setValues({
        ...selectedReporting,
        reportingSources: !selectedReporting.reportingSources?.length
          ? [createNewReportingSource()]
          : selectedReporting.reportingSources
      })
      dispatch(reportingActions.setReportingContext(reportingContext))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useSyncFormValuesWithRedux(isAutoSaveEnabled)

  const infractionProvenOptions = Object.values(InfractionProvenLabels)
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
    dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
  }

  const deleteCurrentReporting = () => {
    setIsDeletModalOpen(true)
  }

  const saveAndQuit = () => {
    if (isEmpty(errors)) {
      dispatch(saveReporting(values, reportingContext, true))

      return
    }
    dispatch(reportingActions.setIsConfirmCancelDialogVisible(true))
  }

  const closeReporting = async () => {
    if (isFormDirty) {
      dispatch(reportingActions.setIsConfirmCancelDialogVisible(true))
    } else {
      await dispatch(reportingActions.deleteSelectedReporting(selectedReporting?.id))
      dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
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
      dispatch(hideAllDialogs())
    }
    dispatch(reduceOrCollapseReportingForm(reportingContext))
  }

  const validateBeforeOnChange = useDebouncedCallback(async nextValues => {
    if (scrollPosition !== 0) {
      setScrollPosition(0)
    }

    const formErrors = await validateForm()
    const isValid = isEmpty(formErrors)

    if (!isAutoSaveEnabled || !isValid) {
      return
    }

    if (!shouldSaveReporting(selectedReporting, reportingEvent, nextValues)) {
      return
    }

    const reportingIsNew = isNewReporting(values.id)

    if (reportingIsNew) {
      setScrollPosition(scrollTop)
    }
    await dispatch(saveReporting(nextValues, reportingContext))
  }, 245)

  useEffect(() => {
    if (!isAutoSaveEnabled) {
      return
    }
    if (
      (values?.updatedAtUtc &&
        !customDayjs(selectedReporting?.updatedAtUtc).isSame(customDayjs(values?.updatedAtUtc), 'minutes')) ||
      (!values.updatedAtUtc && selectedReporting?.updatedAtUtc)
    ) {
      setFieldValue('updatedAtUtc', selectedReporting?.updatedAtUtc)
    }
    if (
      reportingEvent &&
      !customDayjs(reportingEvent.updatedAtUtc).isSame(customDayjs(values?.updatedAtUtc), 'minutes')
    ) {
      setFieldValue('updatedAtUtc', reportingEvent?.updatedAtUtc)
    }

    // we want to listen to `updatedAtUtc` after `saveReporting` or when a reporting event is received
    // there's no need to listen for changes in `values`, since `updatedAtUtc` is read-only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedReporting?.updatedAtUtc, isAutoSaveEnabled, reportingEvent])

  useEffect(() => {
    if (scrollPosition && scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollPosition })
    }
    // when we created a reporting we replace the form with the form created with its id
    // and we want to keep the scroll position of the form
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onScroll = e => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  if (!selectedReporting || isEmpty(values)) {
    return null
  }

  return (
    <StyledFormContainer>
      <FormikEffect onChange={nextValues => validateBeforeOnChange(nextValues)} />
      <FormikSyncReportingFields reportingId={selectedReporting.id} />
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
        {!values?.updatedAtUtc ? (
          <Italic>Signalement non créé</Italic>
        ) : (
          <StyledItalic>Dernière modification le {formattedUpdatedDate}</StyledItalic>
        )}
        <AutoSaveTag isAutoSaveEnabled={isAutoSaveEnabled} />
      </SaveBanner>
      <StyledForm ref={scrollRef} $totalReducedReportings={reducedReportingsOnContext} onScroll={onScroll}>
        <FieldArray
          name="reportingSources"
          render={({ push, remove }) => (
            <SourceWrapper>
              {selectedReporting.reportingSources?.map((reportingSource, index) => (
                <Source key={reportingSource.id ?? index} index={index} push={push} remove={remove} />
              ))}
            </SourceWrapper>
          )}
          validateOnChange={false}
        />
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
          <ThemeSelector label="Thématique du signalement" name="themeId" />
          <SubThemesSelector label="Sous-thématique du signalement" name="subThemeIds" />
          {values.themeId === INDIVIDUAL_ANCHORING_THEME_ID && (
            <FormikMultiRadio
              isInline
              label="Réponse à la VHF"
              name="withVHFAnswer"
              options={WITH_VHF_ANSWER_OPTIONS}
            />
          )}
        </StyledThemeContainer>

        <Validity mustIncreaseValidity={mustIncreaseValidity} reportingContext={reportingContext} />

        <div ref={openByRef}>
          <StyledFormikTextInput isErrorMessageHidden isRequired label="Saisi par" maxLength={3} name="openBy" />
        </div>
        <Separator />
        <FormikTextarea label="Actions effectuées" name="actionTaken" />

        <StyledInfractionProven>
          <Label>Le signalement est </Label>
          <FormikMultiRadio
            isErrorMessageHidden
            isInline
            isLabelHidden
            label="Le signalement est"
            name="isInfractionProven"
            options={infractionProvenOptions}
          />
        </StyledInfractionProven>

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
        onSave={saveAndQuit}
        setMustIncreaseValidity={hasValidityError => {
          setMustIncreaseValidity(hasValidityError)
          if (hasValidityError) {
            openByRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
          }
        }}
      />
    </StyledFormContainer>
  )
}

const SourceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`
