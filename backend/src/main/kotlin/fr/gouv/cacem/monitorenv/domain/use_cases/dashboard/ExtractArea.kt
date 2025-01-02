package fr.gouv.cacem.monitorenv.domain.use_cases.dashboard

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.ExtractedAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IAMPRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IDepartmentAreaRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import org.locationtech.jts.geom.Geometry
import org.slf4j.LoggerFactory

@UseCase
class ExtractArea(
    private val departmentAreaRepository: IDepartmentAreaRepository,
    private val reportingRepository: IReportingRepository,
    private val regulatoryAreaRepository: IRegulatoryAreaRepository,
    private val ampRepository: IAMPRepository,
    private val vigilanceAreaRepository: IVigilanceAreaRepository,
) {
    private val logger = LoggerFactory.getLogger(ExtractArea::class.java)

    fun execute(geometry: Geometry): ExtractedAreaEntity {
        logger.info("GET extracted area")
        val inseeCode = departmentAreaRepository.findDepartmentFromGeometry(geometry = geometry)
        val reportings = reportingRepository.findAllIdsByGeometry(geometry = geometry)
        val regulatoryAreas = regulatoryAreaRepository.findAllIdsByGeometry(geometry = geometry)
        val amps = ampRepository.findAllIdsByGeometry(geometry = geometry)
        val vigilanceAreas = vigilanceAreaRepository.findAllIdsByGeometry(geometry = geometry)

        return ExtractedAreaEntity(
            inseeCode = inseeCode,
            reportingIds = reportings,
            regulatoryAreaIds = regulatoryAreas,
            ampIds = amps,
            vigilanceAreaIds = vigilanceAreas,
        )
    }
}
