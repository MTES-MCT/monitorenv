import { VigilanceArea } from '@features/VigilanceArea/types'
import { PhoneInput, TextInput } from '@mtes-mct/monitor-ui'

export function OtherSource({
  editedSource,
  error,
  onEmailChange,
  onNameChange,
  onPhoneChange
}: {
  editedSource: VigilanceArea.VigilanceAreaSource
  error: string | undefined
  onEmailChange: (nextValue: string | undefined) => void
  onNameChange: (nextValue: string | undefined) => void
  onPhoneChange: (nextValue: string | undefined) => void
}) {
  return (
    <>
      <TextInput
        error={error}
        isErrorMessageHidden
        isLight
        label="Nom"
        name="sourceName"
        onChange={onNameChange}
        value={editedSource.name}
      />
      <PhoneInput
        error={error}
        isErrorMessageHidden
        isLight
        label="Numéro de téléphone"
        name="sourcePhone"
        onChange={onPhoneChange}
        value={editedSource.phone}
      />
      <TextInput
        error={error}
        isErrorMessageHidden
        isLight
        label="Email"
        name="sourceEmail"
        onChange={onEmailChange}
        value={editedSource.email}
      />
    </>
  )
}
