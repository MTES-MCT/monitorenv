package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.controlResource.ControlUnitEntity
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
@Table(name = "missions_control_units")
data class MissionControlUnitModel(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    val id: Int? = null,
    @Column(name = "contact")
    val contact: String?,
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mission_id")
    val mission: MissionModel,
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "control_unit_id")
    var unit: LegacyControlUnitModel,
) {
    companion object {
        fun fromControlUnitEntity(controlUnitEntity: ControlUnitEntity, mission: MissionModel) =
            MissionControlUnitModel(
                unit = LegacyControlUnitModel(
                    id = controlUnitEntity.id,
                    name = controlUnitEntity.name,
                    isArchived = controlUnitEntity.isArchived,
                    administration = AdministrationModel(name = controlUnitEntity.administration),
                ),
                mission = mission,
                contact = controlUnitEntity.contact,
            )
    }
}
