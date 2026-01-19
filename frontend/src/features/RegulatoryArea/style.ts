import { BackofficeWrapper } from '@features/BackOffice/components/style'
import { BaseMap } from '@features/map/BaseMap'
import styled from 'styled-components'

export const StyledBackofficeWrapper = styled(BackofficeWrapper)`
  display: flex;
  flex-direction: row;
  padding: 0;
  position: relative;
`
export const RegulatoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 24px 40px;
  width: 50%;
`
export const MapContainer = styled(BaseMap)`
  width: 50%;
`
