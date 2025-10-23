package fr.gouv.cacem.monitorenv.domain.use_cases.vessels.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.vessels.Vessel

class VesselFixture {
    companion object {
        fun aVessel() =
            Vessel(
                id = 1,
                shipId = 1,
                status = null,
                category = null,
                isBanned = false,
                imo = null,
                mmsi = null,
                immatriculation = null,
                shipName = null,
                flag = null,
                portOfRegistry = null,
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
                ownerLegalStatus = null,
                ownerStartDate = null,
            )
    }
}
