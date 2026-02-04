package fr.gouv.cacem.monitorenv.domain.entities.vessels

import fr.gouv.cacem.monitorenv.domain.entities.lastPositions.LastPositionEntity
import java.math.BigDecimal

data class VesselEntity(
    val category: String?,
    val commercialName: String?,
    val flag: String?,
    val id: Int,
    val isBanned: Boolean,
    val imo: String?,
    val immatriculation: String?,
    val leisureType: String?,
    val length: BigDecimal?,
    val mmsi: String?,
    val ownerLastName: String?,
    val ownerFirstName: String?,
    val ownerDateOfBirth: String?,
    val ownerPostalAddress: String?,
    val ownerPhone: String?,
    val ownerEmail: String?,
    val ownerCompanyName: String?,
    val ownerNationality: String?,
    val ownerBusinessSegment: String?,
    val ownerBusinessSegmentLabel: String?,
    val ownerLegalStatus: String?,
    val ownerLegalStatusLabel: String?,
    val ownerStartDate: String?,
    val portOfRegistry: String?,
    val professionalType: String?,
    val shipId: Int?,
    val shipName: String?,
    val status: String?,
    val lastPositions: MutableList<LastPositionEntity>,
)
