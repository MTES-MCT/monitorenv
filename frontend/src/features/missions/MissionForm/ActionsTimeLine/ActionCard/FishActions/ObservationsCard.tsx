import { Icon, THEME } from '@mtes-mct/monitor-ui'

import { NoteContent } from '../style'

export function ObservationsCard({ action }) {
  return (
    <>
      <Icon.Note color={THEME.color.charcoal} size={20} />
      <NoteContent title={action.otherComments ?? ''}>{action.otherComments ?? 'Observation à renseigner'}</NoteContent>
    </>
  )
}
