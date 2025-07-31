package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.infrastructure.database.model.reportings.ReportingModel
import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "dashboard_datas")
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
