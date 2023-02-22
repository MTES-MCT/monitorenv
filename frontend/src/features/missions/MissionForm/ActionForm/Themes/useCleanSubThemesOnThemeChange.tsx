import { usePrevious } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import _ from 'lodash'
import { useEffect } from 'react'

export function useCleanSubThemesOnThemeChange(path) {
  const { setFieldValue, values } = useFormikContext()
  const previousPath = usePrevious(path)
  const previousTheme = usePrevious(_.get(values, `${path}.theme`))
  useEffect(() => {
    const currentTheme = _.get(values, `${path}.theme`)
    if (path === previousPath && currentTheme !== previousTheme) {
      setFieldValue(`${path}.subThemes`, [])
    }

    // setFieldValue is not memoized thus should not appear in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, path, previousPath])

  return null
}
