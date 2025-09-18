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
