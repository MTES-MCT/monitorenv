import { themesAPI } from '@api/themesAPI'
import { addBackOfficeBanner } from '@features/BackOffice/useCases/addBackOfficeBanner'
import { Level } from '@mtes-mct/monitor-ui'

import type { ThemeToAPI } from '../../../../domain/entities/themes'

export const saveTheme = (theme: ThemeToAPI) => async dispatch => {
  const { data, error } = await dispatch(themesAPI.endpoints.saveTheme.initiate(theme))
  if (data) {
    dispatch(
      addBackOfficeBanner({
        children: 'La thématique a bien été enregistré',
        isClosable: true,
        isFixed: true,
        level: Level.SUCCESS,
        withAutomaticClosing: true
      })
    )
  }
  if (error) {
    dispatch(
      addBackOfficeBanner({
        children: "La thématique n'a pas pu être enregistré",
        isClosable: true,
        isFixed: true,
        level: Level.ERROR,
        withAutomaticClosing: true
      })
    )
  }

  return data
}
