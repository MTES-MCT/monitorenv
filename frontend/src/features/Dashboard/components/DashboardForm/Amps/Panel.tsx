import { dashboardActions } from '@features/Dashboard/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { forwardRef, type ComponentProps } from 'react'

import { AmpsPanel } from '../components/AmpsPanel'

export const AmpPanel = forwardRef<HTMLDivElement, { layerId: number } & ComponentProps<'div'>>(({ ...props }, ref) => {
  const dispatch = useAppDispatch()

  const close = () => {
    dispatch(dashboardActions.setDashboardPanel())
  }

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <AmpsPanel ref={ref} onClose={close} {...props} />
})
