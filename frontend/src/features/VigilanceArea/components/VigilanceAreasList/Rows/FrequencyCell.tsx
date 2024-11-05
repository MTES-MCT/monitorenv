import { VigilanceArea } from '@features/VigilanceArea/types'

export function FrequencyCell({ frequency }: { frequency: string | undefined }) {
  if (!frequency) {
    return <span>-</span>
  }

  return <span>{VigilanceArea.FrequencyLabel[frequency]}</span>
}