package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.vessels

import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselAdditionalInformationEntity

data class VesselAdditionalInformationDataOutput(
    val id: Int?,
    val observations: String?,
) {
    companion object {
        fun fromVesselAdditionalInformation(
            vesselAdditionalInformation: VesselAdditionalInformationEntity,
        ): VesselAdditionalInformationDataOutput =
            VesselAdditionalInformationDataOutput(
                id = vesselAdditionalInformation.id,
                observations = vesselAdditionalInformation.observations,
            )
    }
}
