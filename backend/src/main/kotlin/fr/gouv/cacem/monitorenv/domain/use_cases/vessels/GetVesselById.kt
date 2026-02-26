package fr.gouv.cacem.monitorenv.domain.use_cases.vessels

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IAISPositionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IVesselRepository
import org.slf4j.LoggerFactory
import java.time.ZonedDateTime

@UseCase
class GetVesselById(
    private val vesselRepository: IVesselRepository,
    private val aisPositionRepository: IAISPositionRepository,
) {
    private val logger = LoggerFactory.getLogger(GetVesselById::class.java)

    fun execute(
        id: Int,
        from: ZonedDateTime = ZonedDateTime.now().minusHours(12),
        to: ZonedDateTime = ZonedDateTime.now(),
    ): VesselEntity {
        vesselRepository.findVesselById(id)?.let { vessel ->
            logger.info("GET vessel ${vessel.id}")
            vessel.mmsi?.let { mmsi ->
                val positions =
                    aisPositionRepository.findAllByMmsiBetweenDates(mmsi.toInt(), from, to)
                vessel.positions.addAll(positions)
            }
            return vessel
        }
        throw BackendUsageException(
            BackendUsageErrorCode.ENTITY_NOT_FOUND,
            "vessel $id not found",
        )
    }
}
