import { RegulatoryTagsFilter } from '@components/RegulatoryTagsFilter'
import { RegulatoryThemesFilter } from '@components/RegulatoryThemesFilter'
import { Bold } from '@components/style'
import { InformativeMessageForCopyData } from '@features/RegulatoryArea/components/RegulatoryAreaGroupForm/InformativeMessageForCopyData'
import { SubTitle } from '@features/RegulatoryArea/style'
import { SingleTag } from '@mtes-mct/monitor-ui'
import { deleteTagTag } from '@utils/deleteTagTag'
import { deleteThemeTag } from '@utils/deleteThemeTag'
import { parseOptionsToTags } from '@utils/getTagsAsOptions'
import { parseOptionsToThemes } from '@utils/getThemesAsOptions'
import { useFormikContext } from 'formik'
import { isEqual } from 'lodash'
import { useMemo } from 'react'
import styled from 'styled-components'

import type { RegulatoryArea } from '@features/RegulatoryArea/types'
import type { TagOption } from 'domain/entities/tags'
import type { ThemeOption } from 'domain/entities/themes'

export function GroupIdentification() {
  const { initialValues, setFieldValue, values } = useFormikContext<RegulatoryArea.RegulatoryAreaGroupToApi>()

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

  return (
    <>
      <SubTitle>IDENTIFICATION DE LA ZONE RÉGLEMENTAIRE</SubTitle>
      {!isEqual(values.themes, initialValues.themes) && (
        <InformativeMessageForCopyData>
          <>
            <MessageTitle>Thématiques par défaut</MessageTitle>
            <p>
              Les <Bold>thématiques sélectionnés</Bold> doivent-elles modifier les{' '}
              <Bold>thématiques actuellement associées aux réglementations&nbsp;? </Bold>Le cas échéant, elles
              n’impacteront que que les futures zones réglementaires ajoutées au groupe.
            </p>
            <UnderlineText>Voir les thématiques ajoutées aux zones réglementaires actuelles</UnderlineText>
          </>
        </InformativeMessageForCopyData>
      )}
      <Fields>
        <RegulatoryThemesFilter
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
        {!isEqual(values.tags, initialValues.tags) && (
          <InformativeMessageForCopyData>
            <>
              <MessageTitle>Tags par défaut</MessageTitle>
              <p>
                Les <Bold>tags sélectionnés</Bold> doivent-elles modifier les{' '}
                <Bold>tags actuellement associés aux réglementations&nbsp;? </Bold>Le cas échéant, ils n’impacteront que
                que les futures zones réglementaires ajoutées au groupe.
              </p>
              <UnderlineText>Voir les tags ajoutés aux zones réglementaires actuelles</UnderlineText>
            </>
          </InformativeMessageForCopyData>
        )}
        <RegulatoryTagsFilter
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
    </>
  )
}

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
const MessageTitle = styled.p`
  color: #45688a;
  font-weight: bold;
  margin-bottom: 8px;
`

const UnderlineText = styled.p`
  text-decoration: underline;
`
