import { Accent, FieldError, FormikTextarea, Icon, IconButton, Label, MultiRadio } from '@mtes-mct/monitor-ui'
import { useField, useFormikContext } from 'formik'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Toggle } from 'rsuite'

import { CancelEditDialog } from './Dialog/CancelEditDialog'
import { Footer } from './Footer'
import { useSyncFormValuesWithRedux } from './hook/useSyncFormValuesWithRedux'
import { Localization } from './Localization'
import { Source } from './Source'
import {
  Separator,
  StyledForm,
  StyledFormContainer,
  StyledHeader,
  StyledInfractionProven,
  StyledThemeContainer,
  StyledToggle,
  StyledHeaderButtons,
  StyledTitle,
  StyledChevronIcon
} from './style'
import { Target } from './Target'
import { Validity } from './Validity'
import {
  Reporting,
  ReportingTypeEnum,
  infractionProvenLabels,
  reportingTypeLabels
} from '../../domain/entities/reporting'
import { hideSideButtons, setReportingFormVisibility } from '../../domain/shared_slices/Global'
import { ReportingFormVisibility, reportingStateActions } from '../../domain/shared_slices/ReportingState'
import { addReporting } from '../../domain/use_cases/reportings/addReporting'
import { deleteReporting } from '../../domain/use_cases/reportings/deleteReporting'
import { useAppSelector } from '../../hooks/useAppSelector'
import { DeleteModal } from '../commonComponents/Modals/Delete'
import { ThemeSelector } from '../commonComponents/ThemeSelector'
import { SubThemesSelector } from '../commonComponents/ThemeSelector/SubThemesSelector'

export function ReportingForm() {
  const dispatch = useDispatch()
  const {
    global: { reportingFormVisibility },
    multiReportings: { nextSelectedReporting },
    reportingState: { isConfirmCancelDialogVisible }
  } = useAppSelector(state => state)

  const [isDeleteModalOpen, setIsDeletModalOpen] = useState(false)
  const { dirty, errors, setFieldValue, values } = useFormikContext<Partial<Reporting>>()

  useSyncFormValuesWithRedux(reportingStateActions.setReportingState)

  const reportTypeOptions = Object.values(reportingTypeLabels)
  const InfractionProvenOptions = Object.values(infractionProvenLabels)

  const [themeField] = useField('theme')

  const changeReportType = reportType => {
    setFieldValue('reportType', reportType)
    if (reportType === ReportingTypeEnum.OBSERVATION) {
      setFieldValue('isInfractionProven', undefined)
    }
  }

  const changeNeedControlValue = checked => {
    setFieldValue('isControlRequired', checked)
  }

  const changeIsInfractionProven = value => {
    setFieldValue('isInfractionProven', value)
    setFieldValue('isControlRequired', value)
  }

  const closeReporting = () => {
    if (dirty) {
      dispatch(reportingStateActions.setIsConfirmCancelDialogVisible(true))
    } else {
      confirmCloseReporting()
    }
  }

  const reduceOrExpandReporting = () => {
    dispatch(hideSideButtons())
    if (reportingFormVisibility === ReportingFormVisibility.VISIBLE) {
      dispatch(setReportingFormVisibility(ReportingFormVisibility.REDUCE))
    } else {
      dispatch(hideSideButtons())
      dispatch(setReportingFormVisibility(ReportingFormVisibility.VISIBLE))
    }
  }
  const returnToEdition = () => {
    dispatch(reportingStateActions.setIsConfirmCancelDialogVisible(false))
  }

  const confirmCloseReporting = () => {
    dispatch(reportingStateActions.setIsConfirmCancelDialogVisible(false))

    if (nextSelectedReporting) {
      dispatch(addReporting(nextSelectedReporting))
    } else {
      dispatch(reportingStateActions.setSelectedReportingId(undefined))
      dispatch(setReportingFormVisibility(ReportingFormVisibility.NOT_VISIBLE))
    }
  }

  const deleteCurrentReporting = () => {
    setIsDeletModalOpen(true)
  }

  const cancelNewReporting = () => {
    if (dirty) {
      dispatch(reportingStateActions.setIsConfirmCancelDialogVisible(true))
    } else {
      dispatch(setReportingFormVisibility(ReportingFormVisibility.NOT_VISIBLE))
    }
  }

  const cancelDeleteReporting = () => {
    setIsDeletModalOpen(false)
  }

  const confirmDeleteReporting = () => {
    dispatch(deleteReporting(values.id))
    dispatch(setReportingFormVisibility(ReportingFormVisibility.NOT_VISIBLE))
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
      />
      <StyledHeader>
        <StyledTitle>
          <Icon.Report />
          {values.id ? `SIGNALEMENT ${values.id}` : 'NOUVEAU SIGNALEMENT'}
        </StyledTitle>

        <StyledHeaderButtons>
          <StyledChevronIcon
            $isOpen={reportingFormVisibility === ReportingFormVisibility.REDUCE}
            accent={Accent.TERTIARY}
            Icon={Icon.Chevron}
            onClick={reduceOrExpandReporting}
          />
          <IconButton accent={Accent.TERTIARY} Icon={Icon.Close} onClick={closeReporting} />
        </StyledHeaderButtons>
      </StyledHeader>
      <StyledForm>
        <Source />
        <Target />
        <Localization />
        <FormikTextarea label="Description du signalement" name="description" />
        <Separator />

        <div>
          <MultiRadio
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
        <Validity />
        <Separator />
        <FormikTextarea label="Actions effectuées" name="actions" />
        <StyledInfractionProven>
          <Label>La suspicion d&apos;infraction est </Label>
          <MultiRadio
            disabled={values.reportType === ReportingTypeEnum.OBSERVATION}
            isErrorMessageHidden
            isInline
            isLabelHidden
            label="La suspicion d'infraction est"
            name="isInfractionProven"
            onChange={changeIsInfractionProven}
            options={InfractionProvenOptions}
            value={values.isInfractionProven}
          />
        </StyledInfractionProven>
        <StyledToggle>
          <Toggle checked={values.isControlRequired} onChange={changeNeedControlValue} />
          <span>Le signalement nécessite un contrôle</span>
        </StyledToggle>
      </StyledForm>
      <Footer onCancel={cancelNewReporting} onDelete={deleteCurrentReporting} />
    </StyledFormContainer>
  )
}
