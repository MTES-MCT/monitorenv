package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefingEntity
import fr.gouv.cacem.monitorenv.infrastructure.database.model.reportings.ReportingModel
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "briefing")
data class BriefingModel(
    @Id
    @Column(name = "id", unique = true, nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID?,
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "dashboard_id")
    var dashboard: DashboardModel?,
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "amp_cacem_id")
    val amp: AMPModel?,
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reportings_id")
    val reportingModel: ReportingModel?,
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vigilance_area_id")
    val vigilanceAreaModel: VigilanceAreaModel?,
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "regulatory_cacem_id")
    val regulatoryAreaModel: RegulatoryAreaModel?,
    @Column(name = "insee_code")
    val inseeCode: String?,
) {
    fun toBriefingEntity(): BriefingEntity {
        return BriefingEntity(
            id = id,
            ampId = amp?.id,
            reportingId = reportingModel?.id,
            inseeCode = inseeCode,
            vigilanceAreaId = vigilanceAreaModel?.id,
            regulatoryAreaId = regulatoryAreaModel?.id,
        )
    }

    companion object {
        fun fromBriefingEntity(
            dashboard: DashboardModel?,
            briefingEntity: BriefingEntity,
            amp: AMPModel?,
            reportingModel: ReportingModel?,
            regulatoryAreaModel: RegulatoryAreaModel?,
            vigilanceAreaModel: VigilanceAreaModel?,
        ): BriefingModel {
            return BriefingModel(
                id = briefingEntity.id,
                dashboard = dashboard,
                amp = amp,
                reportingModel = reportingModel,
                regulatoryAreaModel = regulatoryAreaModel,
                vigilanceAreaModel = vigilanceAreaModel,
                inseeCode = briefingEntity.inseeCode,
            )
        }
    }
}
