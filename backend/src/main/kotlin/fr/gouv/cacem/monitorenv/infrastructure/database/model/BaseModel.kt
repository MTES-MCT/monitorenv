package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonManagedReference
import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.base.dtos.FullBaseDTO
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.exceptions.ForeignKeyConstraintException
import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.time.Instant

@Entity
@Table(name = "bases")
data class BaseModel(
    @Id
    @Column(name = "id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int? = null,

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "base")
    @JsonManagedReference
    val controlUnitResources: List<ControlUnitResourceModel> = listOf(),

    @Column(name = "latitude", nullable = false)
    val latitude: Double,

    @Column(name = "longitude", nullable = false)
    val longitude: Double,

    @Column(name = "name", nullable = false, unique = true)
    val name: String,

    @Column(name = "created_at_utc", nullable = false, updatable = false)
    @CreationTimestamp
    val createdAtUtc: Instant? = null,

    @Column(name = "updated_at_utc", nullable = false)
    @UpdateTimestamp
    val updatedAtUtc: Instant? = null
) {
    @PreRemove
    fun canBeDeleted() {
        if (controlUnitResources.isNotEmpty()) {
            throw ForeignKeyConstraintException(
                "Cannot delete base (ID=$id) due to existing relationships."
            )
        }
    }

    companion object {
        /**
         * @param controlUnitResourceModels Return control unit resources relations when provided.
         */
        fun fromBase(
            base: BaseEntity,
            controlUnitResourceModels: List<ControlUnitResourceModel>? = null
        ): BaseModel {
            return BaseModel(
                id = base.id,
                controlUnitResources = controlUnitResourceModels ?: listOf(),
                latitude = base.latitude,
                longitude = base.longitude,
                name = base.name
            )
        }

        /**
         * @param controlUnitResourceModels Return control unit resources relations when provided.
         */
        fun fromFullBase(
            fullBase: FullBaseDTO,
            controlUnitResourceModels: List<ControlUnitResourceModel>? = null
        ): BaseModel {
            return BaseModel(
                id = fullBase.base.id,
                controlUnitResources = controlUnitResourceModels ?: listOf(),
                latitude = fullBase.base.latitude,
                longitude = fullBase.base.longitude,
                name = fullBase.base.name
            )
        }
    }

    fun toBase(): BaseEntity {
        return BaseEntity(
            id,
            latitude,
            longitude,
            name
        )
    }

    fun toFullBase(): FullBaseDTO {
        val controlUnitResourceModels = controlUnitResources

        return FullBaseDTO(
            base = toBase(),
            controlUnitResources = controlUnitResourceModels.map { it.toControlUnitResource() }
        )
    }
}
