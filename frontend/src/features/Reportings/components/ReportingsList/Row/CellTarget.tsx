import {
  ExpandedRowInlineItem,
  ExpandedRowLabel,
  ExpandedRowValue
} from '@components/Table/TableWithSelectableRows/style'
import { vesselAction } from '@features/Vessel/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Button } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { VehicleTypeEnum } from '../../../../../domain/entities/vehicleType'

import type { TargetDetails } from '../../../../../domain/entities/reporting'

export function CellTarget({ target, vehiculeType }: { target: TargetDetails; vehiculeType: string | undefined }) {
  const dispatch = useAppDispatch()

  if (vehiculeType === VehicleTypeEnum.VESSEL) {
    return (
      <StyledList>
        {target.vesselName && (
          <ExpandedRowInlineItem>
            <CustomExpandedRowLabel>Nom : </CustomExpandedRowLabel>
            <ExpandedRowValue>{target.vesselName}</ExpandedRowValue>
          </ExpandedRowInlineItem>
        )}
        {target.mmsi && (
          <ExpandedRowInlineItem>
            <CustomExpandedRowLabel>MMSI : </CustomExpandedRowLabel>
            <ExpandedRowValue>{target.mmsi}</ExpandedRowValue>
          </ExpandedRowInlineItem>
        )}
        {target.imo && (
          <ExpandedRowInlineItem>
            <CustomExpandedRowLabel>IMO : </CustomExpandedRowLabel>
            <ExpandedRowValue>{target.imo}</ExpandedRowValue>
          </ExpandedRowInlineItem>
        )}
        {target.registrationNumber && (
          <ExpandedRowInlineItem>
            <CustomExpandedRowLabel>Immatriculation : </CustomExpandedRowLabel>
            <ExpandedRowValue>{target.registrationNumber}</ExpandedRowValue>
          </ExpandedRowInlineItem>
        )}
        {target.vesselSize && (
          <ExpandedRowInlineItem>
            <CustomExpandedRowLabel>Taille : </CustomExpandedRowLabel>
            <ExpandedRowValue>{`${target.vesselSize} m`}</ExpandedRowValue>
          </ExpandedRowInlineItem>
        )}
        {target.vesselShipId && (
          <li>
            <StyledButton
              accent={Accent.SECONDARY}
              onClick={() =>
                dispatch(
                  vesselAction.setSelectedVesselId({
                    batchId: target.vesselBatchId,
                    rowNumber: target.vesselRowNumber,
                    shipId: target.vesselShipId
                  })
                )
              }
            >
              Voir la fiche navire
            </StyledButton>
          </li>
        )}
      </StyledList>
    )
  }

  if (vehiculeType === VehicleTypeEnum.VEHICLE_LAND) {
    return (
      target.registrationNumber && (
        <ExpandedRowInlineItem key={target.registrationNumber}>
          <CustomExpandedRowLabel>Immatriculation : </CustomExpandedRowLabel>
          <ExpandedRowValue>{target.registrationNumber}</ExpandedRowValue>
        </ExpandedRowInlineItem>
      )
    )
  }

  return null
}

const CustomExpandedRowLabel = styled(ExpandedRowLabel)`
  flex: 0;
`

const StyledButton = styled(Button)`
  margin-top: 8px;
`

const StyledList = styled.ul`
  padding-top: 0;
`
