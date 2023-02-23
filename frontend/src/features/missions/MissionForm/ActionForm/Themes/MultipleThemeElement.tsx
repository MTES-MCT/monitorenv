import { Accent, Button, Icon, IconButton, Size } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { ActionTheme } from './ActionTheme'

export function MultipleThemeElement({ currentActionIndex, form, push, remove }) {
  const handleRemoveTheme = index => () => {
    remove(index)
  }
  const handleAddTheme = () => {
    push({ subThemes: [], theme: '' })
  }

  const currentThemes =
    (form?.values?.envActions &&
      form.values.envActions.length > 0 &&
      form.values.envActions[currentActionIndex]?.themes) ||
    []

  return (
    <ThemesWrapper>
      {currentThemes.map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <ThemeBloc key={i}>
          <ActionTheme
            labelSubTheme="Sous-thématiques de surveillance"
            labelTheme="Thématique de surveillance"
            themePath={`envActions.${currentActionIndex}.themes.${i}`}
          />

          {i > 0 && (
            <RemoveButtonWrapper>
              <IconButton accent={Accent.SECONDARY} Icon={Icon.Delete} onClick={handleRemoveTheme(i)} />
            </RemoveButtonWrapper>
          )}
        </ThemeBloc>
      ))}
      <ButtonWrapper>
        <Button
          accent={Accent.SECONDARY}
          data-cy="envaction-add-theme"
          Icon={Icon.Plus}
          onClick={handleAddTheme}
          size={Size.SMALL}
        >
          Ajouter une autre thématique
        </Button>
      </ButtonWrapper>
    </ThemesWrapper>
  )
}

const ThemesWrapper = styled.div`
  margin-bottom: 24px;
`

const ThemeBloc = styled.div`
  display: flex;
  &:not(:nth-of-type(1)) {
    padding-top: 20px;
  }
`
const ButtonWrapper = styled.div`
  padding-top: 12px;
`
const RemoveButtonWrapper = styled.div`
  padding-left: 8px;
  padding-top: 19px;
`
