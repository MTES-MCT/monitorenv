import { useGetLayerNamesQuery, useGetRegulatoryAreasToCreateQuery } from '@api/regulatoryAreasAPI'
import { RegulatoryTagsFilter } from '@components/RegulatoryTagsFilter'
import { RegulatoryThemesFilter } from '@components/RegulatoryThemesFilter'
import { Tooltip } from '@components/Tooltip'
import { ValidateButton } from '@features/commonComponents/ValidateButton'
import { RegulatoryArea } from '@features/RegulatoryArea/types'
import {
  Accent,
  Button,
  Checkbox,
  FormikSelect,
  FormikTextarea,
  FormikTextInput,
  getOptionsFromLabelledEnum,
  Icon,
  Label,
  Select,
  TextInput
} from '@mtes-mct/monitor-ui'
import { getTitle } from 'domain/entities/layers/utils'
import { SeaFrontLabels } from 'domain/entities/seaFrontType'
import { useFormikContext } from 'formik'
import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { SubTitle } from './style'

import type { TagOption } from 'domain/entities/tags'
import type { ThemeOption } from 'domain/entities/themes'
import type { GeoJSON } from 'domain/types/GeoJSON'

export function Identification({ isEditing }: { isEditing: boolean }) {
  const { setFieldValue, values } = useFormikContext<RegulatoryArea.RegulatoryAreaFromAPI>()

  const { data: layerNames } = useGetLayerNamesQuery()
  const { data: regulatoryAreasToCreate } = useGetRegulatoryAreasToCreateQuery()

  const [isCreatingNewLayerName, setIsCreatingNewLayerName] = useState(false)
  const [newLayerNameType, setNewLayerNameType] = useState<string | undefined>(undefined)
  const [newLayerNameLocation, setNewLayerNameLocation] = useState<string | undefined>(undefined)

  const layerNamesOptions = useMemo(() => {
    const layersNamesFromApi = layerNames
      ? layerNames.layerNames
          .filter(layerName => layerName && layerName.trim() !== '')
          .map(layerName => ({
            label: getTitle(layerName),
            value: layerName
          }))
      : []

    if (values.layerName && !layersNamesFromApi?.some(layer => layer.value === values.layerName)) {
      layersNamesFromApi?.push({ label: getTitle(values.layerName), value: values.layerName })
    }

    return layersNamesFromApi.sort((a, b) => a.label.localeCompare(b.label))
  }, [layerNames, values.layerName])

  const geomOptions = useMemo(
    () =>
      regulatoryAreasToCreate?.map(regulatoryArea => ({
        label: String(regulatoryArea.id),
        value: {
          geom: regulatoryArea.geom,
          id: regulatoryArea.id,
          refReg: regulatoryArea.refReg
        }
      })) ?? [],
    [regulatoryAreasToCreate]
  )

  const seaFrontsAsOptions = Object.values(SeaFrontLabels)
  const regulatoryTypeOptions = getOptionsFromLabelledEnum(RegulatoryArea.RegulatoryAreaTypeLabel).sort((a, b) =>
    a.label.localeCompare(b.label)
  )

  const setGeometryAndRefReg = (nextGeom: { geom: GeoJSON.MultiPolygon; id: number; refReg: string } | undefined) => {
    setFieldValue('geom', nextGeom?.geom)
    setFieldValue('id', nextGeom?.id)
    setFieldValue('refReg', nextGeom?.refReg)
  }

  const setThemes = (nextThemes: ThemeOption[] | undefined = []) => {
    setFieldValue('themes', nextThemes)
  }

  const setTags = (nextTags: TagOption[] | undefined = []) => {
    setFieldValue('tags', nextTags)
  }

  const setControlPlan = (controlPlan: RegulatoryArea.RegulatoryAreaControlPlan, isChecked: boolean) => {
    const currentControlPlans = values?.plan ? values.plan.split(',') : []
    let updatedControlPlans: string[] = []
    if (isChecked) {
      updatedControlPlans = [...currentControlPlans, controlPlan]
    } else {
      updatedControlPlans = currentControlPlans.filter(plan => plan !== controlPlan)
    }
    setFieldValue('plan', updatedControlPlans.join(','))
  }

  const createNewLayerName = () => {
    setNewLayerNameType(undefined)
    setNewLayerNameLocation(undefined)
    setIsCreatingNewLayerName(true)
  }

  const validateLayerName = () => {
    if (newLayerNameType && newLayerNameLocation) {
      setFieldValue('layerName', `${newLayerNameType} - ${newLayerNameLocation}`)
      setIsCreatingNewLayerName(false)
    }
  }

  const renderMenuItem = (label, item) => (
    <GeomContainer title={label}>
      <p>{label}</p>
      <GeomRefReg>{item.optionValue.refReg}</GeomRefReg>
    </GeomContainer>
  )

  return (
    <>
      <SubTitle>IDENTIFICATION DE LA ZONE RÉGLEMENTAIRE</SubTitle>
      <IdentificationContainer>
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
        <FieldWithTooltip>
          <FormikSelect
            disabled={isCreatingNewLayerName}
            isErrorMessageHidden
            isRequired
            label="Titre du groupe de réglementation"
            name="layerName"
            options={layerNamesOptions}
            renderExtraFooter={() => (
              <ExtraFooterContainer onClick={createNewLayerName} type="button">
                <Icon.Plus />
                Ajouter un nouveau groupe
              </ExtraFooterContainer>
            )}
            style={{ flex: 1 }}
          />
          <Tooltip>Le nom du groupe doit permettre de connaître le lieu et le sujet de la réglementation.</Tooltip>
        </FieldWithTooltip>
        {isCreatingNewLayerName && (
          <CreateLayerNameContainer>
            <TextInput
              label="Type"
              name="newLayerNameType"
              onChange={nextValue => setNewLayerNameType(nextValue)}
              value={newLayerNameType}
            />
            <TextInput
              label="Lieu"
              name="newLayerNameLocation"
              onChange={nextValue => setNewLayerNameLocation(nextValue)}
              value={newLayerNameLocation}
            />
            <Button accent={Accent.SECONDARY} onClick={() => setIsCreatingNewLayerName(false)}>
              Annuler
            </Button>
            <ValidateButton onClick={validateLayerName}>Valider</ValidateButton>
          </CreateLayerNameContainer>
        )}
        <InlineFieldsContainer>
          <Select
            disabled={isEditing}
            isRequired
            label="Géométrie"
            name="geom"
            onChange={setGeometryAndRefReg}
            options={geomOptions}
            optionValueKey="id"
            renderMenuItem={renderMenuItem}
            style={{ width: '30%' }}
            value={
              isEditing && values.geom && values.id && values.refReg
                ? {
                    geom: values.geom,
                    id: values.id,
                    refReg: values.refReg
                  }
                : geomOptions.find(option => option.value.id === values.id)?.value
            }
          />
          <FormikSelect isRequired label="Façade" name="facade" options={seaFrontsAsOptions} style={{ width: '30%' }} />
          <FormikSelect
            isErrorMessageHidden
            isRequired
            label="Type d’acte administratif"
            name="type"
            options={regulatoryTypeOptions}
            style={{ width: '40%' }}
          />
        </InlineFieldsContainer>
        <div>
          <InlineFieldsContainer>
            <RegulatoryThemesFilter
              isLabelHidden={false}
              isRequired
              isTransparent={false}
              label="Thématiques et sous-thématiques"
              onChange={setThemes}
              style={{ width: '50%' }}
              value={values?.themes ?? []}
            />
            <RegulatoryTagsFilter
              isLabelHidden={false}
              isRequired
              isTransparent={false}
              label="Tags et sous-tags"
              onChange={setTags}
              style={{ width: '50%' }}
              value={values?.tags ?? []}
            />
          </InlineFieldsContainer>
          <InformationMessage>
            Sélectionner au moins une thématique/sous-thématique ou un tag/sous-tag
          </InformationMessage>
        </div>
        <div>
          <FormikTextarea label="Résumé" name="resume" rows={4} />
          <InformationMessage>
            Le résumé concerne tout ce qui n’est pas une période. Les périodes sont à renseigner plus bas.
          </InformationMessage>
        </div>
        <div>
          <Label $isRequired>Plan de contrôle</Label>
          <ControlPlanContainer>
            <Checkbox
              checked={values?.plan?.includes(RegulatoryArea.RegulatoryAreaControlPlan.PIRC)}
              label={RegulatoryArea.RegulatoryAreaControlPlan.PIRC}
              name="PIRCType"
              onChange={isChecked => setControlPlan(RegulatoryArea.RegulatoryAreaControlPlan.PIRC, isChecked ?? false)}
            />
            <Checkbox
              checked={values?.plan?.includes(RegulatoryArea.RegulatoryAreaControlPlan.PSCEM)}
              label={RegulatoryArea.RegulatoryAreaControlPlan.PSCEM}
              name="PSCEMType"
              onChange={isChecked => setControlPlan(RegulatoryArea.RegulatoryAreaControlPlan.PSCEM, isChecked ?? false)}
            />
          </ControlPlanContainer>
        </div>
      </IdentificationContainer>
    </>
  )
}

const IdentificationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const InlineFieldsContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: space-between;
`
const FieldWithTooltip = styled.div`
  align-items: end;
  display: flex;
  flex: 1;
  gap: 8px;
`
const GeomContainer = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const GeomRefReg = styled.p`
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
