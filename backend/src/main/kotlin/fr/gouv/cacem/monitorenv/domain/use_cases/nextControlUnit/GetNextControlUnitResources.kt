package fr.gouv.cacem.monitorenv.domain.use_cases.nextControlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.repositories.INextControlUnitResourceRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.GetMissions
import org.slf4j.LoggerFactory

@UseCase
class GetNextControlUnitResources(private val nextControlUnitResourceRepository: INextControlUnitResourceRepository) {
    private val logger = LoggerFactory.getLogger(GetMissions::class.java)

    fun execute(): List<NextControlUnitResourceEntity> {
        val nextControlUnitResources = nextControlUnitResourceRepository.findAll()

        logger.info("Found ${nextControlUnitResources.size} control unit administrations.")

        return nextControlUnitResources
    }
}
