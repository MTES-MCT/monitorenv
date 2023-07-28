import { useField } from 'formik'
import styled from 'styled-components'

import { ProtectedSpeciesSelector } from './ProtectedSpeciesSelector'
import { THEME_REQUIRE_PROTECTED_SPECIES } from '../../../../../domain/entities/missions'
import { ThemeSelector } from '../../../../commonComponents/ThemeSelector'
import { SubThemesSelector } from '../../../../commonComponents/ThemeSelector/SubThemesSelector'

export function ActionTheme({ actionIndex, labelSubTheme, labelTheme, themeIndex }) {
  const [currentThemeField] = useField<string>(`envActions[${actionIndex}].themes[${themeIndex}].theme`)

  return (
    <ActionThemeWrapper data-cy="envaction-theme-element">
      <ThemeSelector actionIndex={actionIndex} isInNewWindow label={labelTheme} themeIndex={themeIndex} />
      <SubThemesSelector
        actionIndex={actionIndex}
        isInNewWindow
        label={labelSubTheme}
        theme={currentThemeField?.value}
        themeIndex={themeIndex}
      />
      {THEME_REQUIRE_PROTECTED_SPECIES.includes(currentThemeField.value) && (
        <ProtectedSpeciesSelector actionIndex={actionIndex} themeIndex={themeIndex} />
      )}
    </ActionThemeWrapper>
  )
}

const ActionThemeWrapper = styled.div`
  flex: 1;
`
