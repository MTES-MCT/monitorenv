package fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IFacadeAreasRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.dashboard.SaveDashboard
import fr.gouv.cacem.monitorenv.domain.validators.UseCaseValidation
import fr.gouv.cacem.monitorenv.domain.validators.vigilance_area.VigilanceAreaValidator
import org.slf4j.LoggerFactory

@UseCase
class CreateOrUpdateVigilanceArea(
    private val vigilanceAreaRepository: IVigilanceAreaRepository,
    private val facadeAreasRepository: IFacadeAreasRepository,
) {
    private val logger = LoggerFactory.getLogger(SaveDashboard::class.java)

    fun execute(
        @UseCaseValidation<VigilanceAreaEntity>(validator = VigilanceAreaValidator::class) vigilanceArea:
            VigilanceAreaEntity,
    ): VigilanceAreaEntity {
        logger.info("Attempt to CREATE or UPDATE vigilance area ${vigilanceArea.id}")
        try {
            val seaFront =
                vigilanceArea.geom?.let { nonNullGeom ->
                    facadeAreasRepository.findFacadeFromGeometry(nonNullGeom)
                }

            val savedVigilanceArea = vigilanceAreaRepository.save(vigilanceArea.copy(seaFront = seaFront))
            logger.info("Vigilance area ${savedVigilanceArea.id} created or updated")
            return savedVigilanceArea
        } catch (e: Exception) {
            val errorMessage = "vigilance area ${vigilanceArea.id} couldn't be saved"
            logger.error(errorMessage, e)
            throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_SAVED, message = errorMessage)
        }
    }
}
