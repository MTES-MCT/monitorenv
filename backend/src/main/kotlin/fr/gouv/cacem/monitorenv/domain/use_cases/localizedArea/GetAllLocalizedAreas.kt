package fr.gouv.cacem.monitorenv.domain.use_cases.localizedArea

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.localizedArea.LocalizedAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.ILocalizedAreasRepository
import org.slf4j.LoggerFactory

@UseCase
class GetAllLocalizedAreas(
    private val localizedAreaRepository: ILocalizedAreasRepository,
) {
    private val logger = LoggerFactory.getLogger(GetAllLocalizedAreas::class.java)

    fun execute(): List<LocalizedAreaEntity> {
        logger.info("Attempt to GET all localized areas")
        val localizedAreas = localizedAreaRepository.findAll()
        logger.info("Found ${localizedAreas.size} localized areas")

        return localizedAreas
    }
}
