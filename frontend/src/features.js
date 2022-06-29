export const FEATURE_FLAGS = {
  REPORTING: !(process.env.REACT_APP_FF_REPORTING==='false'), // enabled if not stated otherwise explicitly
  LOCALIZE_MISSIONS: !(process.env.REACT_APP_FF_LOCALIZE_MISSIONS==='false'), // enabled if not stated otherwise explicitly
}