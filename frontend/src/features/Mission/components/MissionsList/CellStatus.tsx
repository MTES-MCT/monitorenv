import { MissionStatusLabel } from '@features/Mission/components/MissionStatusLabel'
import { getMissionStatus } from 'domain/entities/missions'

export function CellStatus({ row }: { row?: any }) {
  const status = getMissionStatus(row.original)

  return <MissionStatusLabel missionStatus={status} />
}
