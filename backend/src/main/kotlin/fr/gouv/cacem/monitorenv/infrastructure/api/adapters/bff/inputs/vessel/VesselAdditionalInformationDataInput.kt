package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.vessel

import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselAdditionalInformationEntity

data class VesselAdditionalInformationDataInput(
    val id: Int?,
    val observations: String?,
) {
    fun toVesselAdditionalInformation(): VesselAdditionalInformationEntity =
        VesselAdditionalInformationEntity(
            id = id,
            observations = observations,
        )
}
