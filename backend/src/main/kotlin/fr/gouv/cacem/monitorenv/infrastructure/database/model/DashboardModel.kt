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
        val amps: MutableList<Int> = mutableListOf()
        val regulatoryAreas: MutableList<Int> = mutableListOf()
        val vigilanceAreas: MutableList<Int> = mutableListOf()
        val reportings: MutableList<Int> = mutableListOf()
        var inseeCode: String? = null
        briefings.forEach { briefing ->
            briefing.amp.let {
                if (it?.id != null) {
                    amps.add(it.id)
                }
            }
            briefing.regulatoryAreaModel.let {
                if (it?.id != null) {
                    regulatoryAreas.add(it.id)
                }
            }
            briefing.vigilanceAreaModel.let {
                if (it?.id != null) {
                    vigilanceAreas.add(it.id)
                }
            }
            briefing.reportingModel.let {
                if (it?.id != null) {
                    reportings.add(it.id)
                }
            }
            briefing.inseeCode.let {
                inseeCode = it
            }
        }
        return DashboardEntity(
            id = id,
            name = name,
            inseeCode = inseeCode,
            amps = amps,
            regulatoryAreas = regulatoryAreas,
            vigilanceAreas = vigilanceAreas,
            reportings = reportings,
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
