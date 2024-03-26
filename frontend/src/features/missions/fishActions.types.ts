export namespace FishMissionAction {
  export interface MissionAction {
    actionDatetimeUtc: string
    actionType: MissionActionType
    id: number
    numberOfVesselsFlownOver: number
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
    actionSource: string
    actionType: FishMissionAction.MissionActionType
    timelineDate: string
  }
}
