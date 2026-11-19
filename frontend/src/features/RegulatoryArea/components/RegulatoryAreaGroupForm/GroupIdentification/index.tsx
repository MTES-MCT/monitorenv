import { RegulatoryTagsFilter } from '@components/RegulatoryTagsFilter'
import { RegulatoryThemesFilter } from '@components/RegulatoryThemesFilter'
import { Bold } from '@components/style'
import { GroupValueOnlyMessage } from '@features/RegulatoryArea/components/RegulatoryAreaGroupForm/GroupValueOnlyMessage'
import { InformativeMessageForCopyData } from '@features/RegulatoryArea/components/RegulatoryAreaGroupForm/InformativeMessageForCopyData'
import { SubTitle } from '@features/RegulatoryArea/style'
import {
  type Propagation,
  type PropagationConflicts,
  type RegulatoryAreaGroupFields
} from '@features/RegulatoryArea/useCases/usePropagation'
import { getChangedPropagatedFields } from '@features/RegulatoryArea/useCases/usePropagation'
import { FormikTextarea, Icon, Label, SingleTag, THEME } from '@mtes-mct/monitor-ui'
import { deleteTagTag } from '@utils/deleteTagTag'
import { deleteThemeTag } from '@utils/deleteThemeTag'
import { parseOptionsToTags } from '@utils/getTagsAsOptions'
import { parseOptionsToThemes } from '@utils/getThemesAsOptions'
import { useFormikContext } from 'formik'
import { useMemo } from 'react'
import styled from 'styled-components'

import type { RegulatoryArea } from '@features/RegulatoryArea/types'
import type { TagOption } from 'domain/entities/tags'
import type { ThemeOption } from 'domain/entities/themes'

type GroupIdentificationProps = {
  conflicts: PropagationConflicts
  hasRegulatoryAreasNotUsingGroupValue: (field: RegulatoryAreaGroupFields) => boolean
  isNew: boolean
  needsAnswer: (field: RegulatoryAreaGroupFields) => boolean
  propagation: Propagation
  setOverwrite: (field: RegulatoryAreaGroupFields, overwriteExisting: boolean) => void
}

