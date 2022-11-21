import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { setSideWindowPath, openSideWindowTab } from '../../components/SideWindowRouter/SideWindowRouter.slice'
import { sideWindowPaths, sideWindowMenu } from '../../domain/entities/sideWindow'
import { SideWindow } from './SideWindow'

export function SideWindowTestContainer() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setSideWindowPath(sideWindowPaths.MISSIONS))
    dispatch(openSideWindowTab(sideWindowMenu.MISSIONS.code))
  })

  return <SideWindow />
}
