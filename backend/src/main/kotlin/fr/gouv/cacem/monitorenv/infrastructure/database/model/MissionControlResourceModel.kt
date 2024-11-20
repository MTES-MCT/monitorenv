package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitResourceEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table

@Entity
@Table(name = "missions_control_resources")
data class MissionControlResourceModel(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    val id: Int? = null,
    @ManyToOne(optional = false)
    @JoinColumn(name = "mission_id")
    val mission: MissionModel,
    @ManyToOne(optional = false)
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
}
