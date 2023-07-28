import { Accent, FormikMultiRadio, FormikTextarea, Icon, IconButton, Label } from '@mtes-mct/monitor-ui'
import { useField, useFormikContext } from 'formik'
import { useDispatch } from 'react-redux'
import { Toggle } from 'rsuite'

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
  StyledHeaderButtons
} from './style'
import { Target } from './Target'
import { Validity } from './Validity'
import { Reporting, infractionProvenLabels, reportingTypeLabels } from '../../../domain/entities/reporting'
import { setReportingFormVisibility } from '../../../domain/shared_slices/Global'
import { ReportingFormVisibility, reportingStateActions } from '../../../domain/shared_slices/ReportingState'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { SubThemesSelector } from '../../missions/MissionForm/ActionForm/Themes/SubThemesSelector'
import { ThemeSelector } from '../../missions/MissionForm/ActionForm/Themes/ThemeSelector'

export function ReportingForm() {
  const dispatch = useDispatch()
  const {
    global: { reportingFormVisibility }
  } = useAppSelector(state => state)
  const { handleSubmit } = useFormikContext<Partial<Reporting>>()

  const reportTypeOptions = Object.values(reportingTypeLabels)
  const InfractionProvenOptions = Object.values(infractionProvenLabels)

  const [themeField] = useField('theme')
  const [, , needControlHelpers] = useField('needControl')

  const changeNeedControlValue = checked => {
    needControlHelpers.setValue(checked)
  }

  const closeReporting = () => {
    dispatch(reportingStateActions.setSelectedReportingId(undefined))
    dispatch(setReportingFormVisibility(ReportingFormVisibility.NOT_VISIBLE))
  }

  const reduceReporting = () => {
    if (reportingFormVisibility === ReportingFormVisibility.VISIBLE) {
      dispatch(setReportingFormVisibility(ReportingFormVisibility.REDUCE))
    } else {
      dispatch(setReportingFormVisibility(ReportingFormVisibility.VISIBLE))
    }
  }

  return (
    <StyledFormContainer>
      <StyledHeader>
        <div>
          <Icon.Report />
          SIGNALEMENT - 230001
        </div>

        <StyledHeaderButtons>
          <IconButton accent={Accent.TERTIARY} Icon={Icon.Chevron} onClick={reduceReporting} />
          <IconButton accent={Accent.TERTIARY} Icon={Icon.Close} onClick={closeReporting} />
        </StyledHeaderButtons>
      </StyledHeader>
      <StyledForm>
        <Source />
        <Target />
        <Localization />
        <FormikTextarea label="Description du signalement" name="description" />
        <Separator />

        <FormikMultiRadio isInline label="Type de signalement" name="reportType" options={reportTypeOptions} />
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
          <FormikMultiRadio
            isErrorMessageHidden
            isInline
            isLabelHidden
            label="La suspicion d'infraction est"
            name="infractionProven"
            options={InfractionProvenOptions}
          />
        </StyledInfractionProven>
        <StyledToggle>
          <Toggle onChange={changeNeedControlValue} />
          <span>Le signalement nécessite un contrôle</span>
        </StyledToggle>
      </StyledForm>
      <StyledFooter>
        <StyledDeleteButton Icon={Icon.Delete}>Supprimer</StyledDeleteButton>
        <StyledSubmitButton accent={Accent.SECONDARY} Icon={Icon.Save} onClick={() => handleSubmit()}>
          Valider le signalement
        </StyledSubmitButton>
      </StyledFooter>
    </StyledFormContainer>
  )
}
