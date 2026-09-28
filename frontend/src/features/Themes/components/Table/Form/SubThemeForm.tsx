import { SubThemeTable } from '@features/Themes/components/Table/Form/SubThemeTable'
import { customDayjs } from '@mtes-mct/monitor-ui'
import { FieldArray } from 'formik'
import { useMemo } from 'react'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

import type { ThemeTable } from 'domain/entities/themes'

type ThemeFormProps = { subThemes: ThemeTable[] }
export function SubThemeForm({ subThemes }: ThemeFormProps) {
  const now = customDayjs()

  const subthemesWithIndex = subThemes.map((subTheme, index) => ({ index, ...subTheme }))

  const inProgressSubthemes = useMemo(
    () =>
      subthemesWithIndex.filter(
        subTheme =>
          !subTheme.id ||
          (subTheme.startedAt &&
            now.isAfter(customDayjs(subTheme.startedAt)) &&
            (!subTheme.endedAt || now.isBefore(customDayjs(subTheme.endedAt))))
      ),
    [now, subthemesWithIndex]
  )

  const outOfValiditySubthemes = useMemo(
    () => subthemesWithIndex.filter(subTheme => subTheme.endedAt && now.isAfter(customDayjs(subTheme.endedAt))),
    [now, subthemesWithIndex]
  )

  return (
    <FieldArray
      name="subThemes"
      render={({ push, remove }) => (
        <Wrapper>
          <div>
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
              subThemes={inProgressSubthemes}
            />
          </div>
          {outOfValiditySubthemes.length !== 0 && (
            <div>
              <Subtitle>Sous-thématiques avec une date de validité dépassée</Subtitle>
              <SubThemeTable onDelete={remove} subThemes={outOfValiditySubthemes} />
            </div>
          )}
        </Wrapper>
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`
