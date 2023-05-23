package fr.gouv.cacem.monitorenv.domain.use_cases.healthcheck // ktlint-disable package-name

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.health.Health
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.JpaMissionRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.JpaNatinfRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.JpaRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.JpaSemaphoreRepository

@UseCase
class GetHealthcheck(
    private val regulatoryAreaRepository: JpaRegulatoryAreaRepository,
    private val missionRepository: JpaMissionRepository,
    private val natinfRepository: JpaNatinfRepository,
    private val semaphoreRepository: JpaSemaphoreRepository
) {
    fun execute(): Health {
        val numberOfRegulatoryAreas = regulatoryAreaRepository.count()
        val numberOfMissions = missionRepository.count()
        val numberOfNatinfs = natinfRepository.count()
        val numberOfSemaphores = semaphoreRepository.count()

        return Health(
            numberOfRegulatoryAreas = numberOfRegulatoryAreas,
            numberOfMissions = numberOfMissions,
            numberOfNatinfs = numberOfNatinfs,
            numberOfSemaphores = numberOfSemaphores
        )
    }
}
