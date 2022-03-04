import { useEffect, useRef, useState } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'

import getHealthcheck from '../domain/use_cases/getHealthcheck'
import getAllRegulatoryLayersByRegTerritory from '../domain/use_cases/getAllRegulatoryLayersByRegTerritory'
import { setRegulatoryLayers } from '../domain/shared_slices/Regulatory'
import { getRegulatoryLayersWithoutTerritory } from '../domain/entities/regulatory'

export const FIVE_MINUTES = 5 * 60 * 1000
export const THIRTY_SECONDS = 30 * 1000

const APIWorker = () => {
  const dispatch = useDispatch()
  const {
    layersTopicsByRegTerritory
  } = useSelector(state => state.regulatory)


  useEffect(() => {
    batch(() => {
      dispatch(getHealthcheck())
      dispatch(getAllRegulatoryLayersByRegTerritory())
    })

    const interval = setInterval(() => {
      batch(() => {
        dispatch(getHealthcheck())
      })

    }, FIVE_MINUTES)

    return () => {
      clearInterval(interval)
    }
  }, [])


  useEffect(() => {
    if (layersTopicsByRegTerritory) {
      const nextRegulatoryLayersWithoutTerritory = getRegulatoryLayersWithoutTerritory(layersTopicsByRegTerritory)
      dispatch(setRegulatoryLayers(nextRegulatoryLayersWithoutTerritory))
    }
  }, [layersTopicsByRegTerritory])


  return null
}

export default APIWorker
