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
export const MapContainer = styled(BaseMap)``
