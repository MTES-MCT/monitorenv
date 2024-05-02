import type { BannerProps } from '@mtes-mct/monitor-ui'

export type BannerStackItem = {
  props: BannerStackItemProps
  rank: number
}
export type BannerStackItemProps = Omit<BannerProps, 'onAutoClose' | 'onClose' | 'top'>
