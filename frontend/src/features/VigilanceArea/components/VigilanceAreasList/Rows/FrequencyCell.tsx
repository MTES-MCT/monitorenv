import { VigilanceArea } from '@features/VigilanceArea/types'

export function FrequencyCell({ frequency }: { frequency: string }) {
  if (frequency === VigilanceArea.Frequency.NONE) {
    return <span>-</span>
  }

  return <span>{VigilanceArea.FrequencyLabel[frequency]}</span>
}
