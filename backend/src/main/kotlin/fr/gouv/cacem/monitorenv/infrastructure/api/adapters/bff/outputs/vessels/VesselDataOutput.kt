package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.vessels

import fr.gouv.cacem.monitorenv.domain.entities.vessels.Vessel
import java.math.BigDecimal

data class VesselDataOutput(
    val id: Int,
    val status: String?,
    val category: String?,
    val imo: String?,
    val mmsi: String?,
    val immatriculation: String?,
    val shipName: String?,
    val flag: String?,
    val portOfRegistry: String?,
    val professionalType: String?,
    val commercialName: String?,
    val length: BigDecimal?,
    val ownerLastName: String?,
    val ownerFirstName: String?,
    val ownerDateOfBirth: String?,
    val ownerPostalAddress: String?,
    val ownerPhone: String?,
    val ownerEmail: String?,
    val ownerCompanyName: String?,
    val ownerNationality: String?,
    val ownerBusinessSegmentLabel: String?,
    val ownerLegalStatusLabel: String?,
    val ownerStartDate: String?,
) {
    companion object {
        fun fromVessel(vessel: Vessel): VesselDataOutput =
            VesselDataOutput(
                id = vessel.id,
                status = vessel.status,
                category = vessel.category,
                imo = vessel.imo,
                mmsi = vessel.mmsi,
                immatriculation = vessel.immatriculation,
                shipName = vessel.shipName,
                flag = vessel.flag,
                portOfRegistry = vessel.portOfRegistry,
                professionalType = vessel.professionalType,
                commercialName = vessel.commercialName,
                length = vessel.length,
                ownerLastName = vessel.ownerLastName,
                ownerFirstName = vessel.ownerFirstName,
                ownerDateOfBirth = vessel.ownerDateOfBirth,
                ownerPostalAddress = vessel.ownerPostalAddress,
                ownerPhone = vessel.ownerPhone,
                ownerEmail = vessel.ownerEmail,
                ownerCompanyName = vessel.ownerCompanyName,
                ownerNationality = vessel.ownerNationality,
                ownerBusinessSegmentLabel = vessel.ownerBusinessSegmentLabel,
                ownerLegalStatusLabel = vessel.ownerLegalStatusLabel,
                ownerStartDate = vessel.ownerStartDate,
            )
    }
}
