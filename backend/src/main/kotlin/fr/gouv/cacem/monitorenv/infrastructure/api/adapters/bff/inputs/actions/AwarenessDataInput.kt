package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.actions

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionSurveillance.AwarenessEntity

class AwarenessDataInput(
    private val isRisingAwareness: Boolean,
    val details: List<AwarenessDetailsInput>?,
) {
    fun toAwarenessEntity(): AwarenessEntity =
        AwarenessEntity(isRisingAwareness = isRisingAwareness, details = details?.map { it.toAwarenessDetailsEntity() })
}
