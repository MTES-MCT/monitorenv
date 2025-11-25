import styled from 'styled-components'

export const Elem = styled.li``

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  font-size: 13px;
  color: ${p => p.theme.color.gunMetal};
  padding-bottom: 20px;
  padding-left: 12px;
  margin: 0;
`

export const Key = styled.th`
  color: ${p => p.theme.color.slateGray};
  flex: initial;
  display: inline-block;
  margin: 0;
  border: none;
  padding: 6px 10px 5px 0;
  background: none;
  width: max-content;
  line-height: 0.5em;
  height: 0.5em;
  font-size: 13px;
  font-weight: 400;
`

export const Value = styled.td`
  color: ${p => p.theme.color.gunMetal};
  margin: 0;
  text-align: left;
  padding: 1px 5px 5px 5px;
  background: none;
  border: none;
  line-height: normal;
  font-size: 13px;
  font-weight: 500;
`

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  color: ${p => p.theme.color.gunMetal};
  font-size: 13px;
  font-weight: 500;
  padding: 15px 45px 15px 20px;
  text-align: left;
`

export const SectionTitle = styled.span`
  display: flex;
  flex-direction: row;
  color: ${p => p.theme.color.slateGray};
  font-size: 13px;
  align-items: center;
`

export const Fields = styled.table`
  width: inherit;
  display: table;
  margin: 0;
  min-width: 40%;
  line-height: 0.2em;
  padding: unset;
`

export const Field = styled.tr`
  margin: 5px 5px 5px 0;
  border: none;
  background: none;
  line-height: 0.5em;
`

export const NoValue = styled.span`
  color: ${p => p.theme.color.slateGray};
  font-weight: 300;
  line-height: normal;
  font-size: 13px;
  display: block;
`
export const Zone = styled.div`
  margin: 0;
  padding: 10px 5px 9px 16px;
  text-align: left;
  display: flex;
  flex-wrap: wrap;
  border-bottom: 1px solid ${p => p.theme.color.lightGray};
`
export const Body = styled.tbody``

export const Wrapper = styled.div<{ $regulatoryMetadataPanelIsOpen: boolean }>`
  background-color: ${p => p.theme.color.gainsboro};
  border-radius: 2px;
  width: 400px;
  display: block;
  color: ${p => p.theme.color.charcoal};
  opacity: ${p => (p.$regulatoryMetadataPanelIsOpen ? 1 : 0)};
  padding: 0;
  transition: all 0.5s;
  box-shadow: 0 3px 5px #70778540;
`

export const Name = styled.span`
  flex: 1;
  line-height: initial;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 15px;
  margin-left: 5px;
  margin-right: 5px;
`

export const Header = styled.div`
  color: ${p => p.theme.color.gunMetal};
  margin-left: 6px;
  text-align: left;
  height: 40px;
  display: flex;
  font-weight: 500;
  font-size: 15px;
  align-items: center;
  justify-content: center;
  padding: 4px;
`

export const Content = styled.div`
  border-radius: 2px;
  color: ${p => p.theme.color.lightGray};
  background: ${p => p.theme.color.white};
  overflow-y: auto;
  max-height: 72vh;
`
