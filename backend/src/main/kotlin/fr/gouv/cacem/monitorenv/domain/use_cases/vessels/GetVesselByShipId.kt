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
class GetVesselByShipId(
    private val vesselRepository: IVesselRepository,
    private val aisPositionRepository: IAISPositionRepository,
) {
    private val logger = LoggerFactory.getLogger(GetVesselByShipId::class.java)

    fun execute(
        shipId: Int,
        batchId: Int?,
        rowNumber: Int?,
        from: ZonedDateTime = ZonedDateTime.now().minusHours(12),
        to: ZonedDateTime = ZonedDateTime.now(),
    ): VesselEntity {
        vesselRepository.findVesselByShipId(shipId, batchId, rowNumber)?.let { vessel ->
            logger.info("GET vessel ${vessel.shipId}")
            vessel.mmsi?.let { mmsi ->
                val positions =
                    aisPositionRepository.findAllByMmsiBetweenDates(mmsi.toInt(), from, to)
                vessel.positions.addAll(positions)
            }
            return vessel
        }
        throw BackendUsageException(
            BackendUsageErrorCode.ENTITY_NOT_FOUND,
            "vessel $shipId not found",
        )
    }
}
