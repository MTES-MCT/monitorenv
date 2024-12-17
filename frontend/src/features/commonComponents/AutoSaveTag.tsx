import { Tag, THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

type AutoSaveTagProps = {
  isAutoSaveEnabled: boolean
}
export function AutoSaveTag({ isAutoSaveEnabled }: AutoSaveTagProps) {
  return (
    <Wrapper
      backgroundColor={isAutoSaveEnabled ? THEME.color.mediumSeaGreen25 : THEME.color.gainsboro}
      color={isAutoSaveEnabled ? THEME.color.mediumSeaGreen : THEME.color.slateGray}
    >
      {isAutoSaveEnabled ? 'Enregistrement auto. actif' : 'Enregistrement auto. inactif'}
    </Wrapper>
  )
}

const Wrapper = styled(Tag)`
  margin: auto 0px auto 16px;
  vertical-align: middle;
  font-weight: 500;
`
