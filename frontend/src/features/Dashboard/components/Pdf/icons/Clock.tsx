import { Circle, Svg } from '@react-pdf/renderer'

type IconProps = {
  color: string
  size: number
}

export function Dot({ color, size }: IconProps) {
  return (
    <Svg height={size} style={{ marginRight: 2, marginTop: 4 }} viewBox={`0 0 ${size} ${size}`} width={size}>
      <Circle cx={size / 2} cy={size / 2} fill={color} r={size / 2} />
    </Svg>
  )
}
