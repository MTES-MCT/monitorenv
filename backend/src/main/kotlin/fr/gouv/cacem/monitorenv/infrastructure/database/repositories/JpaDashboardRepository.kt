package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.DashboardEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IDashboardRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.DashboardDatasModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.DashboardImageModel.Companion.fromDashboardImageEntity
import fr.gouv.cacem.monitorenv.infrastructure.database.model.DashboardModel.Companion.fromDashboardEntity
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBAMPRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlUnitRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBDashboardDatasRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBDashboardImageRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBDashboardRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBReportingRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBVigilanceAreaRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import tools.jackson.databind.json.JsonMapper
import java.util.UUID

@Repository
class JpaDashboardRepository(
    private val dashboardRepository: IDBDashboardRepository,
    private val dashboardDatasRepository: IDBDashboardDatasRepository,
    private val dashboardImageRepository: IDBDashboardImageRepository,
    private val ampRepository: IDBAMPRepository,
    private val controlUnitRepository: IDBControlUnitRepository,
    private val regulatoryAreaRepository: IDBRegulatoryAreaRepository,
    private val reportingRepository: IDBReportingRepository,
    private val vigilanceAreaRepository: IDBVigilanceAreaRepository,
    private val mapper: JsonMapper,
) : IDashboardRepository {
    @Transactional
    override fun save(dashboard: DashboardEntity): DashboardEntity {
        dashboard.id?.let {
            dashboardDatasRepository.deleteAllByDashboardId(dashboardId = it)
            dashboardImageRepository.deleteAllByDashboardId(dashboardId = it)
        }
        val dashboardDatasToSave: MutableList<DashboardDatasModel> = mutableListOf()
        addAmps(dashboard, dashboardDatasToSave)
        addInseeCode(dashboard, dashboardDatasToSave)
        addReportings(dashboard, dashboardDatasToSave)
        addVigilanceAreas(dashboard, dashboardDatasToSave)
        addRegulatoryAreas(dashboard, dashboardDatasToSave)
        addControlUnits(dashboard, dashboardDatasToSave)
        val dashboardImagesToSave = dashboard.images.map { fromDashboardImageEntity(it) }

        val dashboardModel =
            dashboardRepository.saveAndFlush(
                fromDashboardEntity(
                    dashboard,
                    dashboardDatasToSave,
                    dashboardImagesToSave,
                    mapper,
                ),
            )
        return dashboardModel.toDashboardEntity(mapper)
    }

    override fun findAll(): List<DashboardEntity> =
        dashboardRepository.findAllByIsDeletedIsFalse().map {
            it.toDashboardEntity(mapper)
        }

    override fun findById(id: UUID): DashboardEntity? =
        dashboardRepository.findByIdOrNull(id)?.toDashboardEntity(mapper)

    @Transactional
    override fun delete(id: UUID) {
        dashboardRepository.delete(id)
        dashboardDatasRepository.deleteAllByDashboardId(id)
    }

    private fun addRegulatoryAreas(
        dashboard: DashboardEntity,
        dashboardDatasToSave: MutableList<DashboardDatasModel>,
    ) {
        dashboard.regulatoryAreaIds.forEach {
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
        dashboard.vigilanceAreaIds.forEach {
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
        dashboard.reportingIds.forEach {
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
        dashboard.ampIds.forEach {
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
        dashboard.controlUnitIds.forEach {
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
