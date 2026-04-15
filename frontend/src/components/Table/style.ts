import { LinkButton } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export const TableContainer = styled.div`
  overflow: auto;
  width: fit-content;
  padding-right: 19px;
`
export const TotalResults = styled.h2`
  font-size: 13px;
  margin-top: 32px;
  line-height: 22px;
`
export const ThemesOrTagsContainer = styled.span`
  color: ${p => p.theme.color.charcoal};
  font-weight: 500;
  text-overflow: ellipsis;
  overflow: hidden;
`
export const SubThemesOrSubTagsContainer = styled.span`
  color: ${p => p.theme.color.slateGray};
  font-weight: 400;
`

export const ShowFilters = styled(LinkButton)`
  font-size: 13px;
  color: ${p => p.theme.color.charcoal};

  svg {
    color: ${p => p.theme.color.charcoal} !important;
    height: 20px !important;
    width: 20px !important;
  }
`
