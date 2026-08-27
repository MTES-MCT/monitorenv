import { useGetLayerNamesQuery } from '@api/regulatoryAreasAPI'
import { RegulatoryTagsFilter } from '@components/RegulatoryTagsFilter'
import { RegulatoryThemesFilter } from '@components/RegulatoryThemesFilter'
import { Tooltip } from '@components/Tooltip'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '@features/BackOffice/components/BackofficeMenu/constants'
import { ResetButton } from '@features/commonComponents/ResetButton'
import { RegulatoryArea } from '@features/RegulatoryArea/types'
import {
  Checkbox,
  CustomSearch,
  FormikTextarea,
  FormikTextInput,
  Icon,
  Label,
  Select,
  SingleTag,
  THEME
} from '@mtes-mct/monitor-ui'
import { deleteTagTag } from '@utils/deleteTagTag'
import { deleteThemeTag } from '@utils/deleteThemeTag'
import { parseOptionsToTags } from '@utils/getTagsAsOptions'
import { parseOptionsToThemes } from '@utils/getThemesAsOptions'
import { getTitle } from 'domain/entities/layers/utils'
import { useFormikContext } from 'formik'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import styled from 'styled-components'

import { SubTitle } from './style'
import { formatLayerName } from '../../utils'

import type { TagOption } from 'domain/entities/tags'
import type { ThemeOption } from 'domain/entities/themes'

export function Identification({ onChangeGroup }: { onChangeGroup: (id: number | undefined) => void }) {
  const navigate = useNavigate()
  const { errors, setFieldValue, values } = useFormikContext<RegulatoryArea.RegulatoryAreaFromAPI>()
  const { data: layerNames } = useGetLayerNamesQuery()

  const [isModifyingLayerName, setIsModifyingLayerName] = useState(false)

  const layerNameOptions = useMemo(() => {
    const formattedLayerNames = (layerNames ?? [])
      ?.filter(regulatoryArea => regulatoryArea.group.layerName && regulatoryArea.group.layerName.trim() !== '')
      .map(regulatoryArea => {
        const formattedLayerName = formatLayerName(regulatoryArea.group.layerName, regulatoryArea.group.location)

        return {
          label: getTitle(formattedLayerName),
          value: {
            groupId: regulatoryArea.group.id,
            layerName: formattedLayerName
          }
        }
      })

    return formattedLayerNames.sort((a, b) => a.label.localeCompare(b.label))
  }, [layerNames])

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

  const createNewGroup = () => {
    navigate(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.REGULATORY_AREA_GROUP]}/new`)
  }

  const layerNameCustomSearch = new CustomSearch(layerNameOptions ?? [], ['label'], {
    isStrict: true
  })

  const changeGroup = () => {
    setIsModifyingLayerName(true)
  }

  const modifyGroup = () => {
    const groupId = layerNames?.find(
      group => group.group.layerName === values.layerName && group.group.location === values.location
    )?.group.id
    navigate(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.REGULATORY_AREA_GROUP]}/${groupId}`)
  }

  const onChangeLayerName = (nextValue?: { groupId: number | undefined; layerName: string | undefined }) => {
    const nameAndLocation = nextValue?.layerName?.split(' - ')
    setFieldValue('layerName', nameAndLocation?.[0])
    setFieldValue('location', nameAndLocation?.[1])
    setIsModifyingLayerName(false)
    onChangeGroup(nextValue?.groupId)
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
              <div>
                <Label>Groupe de réglementation</Label>
                <span>{getTitle(formatLayerName(values.layerName, values.location))}</span>
              </div>
              <InlineButtons>
                <ResetButton label="Changer la zone de groupe" onClick={changeGroup} />
                <ResetButton label="Modifier info. du groupe" onClick={modifyGroup} />
              </InlineButtons>
            </>
          ) : (
            <>
              <Select
                key={layerNameOptions.length}
                customSearch={layerNameCustomSearch}
                data-cy="group-select"
                isErrorMessageHidden
                isRequired
                label="Groupe de réglementation"
                name="layerName"
                onChange={onChangeLayerName}
                options={layerNameOptions}
                optionValueKey="layerName"
                renderExtraFooter={() => (
                  <ExtraFooterContainer onClick={createNewGroup} type="button">
                    <Icon.Plus />
                    Ajouter un nouveau groupe
                  </ExtraFooterContainer>
                )}
                style={{ flex: 1 }}
                value={
                  layerNameOptions.find(
                    layer => layer.value.layerName === formatLayerName(values.layerName, values.location)
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
        <div>
          <FormikTextarea isErrorMessageHidden label="Résumé" name="resume" rows={4} />
          <InformationMessage>
            Le résumé concerne tout ce qui n’est pas une période. Si la réglementation ne concerne que des périodes,
            alors le résumé n’est pas nécessaire.
          </InformationMessage>
        </div>
        <PeriodContainer>
          <Period>
            <Label>
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
            <Label>
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

const InlineButtons = styled.div`
  display: flex;
  gap: 16px;
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
