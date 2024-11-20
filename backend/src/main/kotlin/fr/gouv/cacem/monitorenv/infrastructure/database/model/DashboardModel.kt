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
import jakarta.persistence.PrePersist
import jakarta.persistence.PreUpdate
import jakarta.persistence.Table
import org.hibernate.annotations.Fetch
import org.hibernate.annotations.FetchMode
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
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
    var createdAt: ZonedDateTime?,
    var updatedAt: ZonedDateTime?,
    @Column(name = "deleted")
    val isDeleted: Boolean,
    val seaFront: String?,
    @OneToMany(
        mappedBy = "dashboard",
        fetch = FetchType.LAZY,
        cascade = [CascadeType.ALL],
    )
    @Fetch(FetchMode.SUBSELECT)
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
            createdAt = createdAt,
            updatedAt = updatedAt,
            inseeCode = inseeCode,
            ampIds = amps,
            controlUnitIds = controlUnits,
            regulatoryAreaIds = regulatoryAreas,
            reportingIds = reportings,
            vigilanceAreaIds = vigilanceAreas,
            seaFront = seaFront,
            isDeleted = isDeleted,
        )
    }

    fun addDashboardDatas(dashboardDatasModel: DashboardDatasModel) {
        dashboardDatasModel.dashboard = this
        this.dashboardDatas.add(dashboardDatasModel)
    }

    @PrePersist
    private fun prePersist() {
        this.createdAt = ZonedDateTime.now()
    }

    @PreUpdate
    private fun preUpdate() {
        this.updatedAt = ZonedDateTime.now()
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
                    createdAt = dashboardEntity.createdAt,
                    updatedAt = dashboardEntity.updatedAt,
                    seaFront = dashboardEntity.seaFront,
                    dashboardDatas = mutableListOf(),
                    isDeleted = dashboardEntity.isDeleted,
                )
            dashboardDatasModels.forEach {
                dashboardModel.addDashboardDatas(it)
            }
            return dashboardModel
        }
    }
}
