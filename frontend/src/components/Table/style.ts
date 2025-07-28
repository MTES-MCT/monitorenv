import styled from 'styled-components'

export const TableContainer = styled.div`
  overflow: auto;
  width: fit-content;
  // scroll width (~15px) + 4px
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
`
export const SubThemesOrSubTagsContainer = styled.span`
  color: ${p => p.theme.color.slateGray};
  font-weight: 400;
`
