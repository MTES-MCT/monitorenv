import { FormikTextInput, Select, getOptionsFromLabelledEnum } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import { useCallback, useState } from 'react'

import { ControlUnit } from '../../../../../domain/entities/controlUnit'

export function FormikNameSelect() {
  const [isCustomName, setIsCustomName] = useState<boolean>(false)

  const [field, meta, helpers] = useField<string | undefined>('name')

  const namesAsOptions = [
    ...getOptionsFromLabelledEnum(ControlUnit.ControlUnitContactName),
    {
      label: 'Ajouter un nom personnalisé',
      value: 'SWITCH_TO_CUSTOM_NAME'
    }
  ]

  const handleChange = useCallback(
    (nextName: string | undefined) => {
      if (nextName === 'SWITCH_TO_CUSTOM_NAME') {
        setIsCustomName(true)

        return
      }

      helpers.setValue(nextName)
    },

    // We don't want to trigger infinite re-rendering since `helpers.setValue` changes after each rendering
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setIsCustomName]
  )

  return isCustomName ? (
    <FormikTextInput isLight label="Nom du contact" name="name" />
  ) : (
    <Select
      error={meta.error}
      isLight
      label="Nom du contact"
      name="name"
      onChange={handleChange}
      options={namesAsOptions}
      value={field.value}
    />
  )
}
