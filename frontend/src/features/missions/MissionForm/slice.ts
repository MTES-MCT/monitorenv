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

type MissionForms = {
  activeMissionId: number | string | undefined
  missions: SelectedMissionType
}

const INITIAL_STATE: MissionForms = {
  activeMissionId: undefined,
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
    }
  }
})
export const missionFormsActions = missionFormsSlice.actions

export const missionFormsSliceReducer = missionFormsSlice.reducer
