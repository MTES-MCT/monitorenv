export {}

declare global {
  interface Window {
    env: {
      REACT_APP_CYPRESS_TEST: boolean
      REACT_APP_MISSION_FORM_AUTO_SAVE_ENABLED: string
      REACT_APP_MISSION_FORM_AUTO_UPDATE: string
    }
    store: any
  }
}
