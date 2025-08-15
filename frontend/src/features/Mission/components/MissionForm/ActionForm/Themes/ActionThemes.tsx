import { CheckTreePicker } from '@mtes-mct/monitor-ui'
import { getThemesAsOptions, parseOptionsToThemes, sortThemes } from '@utils/getThemesAsOptions'
import { useField } from 'formik'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import { ActionTypeEnum } from '../../../../../../domain/entities/missions'

import type { ThemeFromAPI } from 'domain/entities/themes'

export const GENERAL_SURVEILLANCE = 'Surveillance générale'

type ActionThemeProps = {
  actionIndex: number
  actionType: ActionTypeEnum
  themes: ThemeFromAPI[]
}
export function ActionThemes({ actionIndex, actionType, themes }: ActionThemeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [field, meta, helpers] = useField<ThemeFromAPI[]>(`envActions[${actionIndex}].themes`)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const lastKeyPressed = useRef<string | null>(null)

  const themesOptions = useMemo(() => {
    if (actionType === ActionTypeEnum.CONTROL) {
      return getThemesAsOptions(themes)
        .filter(theme => theme.name !== GENERAL_SURVEILLANCE)
        .sort(sortThemes)
    }

    return getThemesAsOptions(themes)
  }, [actionType, themes])

  const forceFocus = useCallback(() => {
    const input = ref.current?.querySelector('[role="searchbox"]') as HTMLInputElement
    if (lastKeyPressed.current === 'Backspace' && searchQuery.length > 0) {
      input.focus()
    }
  }, [searchQuery.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      lastKeyPressed.current = e.key
    }
    ref.current?.addEventListener('focusout', forceFocus)
    ref.current?.addEventListener('keydown', handleKeyDown)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ref.current?.removeEventListener('focusout', forceFocus)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ref.current?.removeEventListener('keydown', handleKeyDown)
    }
  }, [forceFocus])

  const label = useMemo(
    () =>
      actionType === ActionTypeEnum.CONTROL
        ? 'Thématiques et sous-thématiques de contrôle'
        : 'Thématiques et sous-thématiques de surveillance',
    [actionType]
  )

  const handleChange = useCallback(
    (option: any) => {
      helpers.setValue(parseOptionsToThemes(option) ?? [])
    },
    [helpers]
  )

  const handleSearch = (nextQuery: string) => {
    setSearchQuery(nextQuery)
  }

  return (
    <ActionThemeWrapper ref={ref} data-cy="envaction-theme-element">
      <CheckTreePicker
        childrenKey="subThemes"
        error={meta.error}
        isErrorMessageHidden
        isLight
        isMultiSelect={actionType === ActionTypeEnum.SURVEILLANCE}
        isRequired
        label={label}
        labelKey="name"
        name={`envActions[${actionIndex}].themes`}
        onChange={handleChange}
        onSearch={handleSearch}
        options={themesOptions}
        value={field.value}
        valueKey="id"
      />
    </ActionThemeWrapper>
  )
}

const ActionThemeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
  max-width: 100%;
`
