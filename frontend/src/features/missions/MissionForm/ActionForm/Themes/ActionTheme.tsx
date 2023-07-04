import { useField } from 'formik'
import styled from 'styled-components'

import { ProtectedSpeciesSelector } from './ProtectedSpeciesSelector'
import { SubThemesSelector } from './SubThemesSelector'
import { ThemeSelector } from './ThemeSelector'
import { useCleanSubThemesOnThemeChange } from './useCleanSubThemesOnThemeChange'
import { THEME_REQUIRE_PROTECTED_SPECIES } from '../../../../../domain/entities/missions'

export function ActionTheme({ labelSubTheme, labelTheme, themePath }) {
  const [currentThemeField] = useField(`${themePath}.theme`)

  useCleanSubThemesOnThemeChange(themePath)

  return (
    <ActionThemeWrapper data-cy="envaction-theme-element">
      <ThemeSelector label={labelTheme} name={`${themePath}.theme`} />
      <SubThemesSelector label={labelSubTheme} name={`${themePath}.subThemes`} theme={currentThemeField?.value} />
      {THEME_REQUIRE_PROTECTED_SPECIES.includes(currentThemeField.value) && (
        <ProtectedSpeciesSelector name={`${themePath}.protectedSpecies`} />
      )}
    </ActionThemeWrapper>
  )
}

const ActionThemeWrapper = styled.div`
  flex: 1;
`
