package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.NearbyUnit
import org.locationtech.jts.geom.Geometry
import org.slf4j.LoggerFactory
import java.time.ZonedDateTime

@UseCase
class GetNearbyUnits(
    private val controlUnitRepository: IControlUnitRepository,
) {
    private val logger = LoggerFactory.getLogger(GetNearbyUnits::class.java)

    fun execute(area: Geometry, startedAfter: ZonedDateTime?, startedBefore: ZonedDateTime?): List<NearbyUnit> {
        logger.info("GET nearby unit in area")

        return controlUnitRepository.findNearbyUnits(area, startedAfter, startedBefore)
    }
}
