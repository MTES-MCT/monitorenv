import { BackofficeWrapper } from '@features/BackOffice/components/style'
import { BaseMap } from '@features/map/BaseMap'
import styled from 'styled-components'

export const StyledBackofficeWrapper = styled(BackofficeWrapper)`
  display: flex;
  flex: 1;
  flex-direction: row;
  gap: 0;
  overflow: hidden;
  padding: 0;
  position: relative;
`
export const RegulatoryWrapper = styled.div`
  display: flex;
  flex-basis: 50%;
  flex-direction: column;
  overflow-y: auto;
  padding: 24px 40px 0;
`

export const SubTitle = styled.h2`
  border-bottom: ${p => `1px solid ${p.theme.color.lightGray}`};
  font-size: 16px;
  color: ${p => p.theme.color.slateGray};
  padding-top: 10px;
  padding-bottom: 10px;
`

export const SubSubTitle = styled.h3`
  color: ${p => p.theme.color.slateGray};
  font-size: 13px;
  font-weight: 700;
  margin: 0;
  padding: 0;
`

export const MapContainer = styled(BaseMap)``
