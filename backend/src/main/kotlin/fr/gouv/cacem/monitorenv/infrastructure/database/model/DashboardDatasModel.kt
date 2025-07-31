package fr.gouv.cacem.monitorenv.infrastructure.database.model

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
import org.hibernate.annotations.BatchSize
import java.util.UUID

@Entity
@Table(name = "dashboard_datas")
@BatchSize(size = 30)
data class DashboardDatasModel(
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
    @JoinColumn(name = "regulations_cacem_id")
    val regulatoryAreaModel: RegulatoryAreaModel?,
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "control_unit_id")
    val controlUnitModel: ControlUnitModel?,
    @Column(name = "insee_code")
    val inseeCode: String?,
)
