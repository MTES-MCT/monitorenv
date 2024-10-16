package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.DashboardEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IDashboardRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.DashboardDatasModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.DashboardModel.Companion.fromDashboardEntity
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.*
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Repository
class JpaDashboardRepository(
    private val dashboardRepository: IDBDashboardRepository,
    private val dashboardDatasRepository: IDBDashboardDatasRepository,
    private val ampRepository: IDBAMPRepository,
    private val controlUnitRepository: IDBControlUnitRepository,
    private val regulatoryAreaRepository: IDBRegulatoryAreaRepository,
    private val reportingRepository: IDBReportingRepository,
    private val vigilanceAreaRepository: IDBVigilanceAreaRepository,
) :
    IDashboardRepository {
    @Transactional
    override fun save(dashboard: DashboardEntity): DashboardEntity {
        dashboard.id?.let { dashboardDatasRepository.deleteAllByDashboardId(dashboardId = it) }
        val dashboardDatasToSave: MutableList<DashboardDatasModel> = mutableListOf()
        addAmps(dashboard, dashboardDatasToSave)
        addInseeCode(dashboard, dashboardDatasToSave)
        addReportings(dashboard, dashboardDatasToSave)
        addVigilanceAreas(dashboard, dashboardDatasToSave)
        addRegulatoryAreas(dashboard, dashboardDatasToSave)
        addControlUnits(dashboard, dashboardDatasToSave)
        val dashboardModel = dashboardRepository.saveAndFlush(fromDashboardEntity(dashboard, dashboardDatasToSave))
        return dashboardModel.toDashboardEntity()
    }

    override fun findAll(): List<DashboardEntity> {
        return dashboardRepository.findAll().map { it.toDashboardEntity() }
    }

    override fun findById(id: UUID): DashboardEntity? {
        return dashboardRepository.findByIdOrNull(id)?.toDashboardEntity()
    }

    private fun addRegulatoryAreas(
        dashboard: DashboardEntity,
        dashboardDatasToSave: MutableList<DashboardDatasModel>,
    ) {
        dashboard.regulatoryAreas.forEach {
            dashboardDatasToSave.add(
                DashboardDatasModel(
                    id = null,
                    dashboard = null,
                    amp = null,
                    inseeCode = null,
                    vigilanceAreaModel = null,
                    reportingModel = null,
                    regulatoryAreaModel = regulatoryAreaRepository.getReferenceById(it),
                    controlUnitModel = null,
                ),
            )
        }
    }

    private fun addVigilanceAreas(
        dashboard: DashboardEntity,
        dashboardDatasToSave: MutableList<DashboardDatasModel>,
    ) {
        dashboard.vigilanceAreas.forEach {
            dashboardDatasToSave.add(
                DashboardDatasModel(
                    id = null,
                    dashboard = null,
                    amp = null,
                    inseeCode = null,
                    vigilanceAreaModel = vigilanceAreaRepository.getReferenceById(it),
                    reportingModel = null,
                    regulatoryAreaModel = null,
                    controlUnitModel = null,
                ),
            )
        }
    }

    private fun addReportings(
        dashboard: DashboardEntity,
        dashboardDatasToSave: MutableList<DashboardDatasModel>,
    ) {
        dashboard.reportings.forEach {
            dashboardDatasToSave.add(
                DashboardDatasModel(
                    id = null,
                    dashboard = null,
                    amp = null,
                    inseeCode = null,
                    vigilanceAreaModel = null,
                    reportingModel = reportingRepository.getReferenceById(it),
                    regulatoryAreaModel = null,
                    controlUnitModel = null,
                ),
            )
        }
    }

    private fun addInseeCode(
        dashboard: DashboardEntity,
        dashboardDatasToSave: MutableList<DashboardDatasModel>,
    ) {
        dashboard.inseeCode?.let {
            dashboardDatasToSave.add(
                DashboardDatasModel(
                    id = null,
                    dashboard = null,
                    amp = null,
                    inseeCode = it,
                    vigilanceAreaModel = null,
                    reportingModel = null,
                    regulatoryAreaModel = null,
                    controlUnitModel = null,
                ),
            )
        }
    }

    private fun addAmps(
        dashboard: DashboardEntity,
        dashboardDatasToSave: MutableList<DashboardDatasModel>,
    ) {
        dashboard.amps.forEach {
            dashboardDatasToSave.add(
                DashboardDatasModel(
                    id = null,
                    dashboard = null,
                    amp = ampRepository.getReferenceById(it),
                    inseeCode = null,
                    vigilanceAreaModel = null,
                    reportingModel = null,
                    regulatoryAreaModel = null,
                    controlUnitModel = null,
                ),
            )
        }
    }

    private fun addControlUnits(
        dashboard: DashboardEntity,
        dashboardDatasToSave: MutableList<DashboardDatasModel>,
    ) {
        dashboard.controlUnits.forEach {
            dashboardDatasToSave.add(
                DashboardDatasModel(
                    id = null,
                    dashboard = null,
                    amp = null,
                    inseeCode = null,
                    vigilanceAreaModel = null,
                    reportingModel = null,
                    regulatoryAreaModel = null,
                    controlUnitModel = controlUnitRepository.getReferenceById(it),
                ),
            )
        }
    }
}
