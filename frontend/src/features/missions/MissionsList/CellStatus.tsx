import { getMissionStatus } from '../../../domain/entities/missions'
import { MissionStatusLabel } from '../../../ui/MissionStatusLabel'

export function CellStatus({ row }: { row?: any }) {
  const status = getMissionStatus(row.original)

  return <MissionStatusLabel missionStatus={status} />
}
