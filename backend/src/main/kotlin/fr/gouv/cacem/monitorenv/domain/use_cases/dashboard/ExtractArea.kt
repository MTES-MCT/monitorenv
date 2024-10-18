package fr.gouv.cacem.monitorenv.domain.use_cases.dashboard

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.ExtractedAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IAMPRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IDepartmentAreaRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import org.locationtech.jts.geom.Geometry

@UseCase
class ExtractArea(
    private val departmentAreaRepository: IDepartmentAreaRepository,
    private val reportingRepository: IReportingRepository,
    private val regulatoryAreaRepository: IRegulatoryAreaRepository,
    private val ampRepository: IAMPRepository,
    private val vigilanceAreaRepository: IVigilanceAreaRepository,
) {
    fun execute(geometry: Geometry): ExtractedAreaEntity {
        val inseeCode = departmentAreaRepository.findDepartmentFromGeometry(geometry = geometry)
        val reportings = reportingRepository.findAllIdByGeometry(geometry = geometry)
        val regulatoryAreas = regulatoryAreaRepository.findAllIdByGeometry(geometry = geometry)
        val amps = ampRepository.findAllIdByGeometry(geometry = geometry)
        val vigilanceAreas = vigilanceAreaRepository.findAllIdByGeometry(geometry = geometry)

        return ExtractedAreaEntity(
            inseeCode = inseeCode,
            reportings = reportings,
            regulatoryAreas = regulatoryAreas,
            amps = amps,
            vigilanceAreas = vigilanceAreas,
        )
    }
}
