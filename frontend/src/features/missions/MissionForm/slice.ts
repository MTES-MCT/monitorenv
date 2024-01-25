import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { Mission, NewMission } from '../../../domain/entities/missions'
import type { AtLeast } from '../../../types'

export type MissionInStateType = {
  isFormDirty: boolean
  missionForm: AtLeast<Partial<Mission>, 'id'> | Partial<NewMission>
}

type SelectedMissionType = {
  [key: string]: MissionInStateType
}

type MissionFormsState = {
  activeMissionId: number | string | undefined
  isListeningToEvents: boolean
  missions: SelectedMissionType
}

const INITIAL_STATE: MissionFormsState = {
  activeMissionId: undefined,
  isListeningToEvents: true,
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
    },
    resetMissions() {
      return INITIAL_STATE
    },
    setActiveMissionId(state, action: PayloadAction<number | string>) {
      state.activeMissionId = action.payload
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
        state.missions[id] = action.payload
      } else {
        state.missions = { ...state.missions, [id]: action.payload }
      }
      state.activeMissionId = id
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
export const missionFormsActions = missionFormsSlice.actions

export const missionFormsSliceReducer = missionFormsSlice.reducer
