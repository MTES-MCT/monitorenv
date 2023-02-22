import { useField } from 'formik'
import styled from 'styled-components'

import { THEME_REQUIRE_PROTECTED_SPECIES } from '../../../../../domain/entities/missions'
import { ProtectedSpeciesSelector } from './ProtectedSpeciesSelector'
import { SubThemesSelector } from './SubThemesSelector'
import { ThemeSelector } from './ThemeSelector'
import { useCleanSubThemesOnThemeChange } from './useCleanSubThemesOnThemeChange'

export function ThemeElement({ labelSubTheme, labelTheme, themePath }) {
  const [currentThemeField] = useField(`${themePath}.theme`)

  useCleanSubThemesOnThemeChange(themePath)

  return (
    <ThemeEkementWrapper>
      <ThemeSelector label={labelTheme} name={`${themePath}.theme`} />
      <SubThemesSelector label={labelSubTheme} name={`${themePath}.subThemes`} theme={currentThemeField?.value} />
      {THEME_REQUIRE_PROTECTED_SPECIES.includes(currentThemeField.value) && (
        <ProtectedSpeciesSelector name={`${themePath}.protectedSpecies`} />
      )}
    </ThemeEkementWrapper>
  )
}

const ThemeEkementWrapper = styled.div`
  flex: 1;
`
