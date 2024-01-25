import { useEffect } from 'react'

import type { Mission } from '../../../../domain/entities/missions'

export function useUpdateFreezedFormValues(
  freezedFormValues: Partial<Mission> | undefined,
  formValues: Partial<Mission> | undefined,
  callback: (formValues: Partial<Mission>) => void
) {
  useEffect(() => {
    if (freezedFormValues?.id === formValues?.id) {
      return
    }

    if (!formValues) {
      return
    }

    callback(formValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues])
}
