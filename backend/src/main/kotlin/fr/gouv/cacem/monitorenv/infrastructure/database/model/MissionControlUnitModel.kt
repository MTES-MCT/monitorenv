package fr.gouv.cacem.monitorenv.infrastructure.database.model

import javax.persistence.*

@Entity
@Table(name = "missions_control_units")
data class MissionControlUnitModel(
    @Id
    @Column(name = "id")
    var id: Int,
    @Column(name = "contact")
    var contact: String?,
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mission_id")
    var mission: MissionModel,
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "control_unit_id")
    var units: ControlUnitModel
)
