@file:Suppress("ktlint:standard:package-name")

package fr.gouv.cacem.monitorenv.domain.use_cases.healthcheck

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.health.Health
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.INatinfRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.repositories.ISemaphoreRepository

@UseCase
class GetHealthcheck(
    private val regulatoryAreaRepository: IRegulatoryAreaRepository,
    private val missionRepository: IMissionRepository,
    private val natinfRepository: INatinfRepository,
    private val semaphoreRepository: ISemaphoreRepository,
    private val reportingRepository: IReportingRepository,
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
