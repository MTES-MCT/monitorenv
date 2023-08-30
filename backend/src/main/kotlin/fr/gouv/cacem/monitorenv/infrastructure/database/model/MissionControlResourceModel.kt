package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.controlResource.ControlResourceEntity
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
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
    var id: Int? = null,
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mission_id")
    var mission: MissionModel,
    @ManyToOne(fetch = FetchType.LAZY, optional = false, cascade = [CascadeType.MERGE])
    @JoinColumn(name = "control_resource_id")
    var ressource: ControlResourceModel,
) {
    companion object {
        fun fromControlResourceEntity(controlResourceEntity: ControlResourceEntity, mission: MissionModel, controlUnitModel: ControlUnitModel) = MissionControlResourceModel(
            ressource = ControlResourceModel(
                id = controlResourceEntity.id,
                name = controlResourceEntity.name,
                controlUnit = controlUnitModel,
            ),
            mission = mission,
        )
    }
}
