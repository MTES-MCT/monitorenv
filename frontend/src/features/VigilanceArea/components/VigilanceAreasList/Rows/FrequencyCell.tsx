import { VigilanceArea } from '@features/VigilanceArea/types'

export function FrequencyCell({ frequency }: { frequency: VigilanceArea.Frequency | undefined }) {
  if (!frequency) {
    return <span>-</span>
  }

  return <span>{VigilanceArea.FrequencyLabelForList[frequency]}</span>
}
