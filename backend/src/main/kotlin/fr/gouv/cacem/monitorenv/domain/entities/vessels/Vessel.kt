package fr.gouv.cacem.monitorenv.domain.entities.vessels

import java.math.BigDecimal

data class Vessel(
    val id: Int,
    val shipId: Int,
    val status: String?,
    val category: String?,
    val isBanned: Boolean,
    val imo: String?,
    val mmsi: String?,
    val immatriculation: String?,
    val shipName: String?,
    val flag: String?,
    val portOfRegistry: String?,
    val professionalType: String?,
    val leisureType: String?,
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
    val ownerBusinessSegment: String?,
    val ownerBusinessSegmentLabel: String?,
    val ownerLegalStatus: String?,
    val ownerLegalStatusLabel: String?,
    val ownerStartDate: String?,
)
