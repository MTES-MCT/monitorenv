import { Accent, FormikDatePicker, FormikMultiRadio, FormikTextarea, Icon, Label } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import { Toggle } from 'rsuite'

import { infractionProvenLabels, reportTypeLabels } from '../../../domain/entities/report'
import { SubThemesSelector } from '../../missions/MissionForm/ActionForm/Themes/SubThemesSelector'
import { ThemeSelector } from '../../missions/MissionForm/ActionForm/Themes/ThemeSelector'
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
  StyledToggle
} from './style'
import { Target } from './Target'

export function ReportForm() {
  const reportTypeOptions = Object.values(reportTypeLabels)
  const InfractionProvenOptions = Object.values(infractionProvenLabels)

  const [themeField] = useField('theme')
  const [, , needControlHelpers] = useField('needControl')

  const changeNeedControlValue = checked => {
    needControlHelpers.setValue(checked)
  }

  return (
    <StyledFormContainer>
      <StyledHeader>
        <Icon.Report />
        SIGNALEMENT - 230001
      </StyledHeader>
      <StyledForm>
        <Source />
        <Target />
        <Localization />
        <FormikTextarea label="Description du signalement" name="description" />
        <Separator />

        <FormikMultiRadio
          isErrorMessageHidden
          isInline
          label="Type de signalement"
          name="reportType"
          options={reportTypeOptions}
        />
        <StyledThemeContainer>
          <ThemeSelector isLight={false} label="Thématique du signalement" name="theme" />
          <SubThemesSelector
            isLight={false}
            label="Sous-thématique du signalement"
            name="subThemes"
            theme={themeField?.value}
          />
        </StyledThemeContainer>
        <FormikDatePicker label="Validité" name="validity" />
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
        <StyledSubmitButton accent={Accent.SECONDARY} Icon={Icon.Save}>
          Valider le signalement
        </StyledSubmitButton>
      </StyledFooter>
    </StyledFormContainer>
  )
}
