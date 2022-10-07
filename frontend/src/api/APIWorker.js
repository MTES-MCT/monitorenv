import { useEffect } from 'react'
import { batch, useDispatch } from 'react-redux'

import { loadRegulatoryData } from '../domain/use_cases/regulatory/loadRegulatoryData'

export const FIVE_MINUTES = 5 * 60 * 1000
export const THIRTY_SECONDS = 30 * 1000

export function APIWorker() {
  const dispatch = useDispatch()

  useEffect(() => {
    batch(() => {
      dispatch(loadRegulatoryData())
    })

    const interval = setInterval(() => {
      batch(() => {})
    }, FIVE_MINUTES)

    return () => {
      clearInterval(interval)
    }
  }, [dispatch])

  return null
}
