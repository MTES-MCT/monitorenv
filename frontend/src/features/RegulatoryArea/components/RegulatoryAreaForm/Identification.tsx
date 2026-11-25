import { useGetLayerNamesQuery } from '@api/regulatoryAreasAPI'
import { CancelEditDialog } from '@components/Dialog/CancelEditDialog'
import { RegulatoryTagsFilter } from '@components/RegulatoryTagsFilter'
import { RegulatoryThemesFilter } from '@components/RegulatoryThemesFilter'
import { Bold } from '@components/style'
import { Tooltip } from '@components/Tooltip'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '@features/BackOffice/components/BackofficeMenu/constants'
import { ResetButton } from '@features/commonComponents/ResetButton'
import { SubTitle } from '@features/RegulatoryArea/style'
import { RegulatoryArea } from '@features/RegulatoryArea/types'
import {
  Checkbox,
  CustomSearch,
  FormikTextarea,
  FormikTextInput,
  Icon,
  Label,
  LinkButton,
  Select,
  THEME
} from '@mtes-mct/monitor-ui'
import { parseOptionsToTags } from '@utils/getTagsAsOptions'
import { parseOptionsToThemes } from '@utils/getThemesAsOptions'
import { getTitle } from 'domain/entities/layers/utils'
import { useFormikContext } from 'formik'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import styled, { css } from 'styled-components'

import { FieldsListFromGroup } from './FieldsListFromGroup'
import { formatLayerName } from '../../utils'

import type { TagOption } from 'domain/entities/tags'
import type { ThemeOption } from 'domain/entities/themes'

