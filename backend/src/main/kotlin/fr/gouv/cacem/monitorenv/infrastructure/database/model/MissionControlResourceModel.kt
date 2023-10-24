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
            baseModel: BaseModel,
            missionModel: MissionModel,
            controlUnitModel: ControlUnitModel,
        ) = MissionControlResourceModel(
            ressource = ControlUnitResourceModel(
                id = requireNotNull(controlUnitResource.id),
                base = baseModel,
                controlUnit = controlUnitModel,
                isArchived = controlUnitResource.isArchived,
                name = controlUnitResource.name,
                note = controlUnitResource.note,
                photo = controlUnitResource.photo,
                type = controlUnitResource.type,
            ),
            mission = missionModel,
        )
    }

    fun toControlUnitResource(): ControlUnitResourceEntity {
        return ControlUnitResourceEntity(
            id = ressource.id,
            baseId = requireNotNull(ressource.base.id),
            controlUnitId = requireNotNull(ressource.controlUnit.id),
            isArchived = ressource.isArchived,
            name = ressource.name,
            note = ressource.note,
            photo = byteArrayOf(),
            type = ressource.type,
        )
    }
}
