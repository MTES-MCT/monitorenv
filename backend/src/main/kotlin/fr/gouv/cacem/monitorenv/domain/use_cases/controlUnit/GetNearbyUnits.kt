package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

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

    fun execute(
        area: Geometry,
        from: ZonedDateTime?,
        to: ZonedDateTime?,
    ): List<NearbyUnit> {
        logger.info("GET nearby unit in area from $from to $to")

        return controlUnitRepository.findNearbyUnits(area, from, to)
    }
}
