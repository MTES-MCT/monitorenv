import { MultiSelect, useNewWindow, type Option } from '@mtes-mct/monitor-ui'
import { useField, useFormikContext } from 'formik'

import { type Mission } from '../../../../../domain/entities/missions'
import { updateTags } from '../../formikUseCases/updateActionThemes'

type TagsSelectorProps = {
  actionIndex: number
  tags: Option[]
  themeIndex: number
}
export function TagsSelector({ actionIndex, tags, themeIndex }: TagsSelectorProps) {
  const [currentTagsField] = useField<number[]>(`envActions[${actionIndex}].controlPlans[${themeIndex}].tagIds`)
  const { newWindowContainerRef } = useNewWindow()
  const { setFieldValue } = useFormikContext<Mission>()

  const handleUpdateTags = nextTags => {
    updateTags(setFieldValue)(nextTags, actionIndex, themeIndex)
  }

  return (
    <MultiSelect
      key={`${actionIndex}-${themeIndex}`}
      baseContainer={newWindowContainerRef.current}
      data-cy="envaction-tags-selector"
      isLight
      label="Tags"
      name={`${actionIndex}-${themeIndex}`}
      onChange={handleUpdateTags}
      options={tags}
      value={currentTagsField.value?.map(value => value) as any[]}
    />
  )
}
