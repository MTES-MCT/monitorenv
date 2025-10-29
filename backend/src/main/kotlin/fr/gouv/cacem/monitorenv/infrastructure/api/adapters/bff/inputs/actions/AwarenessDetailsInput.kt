package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.actions

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionSurveillance.AwarenessDetailsEntity

class AwarenessDetailsInput(
    val themeId: Int,
    val nbPerson: Int,
) {
    fun toAwarenessDetailsEntity() =
        AwarenessDetailsEntity(
            themeId = themeId,
            nbPerson = nbPerson,
        )
}
