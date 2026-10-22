import {
  ExpandedRowInlineItem,
  ExpandedRowLabel,
  ExpandedRowValue
} from '@components/Table/TableWithSelectableRows/style'
import { UNKNOWN } from '@components/Table/TableWithSelectableRows/utils'
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
      <ul>
        <ExpandedRowInlineItem>
          <CustomExpandedRowLabel>Nom : </CustomExpandedRowLabel>
          <ExpandedRowValue>{target.vesselName || UNKNOWN}</ExpandedRowValue>
        </ExpandedRowInlineItem>
        <ExpandedRowInlineItem>
          <CustomExpandedRowLabel>MMSI : </CustomExpandedRowLabel>
          <ExpandedRowValue>{target.mmsi || UNKNOWN}</ExpandedRowValue>
        </ExpandedRowInlineItem>
        <ExpandedRowInlineItem>
          <CustomExpandedRowLabel>IMO : </CustomExpandedRowLabel>
          <ExpandedRowValue>{target.imo || UNKNOWN}</ExpandedRowValue>
        </ExpandedRowInlineItem>
        <ExpandedRowInlineItem>
          <CustomExpandedRowLabel>Immatriculation : </CustomExpandedRowLabel>
          <ExpandedRowValue>{target.registrationNumber || UNKNOWN}</ExpandedRowValue>
        </ExpandedRowInlineItem>
        <ExpandedRowInlineItem>
          <CustomExpandedRowLabel>Taille : </CustomExpandedRowLabel>
          <ExpandedRowValue>{target.vesselSize ? `${target.vesselSize} m` : UNKNOWN}</ExpandedRowValue>
        </ExpandedRowInlineItem>
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
      </ul>
    )
  }

  if (vehiculeType === VehicleTypeEnum.VEHICLE_LAND) {
    return (
      <ExpandedRowInlineItem key={target.registrationNumber}>
        <CustomExpandedRowLabel>Immatriculation : </CustomExpandedRowLabel>
        <ExpandedRowValue>{target.registrationNumber || UNKNOWN}</ExpandedRowValue>
      </ExpandedRowInlineItem>
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
