import { FormikDatePicker, FormikMultiRadio, FormikSelect, FormikTextarea, Icon, Label } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import { useMemo } from 'react'
import { Toggle } from 'rsuite'
import styled from 'styled-components'

import { useGetSemaphoresQuery } from '../../../api/semaphoresAPI'
import { InteractionListener } from '../../../domain/entities/map/constants'
import { infractionProvenLabels, reportSourceLabels, reportTypeLabels } from '../../../domain/entities/report'
import { targetTypeLabels } from '../../../domain/entities/targetType'
import { vehicleTypeLabels } from '../../../domain/entities/vehicleType'
import { SubThemesSelector } from '../../missions/MissionForm/ActionForm/Themes/SubThemesSelector'
import { ThemeSelector } from '../../missions/MissionForm/ActionForm/Themes/ThemeSelector'
import { MultiPointPicker } from '../../missions/MultiPointPicker'
import { MultiZonePicker } from '../../missions/MultiZonePicker'

export function ReportForm() {
  const sourceOptions = Object.values(reportSourceLabels)
  const targetTypeOptions = Object.values(targetTypeLabels)
  const vehicleTypeOptions = Object.values(vehicleTypeLabels)
  const reportTypeOptions = Object.values(reportTypeLabels)
  const InfractionProvenOptions = Object.values(infractionProvenLabels)
  const { data: semaphores } = useGetSemaphoresQuery()

  const [themeField] = useField('theme')
  const [, , needControlHelpers] = useField('needControl')

  const semaphoresOptions = useMemo(
    () =>
      semaphores
        ? semaphores.map(semaphore => ({
            label: semaphore.unit || semaphore.name,
            value: semaphore.id
          }))
        : [],
    [semaphores]
  )

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
        <FormikMultiRadio isErrorMessageHidden isInline label="Source" name="source" options={sourceOptions} />
        <FormikSelect label="Nom du Sémaphore" name="semaphoreName" options={semaphoresOptions} />
        <StyledInlineContainer>
          <FormikSelect label="Type de cible" name="reportTargetType" options={targetTypeOptions} />
          <FormikSelect label="Type de véhicule" name="vehicleType" options={vehicleTypeOptions} />
        </StyledInlineContainer>
        <FormikTextarea label="Détail de la cible du signalement" name="targetDetails" />
        <div>
          <Label>Localisation</Label>
          <StyledLocalizationContainer>
            <MultiZonePicker
              addButtonLabel="Ajouter une zone"
              interactionListener={InteractionListener.MISSION_ZONE}
              name="geom"
            />
            <MultiPointPicker addButtonLabel="Ajouter un point" name="geom" />
          </StyledLocalizationContainer>
        </div>
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
          <ThemeSelector isLight={false} label="Thématique du signalement" name="theme.theme" />
          <SubThemesSelector
            isLight={false}
            label="Sous-thématique du signalement"
            name="theme.subThemes"
            theme={themeField?.value.theme}
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
    </StyledFormContainer>
  )
}

const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  > * {
    text-align: start;
  }
`
const StyledForm = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-contant: start;
  background-color: ${p => p.theme.color.charcoal};
  height: 52px;
  color: ${p => p.theme.color.white};
  font-size: 16px;
  font-weight: 500;
  padding: 16px 24px;
  gap: 8px;
`
const Separator = styled.div`
  margin-top: 8px;
  border: 1px solid ${p => p.theme.color.slateGray};
`
const StyledInlineContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 32px;
  > div {
    flex: 1;
  }
`
const StyledLocalizationContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 8px;
`
const StyledThemeContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
`

const StyledInfractionProven = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 4px;
`
const StyledToggle = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 8px;
`
