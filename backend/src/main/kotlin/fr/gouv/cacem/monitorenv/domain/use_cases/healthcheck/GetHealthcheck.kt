@file:Suppress("ktlint:standard:package-name")

package fr.gouv.cacem.monitorenv.domain.use_cases.healthcheck

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.health.Health
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.JpaMissionRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.JpaNatinfRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.JpaRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.JpaReportingRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.JpaSemaphoreRepository

@UseCase
class GetHealthcheck(
    private val regulatoryAreaRepository: JpaRegulatoryAreaRepository,
    private val missionRepository: JpaMissionRepository,
    private val natinfRepository: JpaNatinfRepository,
    private val semaphoreRepository: JpaSemaphoreRepository,
    private val reportingRepository: JpaReportingRepository,
) {
    fun execute(): Health {
        val numberOfRegulatoryAreas = regulatoryAreaRepository.count()
        val numberOfMissions = missionRepository.count()
        val numberOfNatinfs = natinfRepository.count()
        val numberOfSemaphores = semaphoreRepository.count()
        val numberOfReportings = reportingRepository.count()

        return Health(
            numberOfRegulatoryAreas = numberOfRegulatoryAreas,
            numberOfMissions = numberOfMissions,
            numberOfNatinfs = numberOfNatinfs,
            numberOfSemaphores = numberOfSemaphores,
            numberOfReportings = numberOfReportings,
        )
    }
}
