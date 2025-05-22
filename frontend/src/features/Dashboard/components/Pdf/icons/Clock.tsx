import { Circle, Line, Svg } from '@react-pdf/renderer'

type IconProps = {
  color: string
  dashed?: boolean
  size: number
}

export function Clock({ color, dashed = false, size }: IconProps) {
  const center = size / 2
  const radius = center - 1
  const hourLength = center * 0.4
  const minuteLength = center * 0.6

  return (
    <Svg height={size} width={size}>
      <Circle
        cx={center}
        cy={center}
        fill="none"
        r={radius}
        stroke={color}
        strokeDasharray={dashed ? '1' : ''}
        strokeWidth="1"
      />
      <Line stroke={color} strokeWidth="1" x1={center} x2={center} y1={center} y2={hourLength} />
      <Line stroke={color} strokeWidth="1" x1={center} x2={minuteLength} y1={center} y2={center} />
    </Svg>
  )
}
