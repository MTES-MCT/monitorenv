package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.actions

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionSurveillance.AwarenessEntity

class AwarenessDataInput(
    private val isRisingAwareness: Boolean,
    val themeId: Int?,
    private val nbPerson: Int?,
) {
    fun toAwarenessEntity(): AwarenessEntity =
        AwarenessEntity(isRisingAwareness = isRisingAwareness, themeId = themeId, nbPerson = nbPerson)
}
