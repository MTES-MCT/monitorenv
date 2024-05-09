import { getMissionStatus } from '@features/Mission/utils'

import { MissionStatusLabel } from '../Shared/MissionStatusLabel'

export function CellStatus({ row }: { row?: any }) {
  const status = getMissionStatus(row.original)

  return <MissionStatusLabel missionStatus={status} />
}
