import { useGetLayerNamesQuery } from '@api/regulatoryAreasAPI'
import { RegulatoryTagsFilter } from '@components/RegulatoryTagsFilter'
import { RegulatoryThemesFilter } from '@components/RegulatoryThemesFilter'
import { Tooltip } from '@components/Tooltip'
import { ResetButton } from '@features/commonComponents/ResetButton'
import { ValidateButton } from '@features/commonComponents/ValidateButton'
import { RegulatoryArea } from '@features/RegulatoryArea/types'
import {
  Accent,
  Button,
  Checkbox,
  CustomSearch,
  FormikTextarea,
  FormikTextInput,
  Icon,
  Label,
  Select,
  SingleTag,
  TextInput,
  THEME
} from '@mtes-mct/monitor-ui'
import { deleteTagTag } from '@utils/deleteTagTag'
import { deleteThemeTag } from '@utils/deleteThemeTag'
import { parseOptionsToTags } from '@utils/getTagsAsOptions'
import { parseOptionsToThemes } from '@utils/getThemesAsOptions'
import { getTitle } from 'domain/entities/layers/utils'
import { setFitToExtent } from 'domain/shared_slices/Map'
import { useFormikContext } from 'formik'
import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { SubTitle } from './style'
import { useGetSeaFrontsQuery } from '../../../../api/seaFrontsAPI'

import type { TagOption } from 'domain/entities/tags'
import type { ThemeOption } from 'domain/entities/themes'

