package fr.gouv.cacem.monitorenv.domain.use_cases.departmentArea

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IDepartmentAreaRepository
import org.locationtech.jts.geom.MultiPolygon
import org.slf4j.LoggerFactory

@UseCase
class GetRegionArea(
    private val departmentAreaRepository: IDepartmentAreaRepository,
) {
    private val logger = LoggerFactory.getLogger(GetRegionArea::class.java)

    fun execute(departmentsIds: List<String>): MultiPolygon? {
        logger.info("Attempt to GET region area")
        val regionArea = departmentAreaRepository.findRegionFromDepartmentIds(departmentsIds)
        logger.info("Found regionArea")

        return regionArea
    }
}
