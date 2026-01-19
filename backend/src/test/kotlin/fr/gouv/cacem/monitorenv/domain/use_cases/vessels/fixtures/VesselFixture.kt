package fr.gouv.cacem.monitorenv.domain.use_cases.vessels.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselEntity

class VesselFixture {
    companion object {
        fun aVessel(shipId: Int? = 1): VesselEntity =
            VesselEntity(
                id = 1,
                shipId = shipId,
                status = null,
                category = null,
                isBanned = false,
                imo = null,
                mmsi = null,
                immatriculation = null,
                shipName = null,
                flag = null,
                portOfRegistry = null,
                leisureType = null,
                professionalType = null,
                commercialName = null,
                length = null,
                ownerLastName = null,
                ownerFirstName = null,
                ownerDateOfBirth = null,
                ownerPostalAddress = null,
                ownerPhone = null,
                ownerEmail = null,
                ownerCompanyName = null,
                ownerNationality = null,
                ownerBusinessSegment = null,
                ownerBusinessSegmentLabel = null,
                ownerLegalStatus = null,
                ownerLegalStatusLabel = null,
                ownerStartDate = null,
                lastPositions = mutableListOf(),
            )
    }
}
