package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonBackReference
import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.utils.requireNonNull
import jakarta.persistence.*
import java.time.LocalDateTime
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp

@Entity
@Table(name = "control_unit_resources")
data class ControlUnitResourceModel(
    @Id
    @Column(name = "id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Int? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "control_unit_id", nullable = false)
    @JsonBackReference
    var controlUnit: ControlUnitModel,

    @Column(name = "name", nullable = false)
    var name: String,

    @Column(name = "note")
    var note: String? = null,

    @Column(name = "photo")
    var photo: ByteArray? = byteArrayOf(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "port_id", nullable = false)
    @JsonBackReference
    // TODO Make that non-nullable once all resources will have been attached to a port via the frontend resources manager?
    var port: PortModel? = null,

    @Column(name = "type", nullable = false)
    // TODO Make that non-nullable once all resources will have been attached to a type via the frontend resources manager?
    var type: String? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    var createdAt: LocalDateTime? = null,

    @Column(name = "updated_at", nullable = false)
    @UpdateTimestamp
    var updatedAt: LocalDateTime? = null,
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as ControlUnitResourceModel

        if (id != other.id) return false
        if (controlUnit != other.controlUnit) return false
        if (name != other.name) return false
        if (note != other.note) return false
        if (photo != null) {
            if (other.photo == null) return false
            if (!photo.contentEquals(other.photo)) return false
        } else if (other.photo != null) return false
        if (port != other.port) return false
        if (type != other.type) return false
        if (createdAt != other.createdAt) return false
        return updatedAt == other.updatedAt
    }

    companion object {
        fun fromNextControlUnitResourceEntity(
            nextControlUnitResourceEntity: NextControlUnitResourceEntity,
            controlUnitModel: ControlUnitModel,
            // TODO Make that non-nullable once all resources will have been attached to a port via the frontend resources manager?
            portModel: PortModel?
        ): ControlUnitResourceModel {
            return ControlUnitResourceModel(
                id = nextControlUnitResourceEntity.id,
                controlUnit = controlUnitModel,
                name = nextControlUnitResourceEntity.name,
                note = nextControlUnitResourceEntity.note,
                photo = nextControlUnitResourceEntity.photo,
                port = portModel,
            )
        }
    }

    override fun hashCode(): Int {
        var result = id ?: 0
        result = 31 * result + controlUnit.hashCode()
        result = 31 * result + name.hashCode()
        result = 31 * result + (note?.hashCode() ?: 0)
        result = 31 * result + (photo?.contentHashCode() ?: 0)
        result = 31 * result + (port?.hashCode() ?: 0)
        result = 31 * result + (type?.hashCode() ?: 0)
        result = 31 * result + (createdAt?.hashCode() ?: 0)
        result = 31 * result + (updatedAt?.hashCode() ?: 0)

        return result
    }

    fun toNextControlUnitResourceEntity(): NextControlUnitResourceEntity {
        val controlUnitId = requireNonNull(controlUnit.id)

        return NextControlUnitResourceEntity(
            id = id,
            controlUnitId,
            name = name,
            note = note,
            photo = photo,
            portId = port?.id,
        )
    }
}
