import { missionSourceEnum } from '../../../domain/entities/missions'

export function getMissionSourceCell(missionSource: string): string {
  const source = (missionSource && missionSourceEnum[missionSource]?.label) || ''

  return source
}
