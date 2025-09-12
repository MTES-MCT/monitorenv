import { G, Line, Path, Rect, Svg } from '@react-pdf/renderer'

type IconProps = {
  color: string
  size: number
}
export function ArrowRight({ color, size }: IconProps) {
  return (
    <Svg height={size} viewBox="0 0 20 20" width={size}>
      <Rect fill="none" height={size} width={size} />

      <G>
        <Path d="M7.5,4.5 L13,10 L7.5,15.5" fill="none" stroke={color} strokeWidth={2} />
        <Line stroke={color} strokeWidth={2} x1={2} x2={13} y1={10} y2={10} />
      </G>
    </Svg>
  )
}
