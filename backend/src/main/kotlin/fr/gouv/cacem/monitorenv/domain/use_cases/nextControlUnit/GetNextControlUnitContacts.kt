package fr.gouv.cacem.monitorenv.domain.use_cases.nextControlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.repositories.INextControlUnitContactRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.GetMissions
import org.slf4j.LoggerFactory

@UseCase
class GetNextControlUnitContacts(private val nextControlUnitContactRepository: INextControlUnitContactRepository) {
    private val logger = LoggerFactory.getLogger(GetMissions::class.java)

    fun execute(): List<NextControlUnitContactEntity> {
        val nextControlUnitContacts = nextControlUnitContactRepository.findAll()

        logger.info("Found ${nextControlUnitContacts.size} control unit administrations.")

        return nextControlUnitContacts
    }
}
