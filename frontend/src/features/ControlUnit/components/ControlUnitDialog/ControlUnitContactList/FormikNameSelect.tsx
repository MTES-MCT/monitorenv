import { FormikTextInput, Select } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import { useCallback, useEffect, useState } from 'react'

import { CONTROL_UNIT_CONTACT_NAMES, CONTROL_UNIT_CONTACT_NAMES_AS_OPTIONS } from './constants'

export function FormikNameSelect() {
  const [isCustomName, setIsCustomName] = useState<boolean>(false)

  const [field, meta, helpers] = useField<string | undefined>('name')

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

  useEffect(() => {
    if (!isCustomName && field.value && CONTROL_UNIT_CONTACT_NAMES.includes(field.value)) {
      setIsCustomName(false)
    }
  }, [field.value, isCustomName])

  return isCustomName ? (
    <FormikTextInput isLight label="Nom du contact" name="name" />
  ) : (
    <Select
      error={meta.error}
      isLight
      label="Nom du contact"
      name="name"
      onChange={handleChange}
      options={CONTROL_UNIT_CONTACT_NAMES_AS_OPTIONS}
      value={field.value}
    />
  )
}
