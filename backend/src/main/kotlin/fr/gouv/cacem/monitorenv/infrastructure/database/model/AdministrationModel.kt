package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonManagedReference
import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.utils.requireIds
import jakarta.persistence.*
import java.time.LocalDateTime
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp

@Entity
@Table(name = "administrations")
data class AdministrationModel(
    @Id
    @Column(name = "id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Int? = null,

    @OneToMany(cascade = [CascadeType.ALL], fetch = FetchType.LAZY, mappedBy = "administration")
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
        fun fromAdministrationEntity(
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

    fun toAdministrationEntity(): AdministrationEntity {
        val controlUnitIds = requireIds(controlUnits) { it.id }

        return AdministrationEntity(
            id = id,
            controlUnitIds,
            name = name,
        )
    }
}

