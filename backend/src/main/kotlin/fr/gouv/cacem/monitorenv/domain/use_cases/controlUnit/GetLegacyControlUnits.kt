package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import org.slf4j.LoggerFactory

@UseCase
class GetLegacyControlUnits(private val controlUnitRepository: IControlUnitRepository) {
    private val logger = LoggerFactory.getLogger(GetLegacyControlUnits::class.java)

    fun execute(): List<LegacyControlUnitEntity> {
        val controlUnits = controlUnitRepository.findAll()
        logger.info("Found ${controlUnits.size} control units")

        return controlUnits.map { it.toLegacyControlUnit() }
    }
}
