import { VigilanceArea } from '@features/VigilanceArea/types'
import { Checkbox, PhoneInput, Textarea, TextInput } from '@mtes-mct/monitor-ui'

export function OtherSource({
  error,
  onEditSource,
  source
}: {
  error: string | undefined
  onEditSource: (source: VigilanceArea.VigilanceAreaSource) => void
  source: VigilanceArea.VigilanceAreaSource
}) {
  const onUpdateField = (field: string, value: any) => {
    onEditSource({ ...source, [field]: value })
  }

  return (
    <>
      <TextInput
        error={error}
        isErrorMessageHidden
        isLight
        label="Nom"
        name="sourceName"
        onChange={name => onUpdateField('name', name)}
        value={source.name}
      />
      <PhoneInput
        error={error}
        isErrorMessageHidden
        isLight
        label="Numéro de téléphone"
        name="sourcePhone"
        onChange={phone => onUpdateField('phone', phone)}
        value={source.phone}
      />
      <TextInput
        error={error}
        isErrorMessageHidden
        isLight
        label="Email"
        name="sourceEmail"
        onChange={email => onUpdateField('email', email)}
        value={source.email}
      />
      <Textarea
        isLight
        label="Commentaire"
        name="comments"
        onChange={comments => onUpdateField('comments', comments)}
        placeholder="Information supplémentaire sur la source"
        value={source.comments}
      />
      <Checkbox
        checked={source.isAnonymous}
        label="Source anonyme"
        name="isAnonymous"
        onChange={isChecked => onUpdateField('isAnonymous', isChecked ?? false)}
      />
    </>
  )
}
