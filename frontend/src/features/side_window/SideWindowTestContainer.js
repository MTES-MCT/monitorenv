import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { sideWindowPaths } from '../../domain/entities/sideWindow'
import { openSideWindowTab } from '../../domain/shared_slices/Global'
import { setSideWindowPath } from '../../components/SideWindowRouter/SideWindowRouter.slice'
import { SideWindow } from './SideWindow'

export const SideWindowTestContainer = () => {
  const dispatch = useDispatch()
  useEffect(()=>{
    dispatch(setSideWindowPath(sideWindowPaths.MISSIONS))
    dispatch(openSideWindowTab(true))
  })
  return (<SideWindow />)
}