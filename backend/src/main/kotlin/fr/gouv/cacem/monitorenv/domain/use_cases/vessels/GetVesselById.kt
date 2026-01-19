package fr.gouv.cacem.monitorenv.domain.use_cases.vessels

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.ILastPositionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IVesselRepository
import org.slf4j.LoggerFactory

@UseCase
class GetVesselById(
    private val vesselRepository: IVesselRepository,
    private val lastPositionRepository: ILastPositionRepository,
) {
    private val logger = LoggerFactory.getLogger(GetVesselById::class.java)

    fun execute(id: Int): VesselEntity {
        vesselRepository.findVesselById(id)?.let { vessel ->
            logger.info("GET vessel ${vessel.id}")
            vessel.shipId?.let { shipId ->
                val lastPositions = lastPositionRepository.findAll(shipId)
                vessel.lastPositions.addAll(lastPositions)
            }
            return vessel
        }
        throw BackendUsageException(
            BackendUsageErrorCode.ENTITY_NOT_FOUND,
            "vessel $id not found",
        )
    }
}
