package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.DashboardEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IDashboardRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.DashboardDatasModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.DashboardModel.Companion.fromDashboardEntity
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBAMPRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBBriefingRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlUnitRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBDashboardRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBReportingRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBVigilanceAreaRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaDashboardRepository(
    private val dashboardRepository: IDBDashboardRepository,
    private val briefingRepository: IDBBriefingRepository,
    private val ampRepository: IDBAMPRepository,
    private val controlUnitRepository: IDBControlUnitRepository,
    private val regulatoryAreaRepository: IDBRegulatoryAreaRepository,
    private val reportingRepository: IDBReportingRepository,
    private val vigilanceAreaRepository: IDBVigilanceAreaRepository,
) :
    IDashboardRepository {
    @Transactional
    override fun save(dashboard: DashboardEntity): DashboardEntity {
        dashboard.id?.let { briefingRepository.deleteAllByDashboardId(dashboardId = it) }
        val briefingsToSave: MutableList<DashboardDatasModel> = mutableListOf()
        addAmps(dashboard, briefingsToSave)
        addInseeCode(dashboard, briefingsToSave)
        addReportings(dashboard, briefingsToSave)
        addVigilanceAreas(dashboard, briefingsToSave)
        addRegulatoryAreas(dashboard, briefingsToSave)
        addControlUnits(dashboard, briefingsToSave)
        val dashboardModel = dashboardRepository.save(fromDashboardEntity(dashboard, briefingsToSave))
        return dashboardModel.toDashboardEntity()
    }

    private fun addRegulatoryAreas(
        dashboard: DashboardEntity,
        briefingsToSave: MutableList<DashboardDatasModel>,
    ) {
        dashboard.regulatoryAreas.forEach {
            briefingsToSave.add(
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
        briefingsToSave: MutableList<DashboardDatasModel>,
    ) {
        dashboard.vigilanceAreas.forEach {
            briefingsToSave.add(
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
        briefingsToSave: MutableList<DashboardDatasModel>,
    ) {
        dashboard.reportings.forEach {
            briefingsToSave.add(
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
        briefingsToSave: MutableList<DashboardDatasModel>,
    ) {
        dashboard.inseeCode?.let {
            briefingsToSave.add(
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
        briefingsToSave: MutableList<DashboardDatasModel>,
    ) {
        dashboard.amps.forEach {
            briefingsToSave.add(
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
        briefingsToSave: MutableList<DashboardDatasModel>,
    ) {
        dashboard.controlUnits.forEach {
            briefingsToSave.add(
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
