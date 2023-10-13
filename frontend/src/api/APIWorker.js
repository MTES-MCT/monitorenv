import { useEffect } from 'react'
import { batch } from 'react-redux'

import { loadRegulatoryData } from '../domain/use_cases/regulatory/loadRegulatoryData'
import { useAppDispatch } from '../hooks/useAppDispatch'

export const FIVE_MINUTES = 5 * 60 * 1000
export const THIRTY_SECONDS = 30 * 1000

export function APIWorker() {
  const dispatch = useAppDispatch()

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
