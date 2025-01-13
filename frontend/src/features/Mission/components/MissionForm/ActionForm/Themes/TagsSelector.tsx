import { MultiSelect, type Option } from '@mtes-mct/monitor-ui'
import { useField, useFormikContext } from 'formik'

import { type Mission } from '../../../../../../domain/entities/missions'
import { updateTags } from '../../formikUseCases/updateActionThemes'

type TagsSelectorProps = {
  actionIndex: number
  tags: Array<Option<number>>
  themeIndex: number
}
export function TagsSelector({ actionIndex, tags, themeIndex }: TagsSelectorProps) {
  const [currentTagsField] = useField<number[]>(`envActions[${actionIndex}].controlPlans[${themeIndex}].tagIds`)
  const { setFieldValue } = useFormikContext<Mission>()

  const handleUpdateTags = nextTags => {
    updateTags(setFieldValue)(nextTags, actionIndex, themeIndex)
  }

  return (
    <MultiSelect
      key={`${actionIndex}-${themeIndex}`}
      data-cy="envaction-tags-selector"
      isLight
      label="Précisions sur la thématique"
      name={`${actionIndex}-${themeIndex}`}
      onChange={handleUpdateTags}
      options={tags}
      value={currentTagsField.value?.map(value => value)}
    />
  )
}
