import { RegulatoryAreasPanel } from '@components/RegulatoryArea/RegulatoryAreasPanel'
import { dashboardActions } from '@features/Dashboard/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { forwardRef, type ComponentProps } from 'react'

type PanelProps = {
  layerId: number
} & ComponentProps<'div'>

export const RegulatoryPanel = forwardRef<HTMLDivElement, PanelProps>(({ layerId, ...props }, ref) => {
  const dispatch = useAppDispatch()

  const close = () => {
    dispatch(dashboardActions.setDashboardPanel())
  }

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <RegulatoryAreasPanel ref={ref} layerId={layerId} onClose={close} {...props} />
})
