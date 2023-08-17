package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonManagedReference
import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitAdministrationEntity
import fr.gouv.cacem.monitorenv.utils.requireIds
import jakarta.persistence.*
import java.time.LocalDateTime
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp

@Entity
@Table(name = "control_unit_administrations")
data class ControlUnitAdministrationModel(
    @Id
    @Column(name = "id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Int? = null,

    @OneToMany(cascade = [CascadeType.ALL], fetch = FetchType.LAZY, mappedBy = "controlUnitAdministration")
    @JsonManagedReference
    var controlUnits: List<ControlUnitModel>? = null,

    @Column(name = "name", nullable = false, unique = true)
    var name: String,

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    var createdAt: LocalDateTime? = null,

    @Column(name = "updated_at", nullable = false)
    @UpdateTimestamp
    var updatedAt: LocalDateTime? = null,
) {
    companion object {
        fun fromNextControlUnitAdministrationEntity(
            nextControlUnitAdministrationEntity: NextControlUnitAdministrationEntity,
            controlUnitModels: List<ControlUnitModel>
        ): ControlUnitAdministrationModel {
            return ControlUnitAdministrationModel(
                id = nextControlUnitAdministrationEntity.id,
                controlUnits = controlUnitModels,
                name = nextControlUnitAdministrationEntity.name,
            )
        }
    }

    fun toNextControlUnitAdministrationEntity(): NextControlUnitAdministrationEntity {
        val controlUnitIds = requireIds(controlUnits) { it.id }

        return NextControlUnitAdministrationEntity(
            id = id,
            controlUnitIds,
            name = name,
        )
    }
}