export function Identification() {
  const { errors, setFieldValue, values } = useFormikContext<RegulatoryArea.RegulatoryAreaFromAPI>()
  const { data: layerNames } = useGetLayerNamesQuery()

  const [isCreatingNewLayerName, setIsCreatingNewLayerName] = useState(false)
  const [newLayerNameType, setNewLayerNameType] = useState<string | undefined>(undefined)
  const [newLayerNameLocation, setNewLayerNameLocation] = useState<string | undefined>(undefined)
  const [isNewLayerNameValid, setIsNewLayerNameValid] = useState(true)
  const [isModifyingLayerName, setIsModifyingLayerName] = useState(false)

  function formatLayerName(layerName: string, place?: string) {
    if (!!place?.trim() && !layerName?.includes(place ?? '')) {
      return `${layerName} - ${place}`
    }

    return layerName
  }

  const layerNamesOptions = useMemo(() => {
    const layersNamesFromApi = Object.keys(layerNames?.layerNames || {})
    const formattedLayerNames = layersNamesFromApi
      .filter(layerName => layerName && layerName.trim() !== '')
      .map(layerNameWithPlace => {
        const [name, location] = layerNameWithPlace.split(' - ')

        return {
          label: getTitle(layerNameWithPlace),
          value: {
            layerName: name,
            location
          }
        }
      })

    if (
      values.layerName &&
      !formattedLayerNames?.some(layer => layer.value.layerName && values.layerName?.includes(layer.value.layerName))
    ) {
      const formattedLayerName = formatLayerName(values.layerName, values.location)
      formattedLayerNames.push({
        label: formattedLayerName,
        value: {
          layerName: values.layerName,
          location: values?.location
        }
      })
    }

    return formattedLayerNames.sort((a, b) => a.label.localeCompare(b.label))
  }, [layerNames?.layerNames, values.layerName, values.location])

  const setThemes = (nextThemes: ThemeOption[] | undefined = []) => {
    setFieldValue('themes', parseOptionsToThemes(nextThemes))
  }

  const setTags = (nextTags: TagOption[] | undefined = []) => {
    setFieldValue('tags', parseOptionsToTags(nextTags))
  }

  const setControlPlan = (controlPlan: RegulatoryArea.RegulatoryAreaControlPlan, isChecked: boolean) => {
    const currentControlPlans = values?.plan && values.plan.length > 0 ? values.plan.split(',') : []
    let updatedControlPlans: string[] = []
    if (isChecked) {
      updatedControlPlans = [...currentControlPlans, controlPlan]
    } else {
      updatedControlPlans = currentControlPlans.filter(plan => plan !== controlPlan)
    }
    const updatedControlPlansString = updatedControlPlans.length > 0 ? updatedControlPlans.join(',') : undefined
    setFieldValue('plan', updatedControlPlansString)
  }

  const createNewLayerName = () => {
    setFieldValue('layerName', undefined)
    setFieldValue('location', undefined)
    setNewLayerNameType(undefined)
    setNewLayerNameLocation(undefined)
    setIsCreatingNewLayerName(true)
  }

  const cancelNewLayerName = () => {
    setIsCreatingNewLayerName(false)
  }

  const validateLayerName = () => {
    if (!newLayerNameType || !newLayerNameLocation) {
      setIsNewLayerNameValid(false)

      return
    }
    setFieldValue('layerName', newLayerNameType)
    setFieldValue('location', newLayerNameLocation)
    setIsCreatingNewLayerName(false)
    setIsNewLayerNameValid(true)
  }

  const layerNameCustomSearch = new CustomSearch(layerNamesOptions ?? [], ['label'], {
    isStrict: true
  })

  const onModifyGroup = () => {
    setIsModifyingLayerName(true)
  }

  const onChangeLayerName = (nextValue?: { layerName: string | undefined; location: string | undefined }) => {
    setFieldValue('layerName', nextValue?.layerName)
    setFieldValue('location', nextValue?.location)
  }

  const allThemesAndSubthemes = useMemo(
    () => values?.themes?.flatMap(theme => [...theme.subThemes, theme]),
    [values?.themes]
  )
  const allTagsAndSubtags = useMemo(() => values?.tags?.flatMap(tag => [...tag.subTags, tag]), [values?.tags])

  return (
    <>
      <SubTitle>IDENTIFICATION DE LA ZONE RÉGLEMENTAIRE</SubTitle>
      <FieldsWrapper>
        <FieldWithTooltip>
          {values.layerName && !isModifyingLayerName ? (
            <>
              <StyledTextInput
                label="Groupe de réglementation"
                name="layerName"
                readOnly
                style={{ flex: 1 }}
                value={getTitle(formatLayerName(values.layerName, values.location))}
              />
              <ResetButton label="Changer la zone de groupe" onClick={onModifyGroup} />
            </>
          ) : (
            <>
              <Select
                key={layerNamesOptions.length}
                customSearch={layerNameCustomSearch}
                data-cy="group-select"
                disabled={isCreatingNewLayerName}
                isErrorMessageHidden
                isRequired
                label="Groupe de réglementation"
                name="layerName"
                onChange={onChangeLayerName}
                options={layerNamesOptions}
                optionValueKey="layerName"
                renderExtraFooter={() => (
                  <ExtraFooterContainer onClick={createNewLayerName} type="button">
                    <Icon.Plus />
                    Ajouter un nouveau groupe
                  </ExtraFooterContainer>
                )}
                style={{ flex: 1 }}
                value={
                  layerNamesOptions.find(
                    layer =>
                      layer.value.layerName &&
                      values.layerName &&
                      formatLayerName(values.layerName, values.location).includes(layer.value.layerName) &&
                      layer.value.location === values.location
                  )?.value
                }
              />
              <Tooltip>Le nom du groupe doit permettre de connaître le lieu et le sujet de la réglementation.</Tooltip>
            </>
          )}
        </FieldWithTooltip>
        <FieldWithTooltip>
          <FormikTextInput
            isErrorMessageHidden
            isRequired
            label="Titre de la zone réglementaire"
            name="polyName"
            style={{ flex: 1 }}
          />
          <Tooltip>
            Le titre de la zone doit être le plus explicite possible que le rendre intelligible à tous, même à des
            utilisateurs non experts sur différents sujets (ex : biodiversité), tels que les utilisateurs de MonitorExt.
          </Tooltip>
        </FieldWithTooltip>

        {isCreatingNewLayerName && (
          <CreateLayerNameContainer>
            <TextInput
              error={!isNewLayerNameValid && !newLayerNameType ? 'Champ requis' : undefined}
              isErrorMessageHidden
              isRequired
              label="Type"
              name="newLayerNameType"
              onChange={nextValue => setNewLayerNameType(nextValue)}
              value={newLayerNameType}
            />
            <TextInput
              error={!isNewLayerNameValid && !newLayerNameLocation ? 'Champ requis' : undefined}
              isErrorMessageHidden
              isRequired
              label="Lieu"
              name="newLayerNameLocation"
              onChange={nextValue => setNewLayerNameLocation(nextValue)}
              value={newLayerNameLocation}
            />
            <Button accent={Accent.SECONDARY} onClick={cancelNewLayerName}>
              Annuler
            </Button>
            <ValidateButton onClick={validateLayerName}>Valider</ValidateButton>
          </CreateLayerNameContainer>
        )}
        <div>
          <InlineFields>
            <Fields>
              <RegulatoryThemesFilter
                error={errors.themes}
                isErrorMessageHidden
                isLabelHidden={false}
                isRequired
                isTransparent={false}
                label="Thématiques et sous-thématiques"
                onChange={setThemes}
                value={values?.themes ?? []}
              />
              <SmallInlineFields>
                {allThemesAndSubthemes?.map(theme => (
                  <SingleTag
                    key={theme.id}
                    onDelete={() => {
                      const updatedTags = deleteThemeTag(values?.themes ?? [], theme)
                      setFieldValue('themes', updatedTags)
                    }}
                  >
                    {theme.name}
                  </SingleTag>
                ))}
              </SmallInlineFields>
            </Fields>
            <Fields>
              <RegulatoryTagsFilter
                error={errors.tags}
                isErrorMessageHidden
                isLabelHidden={false}
                isRequired
                isTransparent={false}
                label="Tags et sous-tags"
                onChange={setTags}
                value={values?.tags ?? []}
              />
              <SmallInlineFields>
                {allTagsAndSubtags?.map(tag => (
                  <SingleTag
                    key={tag.id}
                    onDelete={() => {
                      const updatedTags = deleteTagTag(values?.tags ?? [], tag)
                      setFieldValue('tags', updatedTags)
                    }}
                  >
                    {tag.name}
                  </SingleTag>
                ))}
              </SmallInlineFields>
            </Fields>
          </InlineFields>
          <InformationMessage>
            Sélectionner au moins une thématique/sous-thématique ou un tag/sous-tag
          </InformationMessage>
        </div>
        <div>
          <FormikTextarea isErrorMessageHidden isRequired label="Résumé" name="resume" rows={4} />
          <InformationMessage>
            Le résumé concerne tout ce qui n’est pas une période. Si la réglementation ne concerne que des périodes,
            alors le résumé n’est pas nécessaire.
          </InformationMessage>
        </div>
        <PeriodContainer>
          <Period>
            <Label $isRequired>
              <StyledIcon color={THEME.color.mediumSeaGreen} size={10} />
              Période d&apos;autorisation
            </Label>
            <FormikTextarea
              isErrorMessageHidden
              isLabelHidden
              isRequired
              label="Période d'autorisation"
              name="authorizationPeriods"
              placeholder="Détail de la période d’autorisation"
            />
          </Period>
          <Period>
            <Label $isRequired>
              <StyledIcon color={THEME.color.maximumRed} size={10} />
              Période d&apos;interdiction
            </Label>
            <FormikTextarea
              isErrorMessageHidden
              isLabelHidden
              isRequired
              label="Période d'interdiction"
              name="prohibitionPeriods"
              placeholder="Détail de la période d’interdiction"
            />
          </Period>
        </PeriodContainer>
        <div>
          <Label $isRequired>Plan de contrôle</Label>
          <ControlPlanContainer>
            <Checkbox
              checked={values?.plan?.includes(RegulatoryArea.RegulatoryAreaControlPlan.PIRC)}
              error={errors.plan}
              isErrorMessageHidden
              label={RegulatoryArea.RegulatoryAreaControlPlan.PIRC}
              name="PIRCType"
              onChange={isChecked => setControlPlan(RegulatoryArea.RegulatoryAreaControlPlan.PIRC, isChecked ?? false)}
            />
            <Checkbox
              checked={values?.plan?.includes(RegulatoryArea.RegulatoryAreaControlPlan.PSCEM)}
              error={errors.plan}
              isErrorMessageHidden
              label={RegulatoryArea.RegulatoryAreaControlPlan.PSCEM}
              name="PSCEMType"
              onChange={isChecked => setControlPlan(RegulatoryArea.RegulatoryAreaControlPlan.PSCEM, isChecked ?? false)}
            />
          </ControlPlanContainer>
        </div>
      </FieldsWrapper>
    </>
  )
}

const FieldsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
`

const InlineFields = styled(Fields)`
  flex-direction: row;
  justify-content: space-between;
`

const SmallInlineFields = styled(InlineFields)`
  gap: 4px;
  flex-wrap: wrap;
  flex: 0;
  justify-content: start;
`

const FieldWithTooltip = styled(InlineFields)`
  align-items: end;
`

const StyledTextInput = styled(TextInput)`
  input {
    padding: 0;
    border: none !important;

    &:hover,
    &:focus,
    &:active {
      border: none !important;
    }
  }
`

const ExtraFooterContainer = styled.button`
  align-items: center;
  background-color: ${p => p.theme.color.white};
  border-top: 1px solid ${p => p.theme.color.lightGray};
  display: flex;
  gap: 8px;
  padding: 8px;
`

const InformationMessage = styled.span`
  color: ${p => p.theme.color.slateGray};
  font-size: 13px;
  font-style: italic;
`

const ControlPlanContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 24px;
`

const CreateLayerNameContainer = styled.div`
  align-items: end;
  display: flex;
  gap: 8px;

  > .Field-TextInput {
    flex: 1;
  }
`

const PeriodContainer = styled.div`
  display: flex;
  gap: 16px;
`

const Period = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`

const StyledIcon = styled(Icon.CircleFilled)`
  margin-right: 8px;
`
