package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.health.Health

data class HealthcheckDataOutput(
    val numberOfRegulatoryAreas: Long,
    val numberOfMissions: Long,
    val numberOfNatinfs: Long,
    val numberOfSemaphores: Long,
    val numberOfReportings: Long,
) {
    companion object {
        fun fromHealth(health: Health) = HealthcheckDataOutput(
            numberOfRegulatoryAreas = health.numberOfRegulatoryAreas,
            numberOfMissions = health.numberOfMissions,
            numberOfNatinfs = health.numberOfNatinfs,
            numberOfSemaphores = health.numberOfSemaphores,
            numberOfReportings = health.numberOfReportings,
        )
    }
}
