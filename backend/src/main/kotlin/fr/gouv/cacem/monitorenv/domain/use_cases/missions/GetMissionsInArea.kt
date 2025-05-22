package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import org.locationtech.jts.geom.Geometry
import org.slf4j.LoggerFactory

@UseCase
class GetMissionsInArea(
    private val missionRepository: IMissionRepository,
) {
    private val logger = LoggerFactory.getLogger(GetMissionsInArea::class.java)

    fun execute(area: Geometry): List<MissionEntity> {
        logger.info("GET missions in area")

        return missionRepository.findAllByGeometry(area)
    }
}
