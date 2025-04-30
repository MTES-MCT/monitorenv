import { Path, Rect, Svg } from '@react-pdf/renderer'

type ExternalLinkProps = {
  color: string
  size: number
}
export function ExternalLink({ color, size }: ExternalLinkProps) {
  return (
    <Svg height={size} style={{ marginTop: 1 }} viewBox="0 0 20 20" width={size}>
      <Rect fill="none" height={size} width={size} />
      <Path d="M16,11v5H4V4H9V2H2V18H18V11Z" fill={color} />
      <Path d="M18,2H11V4h3.586L9.793,8.793l1.414,1.414L16,5.414V9h2V2Z" fill={color} />
    </Svg>
  )
}
