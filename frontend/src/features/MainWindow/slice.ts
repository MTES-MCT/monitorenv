import { createSlice } from '@reduxjs/toolkit'

interface MainWindowState {}
const INITIAL_STATE: MainWindowState = {}

const mainWindowSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'mainWindow',
  reducers: {}
})

export const mainWindowActions = mainWindowSlice.actions
export const mainWindowReducer = mainWindowSlice.reducer
