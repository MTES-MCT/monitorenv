package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs

import fr.gouv.cacem.monitorenv.domain.entities.health.Health

data class HealthDataOutput(
    val numberOfRegulatoryAreas: Long,
    val numberOfMissions: Long,
    val numberOfNatinfs: Long,
    val numberOfSemaphores: Long,
    val numberOfInfractionsObservationsReports: Long,
) {
    companion object {
        fun fromHealth(health: Health) = HealthDataOutput(
            numberOfRegulatoryAreas = health.numberOfRegulatoryAreas,
            numberOfMissions = health.numberOfMissions,
            numberOfNatinfs = health.numberOfNatinfs,
            numberOfSemaphores = health.numberOfSemaphores,
            numberOfInfractionsObservationsReports = health.numberOfInfractionsObservationsReports,
        )
    }
}
