package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonManagedReference
import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.administration.dtos.FullAdministrationDTO
import fr.gouv.cacem.monitorenv.utils.requireIds
import fr.gouv.cacem.monitorenv.utils.requireNotNullList
import jakarta.persistence.*
import java.time.Instant
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp

@Entity
@Table(name = "administrations")
data class AdministrationModel(
    @Id
    @Column(name = "id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Int? = null,

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "administration")
    @JsonManagedReference
    // TODO This shouldn't be nullable but there because of `MissionControlUnitModel.fromControlUnitEntity()`.
    var controlUnits: List<ControlUnitModel>? = null,

    @Column(name = "name", nullable = false, unique = true)
    var name: String,

    @Column(name = "created_at_utc", nullable = false, updatable = false)
    @CreationTimestamp
    var createdAtUtc: Instant? = null,

    @Column(name = "updated_at_utc", nullable = false)
    @UpdateTimestamp
    var updatedAtUtc: Instant? = null,
) {
    companion object {
        fun fromAdministration(
            administration: AdministrationEntity,
            controlUnitModels: List<ControlUnitModel>
        ): AdministrationModel {
            return AdministrationModel(
                id = administration.id,
                controlUnits = controlUnitModels,
                name = administration.name,
            )
        }
    }

    fun toAdministration(): AdministrationEntity {
        return AdministrationEntity(
            id,
            controlUnitIds = requireIds(controlUnits) { it.id },
            name,
        )
    }

    fun toFullAdministration(): FullAdministrationDTO {
        return FullAdministrationDTO(
            id,
            controlUnitIds = requireIds(controlUnits) { it.id },
            // TODO Remove `requireNotNullList()` once `controlUnits` is non-nullable.
            controlUnits = requireNotNullList(controlUnits).map { it.toControlUnit() },
            name,
        )
    }
}

