import { VigilanceArea } from '@features/VigilanceArea/types'
import { Checkbox, PhoneInput, Textarea, TextInput } from '@mtes-mct/monitor-ui'

export function OtherOrInternalSource({
  error,
  onEditSource,
  source,
  type
}: {
  error: string | undefined
  onEditSource: (source: VigilanceArea.VigilanceAreaSource) => void
  source: VigilanceArea.VigilanceAreaSource
  type: VigilanceArea.VigilanceAreaSourceType
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
      {type === VigilanceArea.VigilanceAreaSourceType.OTHER && (
        <>
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
        </>
      )}
      {type === VigilanceArea.VigilanceAreaSourceType.INTERNAL && (
        /* TODO replace with LinkInput when export correctly in monitor-ui */
        <TextInput
          error={error}
          isErrorMessageHidden
          isLight
          label="Lien"
          name="sourceLink"
          onChange={link => onUpdateField('link', link)}
          value={source.link}
        />
      )}
      <Textarea
        isLight
        label="Commentaire"
        name="sourceComments"
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
