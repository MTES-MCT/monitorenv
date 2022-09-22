export const FEATURE_FLAGS = {
  // enabled if not stated otherwise explicitly
  LOCALIZE_MISSIONS: !(process.env.REACT_APP_FF_LOCALIZE_MISSIONS === 'false'),
  // enabled if not stated otherwise explicitly
  REPORTING: !(process.env.REACT_APP_FF_REPORTING === 'false')
}
