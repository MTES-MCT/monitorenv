package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselEntity
import jakarta.persistence.Column
import jakarta.persistence.Id
import jakarta.persistence.MappedSuperclass
import java.math.BigDecimal

@MappedSuperclass
abstract class BaseVesselModel(
    open val batchId: Int?,
    open val category: String?,
    open val commercialName: String?,
    open val flag: String?,
    @Id
    open val id: Int,
    open val isBanned: Boolean,
    @Column(name = "imo_number")
    open val imo: String?,
    open val immatriculation: String?,
    open val leisureType: String?,
    @Column(precision = 5, scale = 2)
    open val length: BigDecimal?,
    @Column(name = "mmsi_number")
    open val mmsi: String?,
    open val ownerLastName: String?,
    open val ownerFirstName: String?,
    open val ownerDateOfBirth: String?,
    open val ownerPostalAddress: String?,
    open val ownerPhone: String?,
    open val ownerEmail: String?,
    open val ownerCompanyName: String?,
    open val ownerNationality: String?,
    open val ownerBusinessSegment: String?,
    open val ownerLegalStatus: String?,
    open val ownerStartDate: String?,
    open val portOfRegistry: String?,
    open val professionalType: String?,
    open val rowNumber: Int?,
    open val shipId: Int,
    open val shipName: String?,
    open val status: String?,
    @Column(name = "ums_gross_tonnage")
    open val umsGrossTonnage: BigDecimal?,
) {
    fun toVessel(
        nafLabel: String? = null,
        legalStatusLabel: String? = null,
    ): VesselEntity =
        VesselEntity(
            id = id,
            batchId = batchId,
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
            positions = mutableListOf(),
            rowNumber = rowNumber,
            umsGrossTonnage = umsGrossTonnage,
        )
}
