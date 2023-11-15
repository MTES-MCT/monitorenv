import { useEffect } from 'react'
import { batch } from 'react-redux'

import { FIVE_MINUTES } from '../constants'
import { loadRegulatoryData } from '../domain/use_cases/regulatory/loadRegulatoryData'
import { useAppDispatch } from '../hooks/useAppDispatch'

export const THIRTY_SECONDS = 30 * 1000

export function APIWorker() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    batch(() => {
      dispatch(loadRegulatoryData())
    })

    const interval = window.setInterval(() => {
      batch(() => {})
    }, FIVE_MINUTES)

    return () => {
      window.clearInterval(interval)
    }
  }, [dispatch])

  return null
}
