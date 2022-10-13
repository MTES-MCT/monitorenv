import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { setSideWindowPath } from '../../components/SideWindowRouter/SideWindowRouter.slice'
import { sideWindowPaths } from '../../domain/entities/sideWindow'
import { openSideWindowTab } from '../../domain/shared_slices/Global'
import { SideWindow } from './SideWindow'

export function SideWindowTestContainer() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setSideWindowPath(sideWindowPaths.MISSIONS))
    dispatch(openSideWindowTab(true))
  })

  return <SideWindow />
}
