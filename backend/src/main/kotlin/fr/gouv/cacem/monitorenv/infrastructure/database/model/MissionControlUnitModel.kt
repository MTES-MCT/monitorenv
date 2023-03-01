package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.controlResources.ControlUnitEntity
import javax.persistence.*

@Entity
@Table(name = "missions_control_units")
data class MissionControlUnitModel(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    var id: Int? = null,
    @Column(name = "contact")
    var contact: String?,
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mission_id")
    var mission: MissionModel,
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "control_unit_id")
    var unit: ControlUnitModel
) {
    companion object {
        fun fromControlUnitEntity(controlUnitEntity: ControlUnitEntity, mission: MissionModel) = MissionControlUnitModel(
            unit = ControlUnitModel(
                id = controlUnitEntity.id,
                name = controlUnitEntity.name,
                isArchived = controlUnitEntity.isArchived,
                administration = AdministrationModel(name = controlUnitEntity.administration)
            ),
            mission = mission,
            contact = controlUnitEntity.contact
        )
    }
}
