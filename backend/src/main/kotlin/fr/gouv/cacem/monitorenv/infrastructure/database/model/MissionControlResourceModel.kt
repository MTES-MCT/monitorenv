package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import jakarta.persistence.*

@Entity
@Table(name = "missions_control_resources")
data class MissionControlResourceModel(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    val id: Int? = null,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mission_id")
    val mission: MissionModel,

    @ManyToOne(fetch = FetchType.LAZY, optional = false, cascade = [CascadeType.MERGE])
    @JoinColumn(name = "control_resource_id")
    var resource: ControlUnitResourceModel,
) {
    fun toControlUnitResource(): ControlUnitResourceEntity {
        return ControlUnitResourceEntity(
            id = resource.id,
            baseId = requireNotNull(resource.base.id),
            controlUnitId = requireNotNull(resource.controlUnit.id),
            isArchived = resource.isArchived,
            name = resource.name,
            note = resource.note,
            photo = byteArrayOf(),
            type = resource.type,
        )
    }
}
