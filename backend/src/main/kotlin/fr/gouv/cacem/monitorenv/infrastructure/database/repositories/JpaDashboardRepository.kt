package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.DashboardEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IDashboardRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.BriefingModel.Companion.fromBriefingEntity
import fr.gouv.cacem.monitorenv.infrastructure.database.model.DashboardModel.Companion.fromDashboardEntity
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBAMPRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBDashboardRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBReportingRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBVigilanceAreaRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaDashboardRepository(
    private val dashboardRepository: IDBDashboardRepository,
    private val ampRepository: IDBAMPRepository,
    private val regulatoryAreaRepository: IDBRegulatoryAreaRepository,
    private val reportingRepository: IDBReportingRepository,
    private val vigilanceAreaRepository: IDBVigilanceAreaRepository,
) :
    IDashboardRepository {
    @Transactional
    override fun save(dashboard: DashboardEntity): DashboardEntity {
        val briefingModels =
            dashboard.briefings.map { briefing ->
                return@map fromBriefingEntity(
                    dashboard = null,
                    briefingEntity = briefing,
                    amp = briefing.ampId?.let { ampRepository.getReferenceById(briefing.ampId) },
                    reportingModel = briefing.reportingId?.let { reportingRepository.getReferenceById(it) },
                    regulatoryAreaModel =
                        briefing.regulatoryAreaId?.let {
                            regulatoryAreaRepository.getReferenceById(
                                it,
                            )
                        },
                    vigilanceAreaModel =
                        briefing.vigilanceAreaId?.let {
                            vigilanceAreaRepository.getReferenceById(
                                it,
                            )
                        },
                )
            }
        val dashboardModel = dashboardRepository.save(fromDashboardEntity(dashboard, briefingModels))
        return dashboardModel.toDashboardEntity()
    }
}
