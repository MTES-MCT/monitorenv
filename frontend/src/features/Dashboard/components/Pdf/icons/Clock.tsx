import { Circle, Line, Svg } from '@react-pdf/renderer'

type IconProps = {
  color: string
  size: number
}

export function Clock({ color, size }: IconProps) {
  const center = size / 2
  const radius = center - 1 // on laisse un petit padding pour le stroke
  const hourLength = center * 0.4
  const minuteLength = center * 0.6

  return (
    <Svg height={size} width={size}>
      <Circle cx={center} cy={center} fill="none" r={radius} stroke={color} strokeWidth="1" />
      <Line stroke={color} strokeWidth="1" x1={center} x2={center} y1={center} y2={hourLength} />
      <Line stroke={color} strokeWidth="1" x1={center} x2={minuteLength} y1={center} y2={center} />
    </Svg>
  )
}
