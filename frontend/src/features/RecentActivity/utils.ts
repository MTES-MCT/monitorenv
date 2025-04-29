import { MAX_CONTROLS, MIN_CONTROLS } from './constants'

export function calculateDotSize(totalControls: number): number {
  const minPixel = Number(import.meta.env.FRONTEND_RECENT_ACTIVITY_MIN_PIXEL)
  const maxPixel = Number(import.meta.env.FRONTEND_RECENT_ACTIVITY_MAX_PIXEL)
  const coefficient = Number(import.meta.env.FRONTEND_RECENT_ACTIVITY_COEFFICIENT)

  return (
    minPixel +
    ((Math.log(totalControls + coefficient) - Math.log(MIN_CONTROLS + coefficient)) /
      (Math.log(MAX_CONTROLS + coefficient) - Math.log(MIN_CONTROLS + coefficient))) *
      (maxPixel - minPixel)
  )
}
