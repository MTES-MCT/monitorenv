import { describe, expect, it } from '@jest/globals'

import { getTargetDetailsAsText, sortTargetDetails } from './utils'
import { ReportingTargetTypeEnum } from '../../domain/entities/targetType'
import { VehicleTypeEnum } from '../../domain/entities/vehicleType'

const reporting1 = {
  description: "Avec super description un peu longue mais qui vaut le coup d'oeil",
  targetDetails: [{}],
  targetType: ReportingTargetTypeEnum.OTHER,
  vehicleType: undefined
}
const reporting2 = {
  description: undefined,
  targetDetails: [
    {
      mmsi: '123456789',
      vesselName: 'Nom du véhicule'
    }
  ],
  targetType: ReportingTargetTypeEnum.VEHICLE,
  vehicleType: VehicleTypeEnum.VEHICLE_AIR
}

const reporting4 = {
  description: undefined,
  targetDetails: [
    {
      mmsi: '123456789',
      vesselName: 'Nom du véhicule1'
    },
    {
      mmsi: '',
      vesselName: 'Nom du véhicule2'
    }
  ],
  targetType: ReportingTargetTypeEnum.VEHICLE,
  vehicleType: VehicleTypeEnum.VESSEL
}

const reporting3 = {
  description: undefined,
  targetDetails: [
    {
      operatorName: 'Nom de la société',
      vesselName: 'Personne contrôlée'
    }
  ],
  targetType: ReportingTargetTypeEnum.COMPANY,
  vehicleType: undefined
}

describe('reporting', () => {
  it('getTargetDetailsAsText should return target as text or generic value', async () => {
    // When
    const targetAsTextReporting1 = getTargetDetailsAsText(reporting1)
    const targetAsTextReporting2 = getTargetDetailsAsText(reporting2)
    const targetAsTextReporting3 = getTargetDetailsAsText(reporting3)
    const targetAsTextReporting4 = getTargetDetailsAsText(reporting4)

    // Then
    expect(targetAsTextReporting1).toEqual("Avec super description un peu longue mais qui vaut le coup d'oeil")
    expect(targetAsTextReporting2).toEqual('Nom du véhicule')
    expect(targetAsTextReporting3).toEqual('Nom de la société')
    expect(targetAsTextReporting4).toEqual('2 Véhicules')
  })

  it('sortTargetDetails should sort aphabetically target', async () => {
    // When
    const firstSortedReportings = sortTargetDetails(reporting1, reporting2)
    const secondSortedReportings = sortTargetDetails(reporting3, reporting4)

    // Then
    // reporting1 display "Autre" and reporting2 display "Nom du véhicule"
    // so the sort function return -1 to display reporting1 first
    expect(firstSortedReportings).toEqual(-1)

    // reporting3 display "Nom de la société" and reporting4 display "2 Véhicules"
    // so the sort function return 1 to display reporting4 first
    expect(secondSortedReportings).toEqual(1)
  })
})
