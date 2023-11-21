import { Icon, THEME } from '@mtes-mct/monitor-ui'

import { NoteContent } from './style'

export function NoteCard({ action }) {
  return (
    <>
      <Icon.Note color={THEME.color.charcoal} size={20} />
      <NoteContent>{action.observations || 'Observation à renseigner'}</NoteContent>
    </>
  )
}
