import { useEscapeKey } from '@hooks/useEscapeKey'
import { TextInput, useClickOutsideEffect, useNewWindow } from '@mtes-mct/monitor-ui'
import { useRef } from 'react'
import styled from 'styled-components'

export function TabNameInput({
  onChange,
  validate,
  value
}: {
  onChange: (name: string | undefined) => void
  validate: () => void
  value: string | undefined
}) {
  const ref = useRef<HTMLInputElement>(null)
  const { newWindowContainerRef } = useNewWindow()

  useClickOutsideEffect(
    ref,
    () => {
      validate()
    },
    newWindowContainerRef.current
  )

  useEscapeKey({ onEnter: () => validate(), ref })

  return (
    <StyledTextInput
      autoFocus
      inputRef={ref}
      isLabelHidden
      isTransparent
      label="Nom du tableau de bord"
      name="name"
      onChange={onChange}
      value={value}
    />
  )
}

const StyledTextInput = styled(TextInput)`
  flex-grow: 1;
`