export function Identification({
  isEditing,
  onSelectGroup
}: {
  isEditing: boolean
  onSelectGroup: (id: number | undefined) => void
}) {
  const navigate = useNavigate()
  const { dirty, errors, setFieldValue, values } = useFormikContext<RegulatoryArea.RegulatoryAreaFromAPI>()
  const { data: layerNames } = useGetLayerNamesQuery()

  const [isModifyingLayerName, setIsModifyingLayerName] = useState(false)
  const [isCancelEditDialogOpen, setIsCancelEditDialogOpen] = useState(false)

  const layerNameOptions = useMemo(() => {
    const formattedLayerNames = (layerNames ?? [])
      ?.filter(regulatoryArea => regulatoryArea.group.layerName && regulatoryArea.group.layerName.trim() !== '')
      .map(regulatoryArea => {
        const formattedLayerName = formatLayerName(regulatoryArea.group.layerName, regulatoryArea.group.location)

        return {
          label: getTitle(formattedLayerName),
          value: regulatoryArea.group.id
        }
      })

    return formattedLayerNames.sort((a, b) => a.label.localeCompare(b.label))
  }, [layerNames])

  const selectedGroupId = useMemo(
    () =>
      layerNames?.find(
        groupWithTotal =>
          groupWithTotal.group.layerName === values.layerName && groupWithTotal.group.location === values.location
      )?.group.id,
    [layerNames, values.layerName, values.location]
  )

  useEffect(() => {
    onSelectGroup(selectedGroupId)
  }, [selectedGroupId, onSelectGroup])

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

  const goToGroup = () => {
    const groupId = layerNames?.find(
      group => group.group.layerName === values.layerName && group.group.location === values.location
    )?.group.id
    navigate(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.REGULATORY_AREA_GROUP]}/${groupId}`)
  }

  const modifyGroup = () => {
    if (dirty) {
      setIsCancelEditDialogOpen(true)
    } else {
      goToGroup()
    }
  }

  const onChangeLayerName = (nextValue?: number | undefined) => {
    const groupFound = layerNames?.find(groupWithTotal => groupWithTotal.group.id === nextValue)?.group
    setFieldValue('layerName', groupFound?.layerName)
    setFieldValue('location', groupFound?.location)
    setFieldValue('inheritedFields', groupFound?.propagatedFields)

    const propagatedFields = groupFound?.propagatedFields ?? []
    const shouldInherit = (field: (typeof propagatedFields)[number]) => !isEditing && propagatedFields.includes(field)

    if (shouldInherit('AUTHORIZATION_PERIODS')) {
      setFieldValue('authorizationPeriods', groupFound?.authorizationPeriods)
    }
    if (shouldInherit('PROHIBITION_PERIODS')) {
      setFieldValue('prohibitionPeriods', groupFound?.prohibitionPeriods)
    }
    if (shouldInherit('RESUME')) {
      setFieldValue('resume', groupFound?.resume)
    }
    if (shouldInherit('TAGS')) {
      setFieldValue('tags', groupFound?.tags)
    }
    if (shouldInherit('THEMES')) {
      setFieldValue('themes', groupFound?.themes)
    }
    setIsModifyingLayerName(false)
  }

  return (
    <>
      {isCancelEditDialogOpen && (
        <CancelEditDialog
          onCancel={() => setIsCancelEditDialogOpen(false)}
          onConfirm={goToGroup}
          text={
            <>
              <p>Vous êtes en train d&apos;abandonner</p>
              <Bold>{`${isEditing ? "l'édition" : 'la création'} de la zone réglementaire.`}</Bold>
            </>
          }
        />
      )}
      <SubTitle>IDENTIFICATION DE LA ZONE RÉGLEMENTAIRE</SubTitle>
      {values.inheritedFields && values.inheritedFields?.length > 0 && (
        <FieldsListFromGroup inheritedFields={values.inheritedFields} />
      )}
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
                <LinkButton Icon={Icon.EditUnbordered} onClick={modifyGroup}>
                  Modifier info. du groupe
                </LinkButton>
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
                renderExtraFooter={() => (
                  <ExtraFooterContainer onClick={createNewGroup} type="button">
                    <Icon.Plus />
                    Ajouter un nouveau groupe
                  </ExtraFooterContainer>
                )}
                style={{ flex: 1 }}
                value={selectedGroupId}
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
            <StyledRegulatoryThemesFilter
              $isReadOnly={values.inheritedFields?.includes('THEMES')}
              className="readOnlyThemes"
              error={errors.themes}
              isErrorMessageHidden
              isLabelHidden={false}
              isRequired
              isTransparent={false}
              label="Thématiques et sous-thématiques"
              onChange={setThemes}
              readOnly={values.inheritedFields?.includes('THEMES')}
              shouldShowLabels
              value={values?.themes ?? []}
            />
          </Fields>
          <Fields>
            <StyledRegulatoryTagsFilter
              $isReadOnly={values.inheritedFields?.includes('TAGS')}
              className="readOnlyTags"
              error={errors.tags}
              isErrorMessageHidden
              isLabelHidden={false}
              isTransparent={false}
              label="Tags et sous-tags"
              onChange={setTags}
              readOnly={values.inheritedFields?.includes('TAGS')}
              shouldShowLabels
              value={values?.tags ?? []}
            />
          </Fields>
        </InlineFields>
        <div>
          <StyledFormikTextarea
            $isReadOnly={values.inheritedFields?.includes('RESUME')}
            isErrorMessageHidden
            label="Résumé"
            name="resume"
            readOnly={values.inheritedFields?.includes('RESUME')}
            rows={4}
          />
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
            <StyledFormikTextarea
              $isReadOnly={values.inheritedFields?.includes('AUTHORIZATION_PERIODS')}
              isErrorMessageHidden
              isLabelHidden
              isRequired
              label="Période d'autorisation"
              name="authorizationPeriods"
              placeholder="Détail de la période d’autorisation"
              readOnly={values.inheritedFields?.includes('AUTHORIZATION_PERIODS')}
            />
          </Period>
          <Period>
            <Label>
              <StyledIcon color={THEME.color.maximumRed} size={10} />
              Période d&apos;interdiction
            </Label>
            <StyledFormikTextarea
              $isReadOnly={values.inheritedFields?.includes('PROHIBITION_PERIODS')}
              isErrorMessageHidden
              isLabelHidden
              isRequired
              label="Période d'interdiction"
              name="prohibitionPeriods"
              placeholder="Détail de la période d’interdiction"
              readOnly={values.inheritedFields?.includes('PROHIBITION_PERIODS')}
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
const StyledFormikTextarea = styled(FormikTextarea)<{ $isReadOnly?: boolean }>`
  ${({ $isReadOnly }) =>
    $isReadOnly &&
    css`
      > textarea {
        background-color: ${p => p.theme.color.cultured};
        border: none;
        &:hover,
        &:active,
        &:focus {
          background-color: ${p => p.theme.color.cultured};
          border: none;
        }
      }
    `}
`

const StyledRegulatoryTagsFilter = styled(RegulatoryTagsFilter)<{ $isReadOnly?: boolean }>`
  ${({ $isReadOnly }) =>
    $isReadOnly &&
    css`
      > div {
        background-color: ${p => p.theme.color.cultured};
      }
    `}
`

const StyledRegulatoryThemesFilter = styled(RegulatoryThemesFilter)<{ $isReadOnly?: boolean }>`
  ${({ $isReadOnly }) =>
    $isReadOnly &&
    css`
      > div {
        background-color: ${p => p.theme.color.cultured};
      }
    `}
`
