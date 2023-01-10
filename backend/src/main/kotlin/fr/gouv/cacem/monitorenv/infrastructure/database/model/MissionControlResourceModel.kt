package fr.gouv.cacem.monitorenv.infrastructure.database.model

import javax.persistence.*

@Entity
@Table(name = "missions_control_resources")
data class MissionControlResourceModel(
    @Id
    @Column(name = "id")
    var id: Int,
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mission_id")
    var mission: MissionModel,
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "control_resource_id")
    var ressources: ControlResourceModel
)
