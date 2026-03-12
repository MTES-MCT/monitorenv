import React from 'react'

import type { BannerProps } from '@mtes-mct/monitor-ui'

export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>

export type BannerStackItem = {
  id: number
  props: BannerStackItemProps
}
export type BannerStackItemProps = Omit<BannerProps, 'children' | 'onAutoClose' | 'onClose' | 'top'> & {
  children: React.ReactNode
}

export type WindowContext = 'map' | 'sideWindow' | 'backoffice'

export type Environment = 'dev' | 'integration' | 'preprod' | 'prod'

export enum Axis {
  EAST_WEST = 'EAST_WEST',
  NORTH_SOUTH = 'NORTH_SOUTH',
  SOUTH_NORTH = 'SOUTH_NORTH',
  WEST_EAST = 'WEST_EAST'
}

export const AxisLabel: Record<Axis, string> = {
  [Axis.NORTH_SOUTH]: 'Nord-Sud (défaut)',
  [Axis.SOUTH_NORTH]: 'Sud-Nord',
  [Axis.EAST_WEST]: 'Est-Ouest',
  [Axis.WEST_EAST]: 'Ouest-Est'
}
