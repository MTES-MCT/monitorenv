package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs

import fr.gouv.cacem.monitorenv.domain.entities.health.Health

data class HealthDataOutput(
  val numberOfRegulatoryAreas: Long,
  val numberOfMissions: Long
) {
  companion object {
    fun fromHealth(health: Health) = HealthDataOutput(
      numberOfRegulatoryAreas = health.numberOfRegulatoryAreas,
      numberOfMissions = health.numberOfMissions
    )
  }
}
