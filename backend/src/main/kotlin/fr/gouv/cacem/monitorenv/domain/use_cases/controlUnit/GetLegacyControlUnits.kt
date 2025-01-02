package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import org.slf4j.LoggerFactory

@UseCase
class GetLegacyControlUnits(private val controlUnitRepository: IControlUnitRepository) {
    private val logger = LoggerFactory.getLogger(GetLegacyControlUnits::class.java)

    fun execute(): List<LegacyControlUnitEntity> {
        logger.info("Attempt to GET all legacy control units")

        val controlUnits = controlUnitRepository.findAll()
        val controlUnitsWithActiveControlUnitResources =
            controlUnits.map { controlUnit ->
                controlUnit.copy(
                    controlUnitResources =
                        controlUnit.controlUnitResources.filter {
                            !it.controlUnitResource.isArchived
                        },
                )
            }
        logger.info("Found ${controlUnitsWithActiveControlUnitResources.size} legacy control units")

        return controlUnitsWithActiveControlUnitResources.map { it.toLegacyControlUnit() }
    }
}
