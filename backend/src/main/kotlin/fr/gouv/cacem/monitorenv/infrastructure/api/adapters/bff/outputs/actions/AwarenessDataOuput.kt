package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.actions

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionSurveillance.AwarenessEntity

class AwarenessDataOuput(
    val isRisingAwareness: Boolean?,
    val themeId: Int?,
    val nbPerson: Int?,
) {
    companion object {
        fun fromAwarenessEntity(awarenessEntity: AwarenessEntity): AwarenessDataOuput =
            AwarenessDataOuput(
                isRisingAwareness = awarenessEntity.isRisingAwareness,
                themeId = awarenessEntity.themeId,
                nbPerson = awarenessEntity.nbPerson,
            )
    }
}
