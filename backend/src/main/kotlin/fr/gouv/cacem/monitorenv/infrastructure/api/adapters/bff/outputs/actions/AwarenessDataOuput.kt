package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.actions

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionSurveillance.AwarenessEntity

class AwarenessDataOuput(
    val isRisingAwareness: Boolean?,
    val details: List<AwarenessDetailsDataOutput>? = emptyList(),
) {
    companion object {
        fun fromAwarenessEntity(awarenessEntity: AwarenessEntity): AwarenessDataOuput =
            AwarenessDataOuput(
                isRisingAwareness = awarenessEntity.isRisingAwareness,
                details = awarenessEntity.details?.map { AwarenessDetailsDataOutput.fromAwarenessDetailsEntity(it) },
            )
    }
}
