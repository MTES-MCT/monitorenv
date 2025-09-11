import { VigilanceArea } from '@features/VigilanceArea/types'
import { Checkbox, Textarea, TextInput } from '@mtes-mct/monitor-ui'

export function InternalSource({
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
      {/* TODO replace with LinkInput when export correctly in monitor-ui */}
      <TextInput
        error={error}
        isErrorMessageHidden
        isLight
        label="Lien"
        name="sourceLink"
        onChange={link => onUpdateField('link', link)}
        value={source.link}
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
