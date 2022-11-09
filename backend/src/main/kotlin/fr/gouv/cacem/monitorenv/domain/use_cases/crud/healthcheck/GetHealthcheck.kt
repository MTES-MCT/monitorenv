package fr.gouv.cacem.monitorenv.domain.use_cases.crud.healthcheck

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.health.Health
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.JpaMissionRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.JpaRegulatoryAreaRepository

@UseCase
class GetHealthcheck(
    private val regulatoryAreaRepository: JpaRegulatoryAreaRepository,
    private val missionRepository: JpaMissionRepository
) {
    fun execute(): Health {
        val numberOfRegulatoryAreas = regulatoryAreaRepository.count()
        val numberOfMissions = missionRepository.count()

        return Health(numberOfRegulatoryAreas, numberOfMissions)
    }
}
