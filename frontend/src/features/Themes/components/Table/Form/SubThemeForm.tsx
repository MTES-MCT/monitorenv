import { SubThemeTable } from '@features/Themes/components/Table/Form/SubThemeTable'
import { FieldArray } from 'formik'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

import type { ThemeTable } from 'domain/entities/themes'

type ThemeFormProps = { subThemes: ThemeTable[] }
export function SubThemeForm({ subThemes }: ThemeFormProps) {
  return (
    <FieldArray
      name="subThemes"
      render={({ push, remove }) => (
        <>
          <Subtitle>Sous-thématiques en cours de validité</Subtitle>
          <SubThemeTable
            onAdd={() =>
              push({
                endedAt: undefined,
                id: undefined,
                name: undefined,
                parentId: undefined,
                rowId: uuidv4(),
                startedAt: undefined,
                subThemes: []
              })
            }
            onDelete={remove}
            subThemes={subThemes}
          />
        </>
      )}
    />
  )
}

const Subtitle = styled.h5`
  color: ${p => p.theme.color.slateGray};
  font-size: 13px;
  font-weight: 400;
  margin-bottom: 16px;
`
