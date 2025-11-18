package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.vessels.Vessel
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.math.BigDecimal

@Entity
@Table(name = "latest_vessels")
data class VesselModel(
    @Id
    val id: Int,
    val shipId: Int,
    val status: String?,
    val category: String?,
    val isBanned: Boolean,
    @Column(name = "imo_number")
    val imo: String?,
    @Column(name = "mmsi_number")
    val mmsi: String?,
    val immatriculation: String?,
    val shipName: String?,
    val flag: String?,
    val portOfRegistry: String?,
    val professionalType: String?,
    val leisureType: String?,
    val commercialName: String?,
    @Column(precision = 5, scale = 2)
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
    val ownerLegalStatus: String?,
    val ownerStartDate: String?,
    val batchId: Int?,
    val rowNumber: Int?,
) {
    fun toVessel(
        nafLabel: String? = null,
        legalStatusLabel: String? = null,
    ): Vessel =
        Vessel(
            id = id,
            shipId = shipId,
            status = status,
            category = category,
            isBanned = isBanned,
            imo = imo,
            mmsi = mmsi,
            immatriculation = immatriculation,
            shipName = shipName,
            flag = flag,
            portOfRegistry = portOfRegistry,
            leisureType = leisureType,
            professionalType = professionalType,
            commercialName = commercialName,
            length = length,
            ownerLastName = ownerLastName,
            ownerFirstName = ownerFirstName,
            ownerDateOfBirth = ownerDateOfBirth,
            ownerPostalAddress = ownerPostalAddress,
            ownerPhone = ownerPhone,
            ownerEmail = ownerEmail,
            ownerCompanyName = ownerCompanyName,
            ownerNationality = ownerNationality,
            ownerBusinessSegmentLabel = nafLabel,
            ownerBusinessSegment = ownerBusinessSegment,
            ownerLegalStatusLabel = legalStatusLabel,
            ownerLegalStatus = ownerLegalStatus,
            ownerStartDate = ownerStartDate,
        )
}
