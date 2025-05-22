import { Circle, Polyline, Svg } from '@react-pdf/renderer'

type IconProps = {
  color: string
  size: number
}

export function Check({ color, size }: IconProps) {
  const center = size / 2
  const radius = center - 1

  const startX = size * 0.3
  const startY = size * 0.5
  const midX = size * 0.45
  const midY = size * 0.65
  const endX = size * 0.7
  const endY = size * 0.35

  const points = `${startX} ${startY} ${midX} ${midY} ${endX} ${endY}`

  return (
    <Svg fill={color} height={size} viewBox={`0 0 ${size} ${size}`} width={size}>
      <Circle cx={center} cy={center} fill="none" r={radius} stroke={color} strokeWidth="1" />
      <Polyline fill="none" points={points} stroke={color} strokeWidth="1" />
    </Svg>
  )
}
