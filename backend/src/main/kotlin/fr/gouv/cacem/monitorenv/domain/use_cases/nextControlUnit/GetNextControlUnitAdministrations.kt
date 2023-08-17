package fr.gouv.cacem.monitorenv.domain.use_cases.nextControlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitAdministrationEntity
import fr.gouv.cacem.monitorenv.domain.repositories.INextControlUnitAdministrationRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.GetMissions
import org.slf4j.LoggerFactory

@UseCase
class GetNextControlUnitAdministrations(private val nextControlUnitAdministrationRepository: INextControlUnitAdministrationRepository) {
    private val logger = LoggerFactory.getLogger(GetMissions::class.java)

    fun execute(): List<NextControlUnitAdministrationEntity> {
        val nextControlUnitAdministrations = nextControlUnitAdministrationRepository.findAll()

        logger.info("Found ${nextControlUnitAdministrations.size} control unit administrations.")

        return nextControlUnitAdministrations
    }
}
