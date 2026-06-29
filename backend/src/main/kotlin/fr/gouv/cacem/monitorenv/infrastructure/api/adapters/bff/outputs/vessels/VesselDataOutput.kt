package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.vessels

import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.positions.PositionOutput
import java.math.BigDecimal

data class VesselDataOutput(
    val id: Int,
    val additionalInformation: VesselAdditionalInformationDataOutput?,
    val batchId: Int?,
    val category: String?,
    val commercialName: String?,
    val files: List<VesselFileDataOutput>,
    val flag: String?,
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
    val ownerBusinessSegmentLabel: String?,
    val ownerLegalStatusLabel: String?,
    val ownerStartDate: String?,
    val positions: List<PositionOutput>,
    val portOfRegistry: String?,
    val professionalType: String?,
    val status: String?,
    val shipId: Int,
    val shipName: String?,
    val rowNumber: Int?,
    val umsGrossTonnage: BigDecimal?,
) {
    companion object {
        fun fromVessel(vessel: VesselEntity): VesselDataOutput =
            VesselDataOutput(
                id = vessel.id,
                additionalInformation =
                    vessel.additionalInformation?.let {
                        VesselAdditionalInformationDataOutput.fromVesselAdditionalInformation(it)
                    },
                batchId = vessel.batchId,
                category = vessel.category,
                commercialName = vessel.commercialName,
                imo = vessel.imo,
                immatriculation = vessel.immatriculation,
                files = vessel.files.map { VesselFileDataOutput.fromVesselFile(it) },
                flag = vessel.flag,
                leisureType = vessel.leisureType,
                length = vessel.length,
                mmsi = vessel.mmsi,
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
                portOfRegistry = vessel.portOfRegistry,
                positions = vessel.positions.map { PositionOutput.toPositionOutput(it) },
                professionalType = vessel.professionalType,
                rowNumber = vessel.rowNumber,
                shipId = vessel.shipId,
                shipName = vessel.shipName,
                status = vessel.status,
                umsGrossTonnage = vessel.umsGrossTonnage,
            )
    }
}
