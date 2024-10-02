import { StyledTextarea } from './style'

export function InterventionAreaDetails({ notes }: { notes?: string }) {
  return <StyledTextarea isLabelHidden label="Secteur d’intervention" name="areaNote" value={notes} />
}
