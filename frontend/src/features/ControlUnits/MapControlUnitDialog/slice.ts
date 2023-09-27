import { type PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface MapControlUnitDialog {
  controlUnitId: number | undefined
}

const INITIAL_STATE: MapControlUnitDialog = {
  controlUnitId: undefined
}

const mapControlUnitDialogSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'mapControlUnitDialog',
  reducers: {
    /**
     * Set control unit ID to be loaded in map control unit dialog.
     */
    setControlUnitId(state, action: PayloadAction<number>) {
      state.controlUnitId = action.payload
    }
  }
})

export const mapControlUnitDialogActions = mapControlUnitDialogSlice.actions
export const mapControlUnitDialogReducer = mapControlUnitDialogSlice.reducer
