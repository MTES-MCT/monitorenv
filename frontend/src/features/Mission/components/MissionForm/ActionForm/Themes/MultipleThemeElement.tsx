import { Accent, Button, Icon, IconButton, Size } from '@mtes-mct/monitor-ui'
import { isEmpty, compact } from 'lodash'
import styled from 'styled-components'

import { ActionTheme } from './ActionTheme'
import { ActionTypeEnum } from '../../../../../../domain/entities/missions'

export function MultipleThemeElement({ envActionIndex, form, push, remove, themesYear }) {
  const handleRemoveTheme = (index: number) => {
    remove(index)
  }
  const handleAddTheme = () => {
    push({ subThemeIds: [], tagIds: [], themeId: undefined })
  }

  const currentThemes =
    (form?.values?.envActions &&
      form.values.envActions.length > 0 &&
      form.values.envActions[envActionIndex]?.controlPlans) ||
    []

  return (
    <div>
      {isEmpty(compact(currentThemes)) && (
        <ThemeBloc key={0}>
          <ActionTheme
            actionIndex={envActionIndex}
            actionType={ActionTypeEnum.SURVEILLANCE}
            labelSubTheme="Sous-thématiques de surveillance"
            labelTheme="Thématique de surveillance"
            themeIndex={0}
            themesYear={themesYear}
          />
        </ThemeBloc>
      )}
      {currentThemes.map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <ThemeBloc key={index}>
          <ActionTheme
            actionIndex={envActionIndex}
            actionType={ActionTypeEnum.SURVEILLANCE}
            labelSubTheme="Sous-thématiques de surveillance"
            labelTheme="Thématique de surveillance"
            themeIndex={index}
            themesYear={themesYear}
          />

          {index > 0 && (
            <RemoveButtonWrapper>
              <IconButton accent={Accent.SECONDARY} Icon={Icon.Delete} onClick={() => handleRemoveTheme(index)} />
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
    </div>
  )
}

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
