import type { ActionSource, CompletionStatus } from 'domain/entities/missions'

export namespace FishMissionAction {
  export interface MissionAction {
    actionDatetimeUtc: string
    actionType: MissionActionType
    completion: CompletionStatus
    id: number
    latitude: number
    longitude: number
    numberOfVesselsFlownOver: number
    otherComments?: string
    vesselName: string
  }

  // ---------------------------------------------------------------------------
  // Constants

  export enum MissionActionType {
    AIR_CONTROL = 'AIR_CONTROL',
    AIR_SURVEILLANCE = 'AIR_SURVEILLANCE',
    LAND_CONTROL = 'LAND_CONTROL',
    OBSERVATION = 'OBSERVATION',
    SEA_CONTROL = 'SEA_CONTROL'
  }

  export type FishActionForTimeline = Partial<FishMissionAction.MissionAction> & {
    actionSource: ActionSource
    actionType: FishMissionAction.MissionActionType
    timelineDate: string
  }
}
