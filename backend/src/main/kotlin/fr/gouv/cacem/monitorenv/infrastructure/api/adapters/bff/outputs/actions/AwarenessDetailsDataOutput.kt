package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.actions

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionSurveillance.AwarenessDetailsEntity

data class AwarenessDetailsDataOutput(
    val themeId: Int,
    val nbPerson: Int,
) {
    companion object {
        fun fromAwarenessDetailsEntity(awarenessDetailsEntity: AwarenessDetailsEntity): AwarenessDetailsDataOutput =
            AwarenessDetailsDataOutput(
                themeId = awarenessDetailsEntity.themeId,
                nbPerson = awarenessDetailsEntity.nbPerson,
            )
    }
}
