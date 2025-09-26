import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { concat, uniq, without } from 'lodash-es'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'localizedArea',
  storage
}

type LocalizedAreaSliceState = {
  selectedLocalizedAreaLayerCode: string | undefined
  showedLocalizedAreaLayerIds: number[]
}
const INITIAL_STATE: LocalizedAreaSliceState = {
  selectedLocalizedAreaLayerCode: undefined,
  showedLocalizedAreaLayerIds: [] as number[]
}

const localizedAreaSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'localizedArea',
  reducers: {
    hideLocalizedAreaLayer(state, action: PayloadAction<number[]>) {
      state.showedLocalizedAreaLayerIds = without(state.showedLocalizedAreaLayerIds, ...action.payload)
    },
    setSelectedLocalizedAreaLayerCode(state, action) {
      state.selectedLocalizedAreaLayerCode = action.payload
    },
    showLocalizedAreaLayer(state, action: PayloadAction<number[]>) {
      state.showedLocalizedAreaLayerIds = uniq(concat(state.showedLocalizedAreaLayerIds, ...action.payload))
    }
  }
})

export const localizedAreaActions = localizedAreaSlice.actions

export const localizedAreaSlicePersistedReducer = persistReducer(persistConfig, localizedAreaSlice.reducer)