export function GroupIdentification({
  conflicts,
  hasRegulatoryAreasNotUsingGroupValue,
  isNew,
  needsAnswer,
  propagation,
  setOverwrite
}: GroupIdentificationProps) {
  const { initialValues, setFieldValue, values } = useFormikContext<RegulatoryArea.RegulatoryAreaGroupToApi>()

  const changedFields = getChangedPropagatedFields(values, initialValues)
  const isQuestionDisplayed = (field: RegulatoryAreaGroupFields) => !isNew && needsAnswer(field)
  const isGroupValueOnlyMessageDisplayed = (field: RegulatoryAreaGroupFields) =>
    !isNew && changedFields.includes(field) && hasRegulatoryAreasNotUsingGroupValue(field)
  const getConflictingRegulatoryAreas = (field: RegulatoryAreaGroupFields) =>
    conflicts[field]?.regulatoryAreasWithExistingData ?? []

  const allThemesAndSubthemes = useMemo(
    () => values?.themes?.flatMap(theme => [...theme.subThemes, theme]),
    [values?.themes]
  )
  const allTagsAndSubtags = useMemo(() => values?.tags?.flatMap(tag => [...tag.subTags, tag]), [values?.tags])

  const setThemes = (nextThemes: ThemeOption[] | undefined = []) => {
    setFieldValue('themes', parseOptionsToThemes(nextThemes))
  }

  const setTags = (nextTags: TagOption[] | undefined = []) => {
    setFieldValue('tags', parseOptionsToTags(nextTags))
  }

  const withThemesAndTags = useMemo(
    () => propagation.THEMES?.enabled && propagation.TAGS?.enabled,
    [propagation.THEMES?.enabled, propagation.TAGS?.enabled]
  )
  const withPeriods = useMemo(
    () => propagation.AUTHORIZATION_PERIODS?.enabled || propagation.PROHIBITION_PERIODS?.enabled,
    [propagation.AUTHORIZATION_PERIODS?.enabled, propagation.PROHIBITION_PERIODS?.enabled]
  )

  return (
    <>
      <SubTitle>IDENTIFICATION DE LA ZONE RÉGLEMENTAIRE</SubTitle>
      {isGroupValueOnlyMessageDisplayed('THEMES') && <GroupValueOnlyMessage />}
      {isQuestionDisplayed('THEMES') && (
        <InformativeMessageForCopyData
          field="THEMES"
          onConfirm={() => setOverwrite('THEMES', true)}
          onReject={() => setOverwrite('THEMES', false)}
          regulatoryAreas={getConflictingRegulatoryAreas('THEMES')}
          text={
            <>
              Les <Bold>thématiques sélectionnés</Bold> doivent-elles modifier les{' '}
              <Bold>thématiques actuellement associées aux réglementations&nbsp;? </Bold>
            </>
          }
          title="Thématiques"
        />
      )}
      {isGroupValueOnlyMessageDisplayed('TAGS') && <GroupValueOnlyMessage />}
      {isQuestionDisplayed('TAGS') && (
        <InformativeMessageForCopyData
          field="TAGS"
          onConfirm={() => setOverwrite('TAGS', true)}
          onReject={() => setOverwrite('TAGS', false)}
          regulatoryAreas={getConflictingRegulatoryAreas('TAGS')}
          text={
            <>
              Les <Bold>tags sélectionnés</Bold> doivent-elles modifier les{' '}
              <Bold>tags actuellement associés aux réglementations&nbsp;? </Bold>
            </>
          }
          title="Tags"
        />
      )}
      {(propagation.THEMES?.enabled || propagation.TAGS?.enabled) && (
        <Fields $withTwoColumns={withThemesAndTags}>
          {propagation.THEMES?.enabled && (
            <ThemeOrTagContainer $withTwoColumns={withThemesAndTags}>
              <RegulatoryThemesFilter
                isErrorMessageHidden
                isLabelHidden={false}
                isRequired
                isTransparent={false}
                label="Thématiques et sous-thématiques"
                onChange={setThemes}
                value={values?.themes ?? []}
              />
              {allThemesAndSubthemes && (
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
              )}
            </ThemeOrTagContainer>
          )}
          {propagation.TAGS?.enabled && (
            <ThemeOrTagContainer $withTwoColumns={withThemesAndTags}>
              <RegulatoryTagsFilter
                isErrorMessageHidden
                isLabelHidden={false}
                isTransparent={false}
                label="Tags et sous-tags"
                onChange={setTags}
                value={values?.tags ?? []}
              />
              {allTagsAndSubtags && (
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
              )}
            </ThemeOrTagContainer>
          )}
        </Fields>
      )}
      {propagation.RESUME?.enabled && (
        <>
          {isGroupValueOnlyMessageDisplayed('RESUME') && <GroupValueOnlyMessage />}
          {isQuestionDisplayed('RESUME') && (
            <InformativeMessageForCopyData
              field="RESUME"
              onConfirm={() => setOverwrite('RESUME', true)}
              onReject={() => setOverwrite('RESUME', false)}
              regulatoryAreas={getConflictingRegulatoryAreas('RESUME')}
              text={
                <>
                  Le <Bold>thème sélectionné</Bold> doit-il modifier le{' '}
                  <Bold>résumé actuellement associé aux réglementations&nbsp;? </Bold>
                </>
              }
              title="Résumé"
            />
          )}
          <div>
            <FormikTextarea isErrorMessageHidden label="Résumé" name="resume" rows={4} />
            <InformationMessage>
              Le résumé concerne tout ce qui n’est pas une période. Si la réglementation ne concerne que des périodes,
              alors le résumé n’est pas nécessaire.
            </InformationMessage>
          </div>
        </>
      )}
      {withPeriods && (
        <>
          {isGroupValueOnlyMessageDisplayed('AUTHORIZATION_PERIODS') && <GroupValueOnlyMessage />}
          {isQuestionDisplayed('AUTHORIZATION_PERIODS') && (
            <InformativeMessageForCopyData
              field="AUTHORIZATION_PERIODS"
              onConfirm={() => setOverwrite('AUTHORIZATION_PERIODS', true)}
              onReject={() => setOverwrite('AUTHORIZATION_PERIODS', false)}
              regulatoryAreas={getConflictingRegulatoryAreas('AUTHORIZATION_PERIODS')}
              text={
                <>
                  La <Bold>période d&apos;autorisation ajoutée</Bold> doit-elle modifier les{' '}
                  <Bold>périodes d&apos;autorisation actuellement associées aux réglementations&nbsp;? </Bold>
                </>
              }
              title="Période d'autorisation"
            />
          )}
          {isGroupValueOnlyMessageDisplayed('PROHIBITION_PERIODS') && <GroupValueOnlyMessage />}
          {isQuestionDisplayed('PROHIBITION_PERIODS') && (
            <InformativeMessageForCopyData
              field="PROHIBITION_PERIODS"
              onConfirm={() => setOverwrite('PROHIBITION_PERIODS', true)}
              onReject={() => setOverwrite('PROHIBITION_PERIODS', false)}
              regulatoryAreas={getConflictingRegulatoryAreas('PROHIBITION_PERIODS')}
              text={
                <>
                  La <Bold>période d&apos;interdiction ajoutée</Bold> doit-elle modifier les{' '}
                  <Bold>périodes d&apos;interdiction actuellement associées aux réglementations&nbsp;? </Bold>
                </>
              }
              title="Période d'interdiction"
            />
          )}
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
        </>
      )}
    </>
  )
}

const Fields = styled.div<{ $withTwoColumns?: boolean }>`
  display: flex;
  gap: 8px;
  flex: 1;
  flex-direction: ${props => (props.$withTwoColumns ? 'row' : 'column')};
`

const ThemeOrTagContainer = styled.div<{ $withTwoColumns?: boolean }>`
  display: flex;
  flex-basis: ${props => (props.$withTwoColumns ? '50%' : '100%')};
  flex-direction: column;
  gap: 8px;
  max-width: ${props => (props.$withTwoColumns ? '50%' : '100%')};
`

const SmallInlineFields = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: start;
`

const InformationMessage = styled.span`
  color: ${p => p.theme.color.slateGray};
  font-size: 13px;
  font-style: italic;
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
