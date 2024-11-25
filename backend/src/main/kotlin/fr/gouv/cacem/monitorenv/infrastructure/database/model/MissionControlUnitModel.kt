package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import jakarta.persistence.*

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
    var unit: ControlUnitModel,
) {
    companion object {
        fun fromLegacyControlUnit(
            legacyControlUnit: LegacyControlUnitEntity,
            missionModel: MissionModel,
        ) = MissionControlUnitModel(
            unit =
                ControlUnitModel(
                    id = legacyControlUnit.id,
                    administration = AdministrationModel(isArchived = false, name = legacyControlUnit.administration),
                    areaNote = null,
                    controlUnitContacts = LinkedHashSet(),
                    controlUnitResources = LinkedHashSet(),
                    isArchived = legacyControlUnit.isArchived,
                    name = legacyControlUnit.name,
                    termsNote = null,
                ),
            mission = missionModel,
            contact = legacyControlUnit.contact,
        )
    }
}
