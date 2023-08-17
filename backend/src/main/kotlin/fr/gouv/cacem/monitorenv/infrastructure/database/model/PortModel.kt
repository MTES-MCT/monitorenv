package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonManagedReference
import fr.gouv.cacem.monitorenv.domain.entities.port.PortEntity
import fr.gouv.cacem.monitorenv.utils.requireIds
import jakarta.persistence.*
import java.time.LocalDateTime
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp

@Entity
@Table(name = "ports")
data class PortModel(
    @Id
    @Column(name = "id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Int? = null,

    @OneToMany(cascade = [CascadeType.ALL], fetch = FetchType.LAZY, mappedBy = "port")
    @JsonManagedReference
    var controlUnitResources: List<ControlUnitResourceModel>,

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
        fun fromPortEntity(
            nextPortEntity: PortEntity,
            controlUnitResourceModels: List<ControlUnitResourceModel>,
        ): PortModel {
            return PortModel(
                id = nextPortEntity.id,
                controlUnitResources = controlUnitResourceModels,
                name = nextPortEntity.name,
            )
        }
    }

    fun toPortEntity(): PortEntity {
        val controlUnitIds = requireIds(controlUnitResources) { it.id }

        return PortEntity(
            id = id,
            controlUnitIds,
            name = name,
        )
    }
}
