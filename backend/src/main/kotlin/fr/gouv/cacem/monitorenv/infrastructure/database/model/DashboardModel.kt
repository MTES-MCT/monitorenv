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
import java.util.UUID

@Entity
@Table(name = "dashboard")
data class DashboardModel(
    @Id
    @Column(name = "id", unique = true, nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID?,
    val name: String,
    @OneToMany(
        mappedBy = "dashboard",
        fetch = FetchType.LAZY,
        cascade = [CascadeType.ALL],
    )
    val briefings: MutableList<BriefingModel>,
) {
    fun toDashboardEntity(): DashboardEntity {
        return DashboardEntity(
            id = id,
            name = name,
            briefings = briefings.map { it.toBriefingEntity() },
        )
    }

    fun addBriefing(briefing: BriefingModel) {
        briefing.dashboard = this
        briefings.add(briefing)
    }

    companion object {
        fun fromDashboardEntity(
            dashboardEntity: DashboardEntity,
            briefings: List<BriefingModel>,
        ): DashboardModel {
            val dashboardModel =
                DashboardModel(id = dashboardEntity.id, dashboardEntity.name, briefings = mutableListOf())
            briefings.forEach {
                dashboardModel.addBriefing(it)
            }
            return dashboardModel
        }
    }
}
