import { usePrevious } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import _ from 'lodash'
import { useEffect } from 'react'

import type { Mission, NewMission } from '../../../../../domain/entities/missions'

export function useCleanSubThemesOnThemeChange(path) {
  const { setFieldValue, values } = useFormikContext<Partial<Mission | NewMission>>()
  const previousPath = usePrevious(path)
  const previousTheme = usePrevious(_.get(values, `${path}.theme`))

  useEffect(() => {
    const currentTheme = _.get(values, `${path}.theme`)
    if (`${path}` === previousPath && currentTheme !== previousTheme) {
      if (!currentTheme) {
        setFieldValue(`${path}`, undefined)

        return
      }
      setFieldValue(`${path}.subThemes`, undefined)
      setFieldValue(`${path}.protectedSpecies`, undefined)
    }

    // setFieldValue is not memoized thus should not appear in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, path, previousPath])

  return null
}
