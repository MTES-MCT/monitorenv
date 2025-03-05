import { type ControlUnit } from '@mtes-mct/monitor-ui'
import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { Infraction, Mission, NewInfraction, NewMission } from '../../../../domain/entities/missions'
import type { AtLeast } from '../../../../types'

export type MissionInStateType = {
  activeAction?: SelectedActionType
  displayCreatedMissionBanner?: boolean
  engagedControlUnit?: ControlUnit.EngagedControlUnit
  isFormDirty: boolean
  missionForm: AtLeast<Partial<Mission>, 'id'> | Partial<NewMission>
}

type SelectedMissionType = {
  [key: string]: MissionInStateType
}

type SelectedActionType = {
  activeInfractionId?: string
  id?: string
}

type MissionFormsState = {
  activeMissionId: number | string | undefined
  isListeningToEvents: boolean
  missionCenteredControlUnitId: number | undefined
  missions: SelectedMissionType
}

const INITIAL_STATE: MissionFormsState = {
  activeMissionId: undefined,
  isListeningToEvents: true,
  missionCenteredControlUnitId: undefined,
  missions: {}
}

const missionFormsSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'missionForms',
  reducers: {
    deleteSelectedMission(state, action) {
      const missionIdToDelete = action.payload
      if (state.missions) {
        delete state.missions[missionIdToDelete]
      }
      if (state.activeMissionId === missionIdToDelete) {
        state.activeMissionId = undefined
      }
    },
    resetActiveMissionId(state) {
      state.activeMissionId = undefined
      state.missionCenteredControlUnitId = undefined
    },
    resetMissions() {
      return INITIAL_STATE
    },

    setActiveActionId(state, action: PayloadAction<string | undefined>) {
      if (state.activeMissionId) {
        const activeMission = state.missions[state.activeMissionId]
        if (activeMission) {
          activeMission.activeAction = {
            id: action.payload
          }
        }
      }
    },

    setActiveInfractionId(state, action: PayloadAction<string | undefined>) {
      if (state.activeMissionId) {
        const activeMission = state.missions[state.activeMissionId]
        if (activeMission) {
          activeMission.activeAction = {
            ...activeMission.activeAction,
            activeInfractionId: action.payload
          }
        }
      }
    },

    setActiveMissionId(state, action: PayloadAction<number | string>) {
      state.activeMissionId = action.payload
      state.missionCenteredControlUnitId = undefined
    },

    setCreatedMission(state, action: PayloadAction<{ createdMission: MissionInStateType; previousId: string }>) {
      const { previousId } = action.payload
      const createdMissionId = action.payload.createdMission.missionForm.id
      if (!previousId || !createdMissionId) {
        return
      }
      const missionWithPreviousId = state.missions[previousId]
      if (missionWithPreviousId) {
        delete state.missions[previousId]
        state.missions = {
          ...state.missions,
          [createdMissionId]: action.payload.createdMission
        }
      }
      state.activeMissionId = createdMissionId
      state.missionCenteredControlUnitId = undefined
    },
    setEngagedControlUnit(state, action: PayloadAction<ControlUnit.EngagedControlUnit | undefined>) {
      const { activeMissionId } = state

      if (!activeMissionId) {
        return
      }
      const mission = state.missions[activeMissionId]
      if (mission) {
        mission.engagedControlUnit = action.payload
      }
    },
    setIsListeningToEvents(state, action: PayloadAction<boolean>) {
      state.isListeningToEvents = action.payload
    },
    setMission(state, action: PayloadAction<MissionInStateType>) {
      const { id } = action.payload.missionForm
      if (!id) {
        return
      }
      const mission = state.missions[id]
      if (mission) {
        state.missions[id] = { ...mission, ...action.payload }
      } else {
        state.missions = { ...state.missions, [id]: action.payload }
      }
      state.activeMissionId = id
    },
    setMissionCenteredControlUnitId(state, action: PayloadAction<number | undefined>) {
      state.missionCenteredControlUnitId = action.payload
    },
    setShowCreatedBanner(state, action: PayloadAction<{ id: number; showBanner: boolean }>) {
      const { id, showBanner } = action.payload
      const mission = state.missions[id]
      if (mission) {
        mission.displayCreatedMissionBanner = showBanner
      }
    },
    updateUnactiveMission(state, action: PayloadAction<AtLeast<Partial<Mission>, 'id'>>) {
      const { id } = action.payload

      // If the mission is active, hence the form is open, the form will be updated from Formik (see FormikSyncMissionFields.ts)
      if (!id || id === state.activeMissionId) {
        return
      }

      const mission = state.missions[id]
      if (mission) {
        state.missions[id] = {
          ...mission,
          missionForm: {
            // We keep all data not received from the Mission event (see MISSION_EVENT_UNSYNCHRONIZED_PROPERTIES)
            ...mission.missionForm,
            ...action.payload
          } as Mission
        }
      }
    }
  }
})

export const getActiveMission = createSelector(
  (state: MissionFormsState) => state.activeMissionId,
  (state: MissionFormsState) => state.missions,
  (activeMissionId, missions) => (activeMissionId ? missions[activeMissionId] : undefined)
)

export const getNumberOfInfractionTarget = createSelector(
  (state: MissionFormsState) => {
    if (state.activeMissionId) {
      const activeActionId = state.missions[state.activeMissionId]?.activeAction?.id
      const actions = state.missions[state.activeMissionId]?.missionForm?.envActions

      if (activeActionId && actions) {
        const selectedAction = actions.find(action => action.id === activeActionId)
        if (selectedAction && 'infractions' in selectedAction) {
          return selectedAction.infractions
        }
      }
    }

    return undefined
  },

  (selectedInfraction: Infraction[] | NewInfraction[] | undefined) =>
    selectedInfraction?.reduce((sumNbTarget, infraction) => sumNbTarget + (infraction?.nbTarget ?? 0), 0) ?? 0
)

export const missionFormsActions = missionFormsSlice.actions

export const missionFormsSliceReducer = missionFormsSlice.reducer
