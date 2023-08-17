package fr.gouv.cacem.monitorenv.domain.use_cases.nextControlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.repositories.INextControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.GetMissions
import org.slf4j.LoggerFactory

@UseCase
class GetNextControlUnits(private val nextControlUnitRepository: INextControlUnitRepository) {
    private val logger = LoggerFactory.getLogger(GetMissions::class.java)

    fun execute(): List<NextControlUnitEntity> {
        val nextControlUnits = nextControlUnitRepository.findAll()

        logger.info("Found ${nextControlUnits.size} control units.")

        return nextControlUnits
    }
}
