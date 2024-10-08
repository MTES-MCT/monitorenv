package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.DashboardEntity
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import org.locationtech.jts.geom.Geometry
import java.util.UUID

@Entity
@Table(name = "dashboard")
data class DashboardModel(
    @Id
    @Column(name = "id", unique = true, nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID?,
    val name: String,
    val geom: Geometry,
    val comments: String?,
    @OneToMany(
        mappedBy = "dashboard",
        fetch = FetchType.LAZY,
        cascade = [CascadeType.ALL],
    )
    val dashboardDatas: MutableList<DashboardDatasModel>,
) {
    fun toDashboardEntity(): DashboardEntity {
        val amps: MutableList<Int> = mutableListOf()
        val regulatoryAreas: MutableList<Int> = mutableListOf()
        val vigilanceAreas: MutableList<Int> = mutableListOf()
        val reportings: MutableList<Int> = mutableListOf()
        val controlUnits: MutableList<Int> = mutableListOf()
        var inseeCode: String? = null
        dashboardDatas.forEach { datas ->
            datas.amp.let {
                if (it?.id != null) {
                    amps.add(it.id)
                }
            }
            datas.regulatoryAreaModel.let {
                if (it?.id != null) {
                    regulatoryAreas.add(it.id)
                }
            }
            datas.vigilanceAreaModel.let {
                if (it?.id != null) {
                    vigilanceAreas.add(it.id)
                }
            }
            datas.reportingModel.let {
                if (it?.id != null) {
                    reportings.add(it.id)
                }
            }
            datas.controlUnitModel.let {
                if (it?.id != null) {
                    controlUnits.add(it.id)
                }
            }
            if (datas.inseeCode != null) {
                inseeCode = datas.inseeCode
            }
        }
        return DashboardEntity(
            id = id,
            name = name,
            geom = geom,
            comments = comments,
            inseeCode = inseeCode,
            amps = amps,
            controlUnits = controlUnits,
            regulatoryAreas = regulatoryAreas,
            reportings = reportings,
            vigilanceAreas = vigilanceAreas,
        )
    }

    fun addBriefing(dashboardDatasModel: DashboardDatasModel) {
        dashboardDatasModel.dashboard = this
        this.dashboardDatas.add(dashboardDatasModel)
    }

    companion object {
        fun fromDashboardEntity(
            dashboardEntity: DashboardEntity,
            dashboardDatasModels: List<DashboardDatasModel>,
        ): DashboardModel {
            val dashboardModel =
                DashboardModel(
                    id = dashboardEntity.id,
                    name = dashboardEntity.name,
                    geom = dashboardEntity.geom,
                    comments = dashboardEntity.comments,
                    dashboardDatas = mutableListOf(),
                )
            dashboardDatasModels.forEach {
                dashboardModel.addBriefing(it)
            }
            return dashboardModel
        }
    }
}
