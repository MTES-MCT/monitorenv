package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.DashboardEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.LinkEntity
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType
import jakarta.persistence.*
import org.hibernate.annotations.Fetch
import org.hibernate.annotations.FetchMode
import org.hibernate.annotations.Type
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.*

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
    @OneToMany(
        mappedBy = "dashboard",
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
        fetch = FetchType.LAZY,
    )
    @Fetch(FetchMode.SUBSELECT)
    var images: MutableList<DashboardImageModel> = mutableListOf(),
    @Column(name = "links", columnDefinition = "jsonb")
    @Type(JsonBinaryType::class)
    val links: List<LinkEntity>?,
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
            images = images.map { it.toDashboardImage() },
            links = links,
        )
    }

    fun addDashboardDatas(dashboardDatasModel: DashboardDatasModel) {
        dashboardDatasModel.dashboard = this
        this.dashboardDatas.add(dashboardDatasModel)
    }

    fun addDashboardImages(dashboardImageModel: DashboardImageModel) {
        dashboardImageModel.dashboard = this
        this.images.add(dashboardImageModel)
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
            dashboardImagesModels: List<DashboardImageModel>,
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
                    links = dashboardEntity.links,
                )
            dashboardDatasModels.forEach { dashboardModel.addDashboardDatas(it) }
            dashboardImagesModels.forEach { dashboardModel.addDashboardImages(it) }

            return dashboardModel
        }
    }
}
