import { Accent, FieldError, FormikTextarea, Icon, IconButton, Label, MultiRadio, THEME } from '@mtes-mct/monitor-ui'
import { useField, useFormikContext } from 'formik'
import { useDispatch } from 'react-redux'
import { Toggle } from 'rsuite'

import { CancelEditDialog } from './Dialog/CancelEditDialog'
import { useSyncFormValuesWithRedux } from './hook/useSyncFormValuesWithRedux'
import { Localization } from './Localization'
import { Source } from './Source'
import {
  Separator,
  StyledDeleteButton,
  StyledFooter,
  StyledForm,
  StyledFormContainer,
  StyledHeader,
  StyledInfractionProven,
  StyledSubmitButton,
  StyledThemeContainer,
  StyledToggle,
  StyledHeaderButtons,
  StyledTitle,
  StyledChevronIcon,
  StyledArchivedButton
} from './style'
import { Target } from './Target'
import { Validity } from './Validity'
import {
  Reporting,
  ReportingTypeEnum,
  infractionProvenLabels,
  reportingTypeLabels
} from '../../../domain/entities/reporting'
import { setDisplayedItems, setMapToolOpened, setReportingFormVisibility } from '../../../domain/shared_slices/Global'
import { ReportingFormVisibility, reportingStateActions } from '../../../domain/shared_slices/ReportingState'
import { deleteReporting } from '../../../domain/use_cases/reportings/deleteReporting'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { SubThemesSelector } from '../../missions/MissionForm/ActionForm/Themes/SubThemesSelector'
import { ThemeSelector } from '../../missions/MissionForm/ActionForm/Themes/ThemeSelector'

export function ReportingForm() {
  const dispatch = useDispatch()
  const {
    global: { reportingFormVisibility },
    reportingState: { isConfirmCancelDialogVisible, nextSelectedReportingId }
  } = useAppSelector(state => state)
  const { dirty, errors, handleSubmit, setFieldValue, values } = useFormikContext<Partial<Reporting>>()

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
    dispatch(
      setDisplayedItems({ isSearchSemaphoreVisible: false, mapToolOpened: undefined, missionsMenuIsOpen: false })
    )
    if (reportingFormVisibility === ReportingFormVisibility.VISIBLE) {
      dispatch(setMapToolOpened(undefined))
      dispatch(setReportingFormVisibility(ReportingFormVisibility.REDUCE))
    } else {
      dispatch(setReportingFormVisibility(ReportingFormVisibility.VISIBLE))
    }
  }
  const returnToEdition = () => {
    dispatch(reportingStateActions.setIsConfirmCancelDialogVisible(false))
  }

  const confirmCloseReporting = () => {
    dispatch(reportingStateActions.setIsConfirmCancelDialogVisible(false))
    if (nextSelectedReportingId) {
      dispatch(reportingStateActions.setSelectedReportingId(nextSelectedReportingId))
      dispatch(reportingStateActions.setNextSelectedReportingId(undefined))
    } else {
      dispatch(reportingStateActions.setSelectedReportingId(undefined))
      dispatch(setReportingFormVisibility(ReportingFormVisibility.NOT_VISIBLE))
    }
  }

  const deleteCurrentReporting = () => {
    dispatch(deleteReporting(values.id))
  }

  return (
    <StyledFormContainer>
      <CancelEditDialog
        onCancel={returnToEdition}
        onConfirm={confirmCloseReporting}
        open={isConfirmCancelDialogVisible}
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
      <StyledFooter>
        <StyledDeleteButton
          accent={Accent.SECONDARY}
          color={THEME.color.maximumRed}
          Icon={Icon.Delete}
          onClick={deleteCurrentReporting}
        />
        {values.id ? (
          <div>
            {/* TODO mettre à jour icône + gérer l'archivage */}
            <StyledArchivedButton Icon={Icon.Save}>Enregistrer et archiver</StyledArchivedButton>
            <StyledSubmitButton accent={Accent.SECONDARY} Icon={Icon.Save} onClick={() => handleSubmit()}>
              Enregistrer et quitter
            </StyledSubmitButton>
          </div>
        ) : (
          <StyledSubmitButton accent={Accent.SECONDARY} Icon={Icon.Save} onClick={() => handleSubmit()}>
            Valider le signalement
          </StyledSubmitButton>
        )}
      </StyledFooter>
    </StyledFormContainer>
  )
}
