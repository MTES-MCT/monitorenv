package fr.gouv.cacem.monitorenv.domain.use_cases.vessels

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.vessels.Vessel
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IVesselRepository
import org.slf4j.LoggerFactory

@UseCase
class GetVesselById(
    private val vesselRepository: IVesselRepository,
) {
    private val logger = LoggerFactory.getLogger(GetVesselById::class.java)

    fun execute(id: Int): Vessel {
        vesselRepository.findVesselById(id)?.let { vessel ->
            logger.info("GET vessel ${vessel.id}")
            return vessel
        }
        throw BackendUsageException(
            BackendUsageErrorCode.ENTITY_NOT_FOUND,
            "vessel $id not found",
        )
    }
}
