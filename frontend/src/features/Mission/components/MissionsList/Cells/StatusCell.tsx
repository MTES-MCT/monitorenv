import { MissionStatusTag } from '@features/Mission/components/MissionStatusTag'
import { getMissionStatus } from 'domain/entities/missions'

export function StatusCell({ row }: { row?: any }) {
  const status = getMissionStatus(row.original)

  return <MissionStatusTag isLight status={status} />
}
