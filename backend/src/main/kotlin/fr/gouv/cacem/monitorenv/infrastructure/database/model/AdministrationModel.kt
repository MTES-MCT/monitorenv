package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonManagedReference
import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.administration.dtos.FullAdministrationDTO
import fr.gouv.cacem.monitorenv.utils.requireNotNullList
import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.time.Instant

@Entity
@Table(name = "administrations")
data class AdministrationModel(
    @Id
    @Column(name = "id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int? = null,

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "administration")
    @JsonManagedReference
    val controlUnits: List<ControlUnitModel>? = mutableListOf(),

    @Column(name = "is_archived")
    val isArchived: Boolean,

    @Column(name = "name", nullable = false, unique = true)
    val name: String,

    @Column(name = "created_at_utc", nullable = false, updatable = false)
    @CreationTimestamp
    val createdAtUtc: Instant? = null,

    @Column(name = "updated_at_utc", nullable = false)
    @UpdateTimestamp
    val updatedAtUtc: Instant? = null,
) {
    companion object {
        /**
         * @param controlUnitModels Return control units relations when provided.
         */
        fun fromAdministration(
            administration: AdministrationEntity,
            controlUnitModels: List<ControlUnitModel>? = mutableListOf(),
        ): AdministrationModel {
            return AdministrationModel(
                id = administration.id,
                controlUnits = controlUnitModels,
                isArchived = administration.isArchived,
                name = administration.name,
            )
        }
    }

    fun toAdministration(): AdministrationEntity {
        return AdministrationEntity(
            id,
            isArchived,
            name,
        )
    }

    fun toFullAdministration(): FullAdministrationDTO {
        return FullAdministrationDTO(
            administration = toAdministration(),
            controlUnits = requireNotNullList(controlUnits).map { it.toControlUnit() },
        )
    }

    @Override
    override fun toString(): String {
        return this::class.simpleName + "(id = $id , isArchived = $isArchived , name = $name)"
    }
}
