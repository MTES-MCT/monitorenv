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
    var ressource: ControlUnitResourceModel,
) {
    companion object {
        fun fromControlUnitResource(
            controlUnitResource: ControlUnitResourceEntity,
            missionModel: MissionModel,
            controlUnitModel: ControlUnitModel
        ) = MissionControlResourceModel(
            ressource = ControlUnitResourceModel(
                id = requireNotNull(controlUnitResource.id),
                base = null,
                controlUnit = controlUnitModel,
                name = controlUnitResource.name,
                note = null,
                photo = byteArrayOf(),
                type = null,
            ),
            mission = missionModel,
        )
    }

    fun toControlUnitResource(): ControlUnitResourceEntity {
        return ControlUnitResourceEntity(
            id = ressource.id,
            baseId = null,
            controlUnitId = requireNotNull(ressource.controlUnit.id),
            name = ressource.name,
            note = null,
            photo = byteArrayOf(),
            type = null,
        )
    }
}
