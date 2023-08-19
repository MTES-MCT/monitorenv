import type { Option } from '@mtes-mct/monitor-ui'

export function getOptionsFromIdAndName(
  collection:
    | Array<{
        id: number
        name: string
      }>
    | undefined
): Array<Option<number>> | undefined {
  return collection?.map(({ id, name }) => ({
    label: name,
    value: id
  }))
}
