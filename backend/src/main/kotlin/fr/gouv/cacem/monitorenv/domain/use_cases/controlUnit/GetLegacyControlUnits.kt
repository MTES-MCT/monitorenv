package fr.gouv.cacem.monitorenv.domain.use_cases.controlResources // ktlint-disable package-name

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.repositories.ILegacyControlUnitRepository
import org.slf4j.LoggerFactory

@UseCase
class GetLegacyControlUnits(private val controlUnitRepository: ILegacyControlUnitRepository) {
    private val logger = LoggerFactory.getLogger(GetLegacyControlUnits::class.java)

    fun execute(): List<LegacyControlUnitEntity> {
        val controlUnits = controlUnitRepository.findAll()
        logger.info("Found ${controlUnits.size} control units")

        return controlUnits
    }
}
