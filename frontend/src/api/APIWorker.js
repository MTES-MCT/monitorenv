import { useEffect } from 'react'
import { batch, useDispatch } from 'react-redux'

// import getHealthcheck from '../domain/use_cases/getHealthcheck'
import { loadRegulatoryData } from '../domain/use_cases/regulatory/loadRegulatoryData'

export const FIVE_MINUTES = 5 * 60 * 1000
export const THIRTY_SECONDS = 30 * 1000

export function APIWorker() {
  const dispatch = useDispatch()

  useEffect(() => {
    batch(() => {
      // dispatch(getHealthcheck())
      dispatch(loadRegulatoryData())
    })

    const interval = setInterval(() => {
      batch(() => {
        // dispatch(getHealthcheck())
      })
    }, FIVE_MINUTES)

    return () => {
      clearInterval(interval)
    }
  }, [dispatch])

  return null
}
