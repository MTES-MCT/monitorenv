package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.math.BigDecimal

@Entity
@Table(name = "latest_vessels")
data class VesselModel(
    val batchId: Int?,
    val category: String?,
    val commercialName: String?,
    val flag: String?,
    @Id
    val id: Int,
    val isBanned: Boolean,
    @Column(name = "imo_number")
    val imo: String?,
    val immatriculation: String?,
    val leisureType: String?,
    @Column(precision = 5, scale = 2)
    val length: BigDecimal?,
    @Column(name = "mmsi_number")
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
    val ownerLegalStatus: String?,
    val ownerStartDate: String?,
    val portOfRegistry: String?,
    val professionalType: String?,
    val rowNumber: Int?,
    val shipId: Int?,
    val shipName: String?,
    val status: String?,
) {
    fun toVessel(
        nafLabel: String? = null,
        legalStatusLabel: String? = null,
    ): VesselEntity =
        VesselEntity(
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
            lastPositions = mutableListOf(),
        )
}
