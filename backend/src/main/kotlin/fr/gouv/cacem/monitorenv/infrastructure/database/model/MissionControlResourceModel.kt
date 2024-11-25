package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitResourceEntity
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
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "control_resource_id")
    var resource: ControlUnitResourceModel,
) {
    fun toLegacyControlUnitResource(): LegacyControlUnitResourceEntity {
        return LegacyControlUnitResourceEntity(
            id = requireNotNull(resource.id),
            controlUnitId = requireNotNull(resource.controlUnit.id),
            name = resource.name,
        )
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as MissionControlResourceModel

        if (id != other.id) return false
        if (mission != other.mission) return false
        if (resource != other.resource) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id ?: 0
        result = 31 * result + mission.hashCode()
        result = 31 * result + resource.hashCode()
        return result
    }
}
