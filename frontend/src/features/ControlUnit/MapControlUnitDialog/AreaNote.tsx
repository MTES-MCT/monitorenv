// import styled from 'styled-components'

import { FormikTextarea } from '@mtes-mct/monitor-ui'

import { Section } from './shared/Section'

export function AreaNote() {
  return (
    <Section>
      <Section.Title>Secteur d’intervention</Section.Title>
      <Section.Body>
        <FormikTextarea isLabelHidden label="Secteur d’intervention" name="areaNote" />
      </Section.Body>
    </Section>
  )
}
