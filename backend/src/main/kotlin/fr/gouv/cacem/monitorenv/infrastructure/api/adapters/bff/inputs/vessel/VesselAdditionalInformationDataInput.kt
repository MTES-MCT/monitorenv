package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.vessel

import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselAdditionalInformationEntity

data class VesselAdditionalInformationDataInput(
    val id: Int?,
    val batchId: Int?,
    val observations: String?,
    val rowNumber: Int?,
    val shipId: Int,
) {
    fun toVesselAdditionalInformation(): VesselAdditionalInformationEntity =
        VesselAdditionalInformationEntity(
            id = id,
            observations = observations,
        )
}
