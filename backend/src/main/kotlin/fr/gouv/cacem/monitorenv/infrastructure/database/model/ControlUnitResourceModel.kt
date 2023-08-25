package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonBackReference
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
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
    @JoinColumn(name = "base_id", nullable = false)
    @JsonBackReference
    // TODO Make that non-nullable once all resources will have been attached to a base.
    var base: BaseModel? = null,

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

    @Column(name = "type", nullable = false)
    // TODO Make that non-nullable once all resources will have been attached to a type.
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
        if (base != other.base) return false
        if (controlUnit != other.controlUnit) return false
        if (name != other.name) return false
        if (note != other.note) return false
        if (photo != null) {
            if (other.photo == null) return false
            if (!photo.contentEquals(other.photo)) return false
        } else if (other.photo != null) return false
        if (type != other.type) return false
        if (createdAt != other.createdAt) return false
        if (updatedAt != other.updatedAt) return false

        return true
    }

    companion object {
        fun fromNextControlUnitResourceEntity(
            controlUnitResource: ControlUnitResourceEntity,
            // TODO Make that non-nullable once all resources will have been attached to a base.
            baseModel: BaseModel?,
            controlUnitModel: ControlUnitModel,
        ): ControlUnitResourceModel {
            return ControlUnitResourceModel(
                id = controlUnitResource.id,
                base = baseModel,
                controlUnit = controlUnitModel,
                name = controlUnitResource.name,
                note = controlUnitResource.note,
                photo = controlUnitResource.photo,
                type = controlUnitResource.type?.name,
            )
        }
    }

    override fun hashCode(): Int {
        var result = id ?: 0
        result = 31 * result + (base?.hashCode() ?: 0)
        result = 31 * result + controlUnit.hashCode()
        result = 31 * result + name.hashCode()
        result = 31 * result + (note?.hashCode() ?: 0)
        result = 31 * result + (photo?.contentHashCode() ?: 0)
        result = 31 * result + (type?.hashCode() ?: 0)
        result = 31 * result + (createdAt?.hashCode() ?: 0)
        result = 31 * result + (updatedAt?.hashCode() ?: 0)

        return result
    }

    fun toNextControlUnitResourceEntity(): ControlUnitResourceEntity {
        val controlUnitId = requireNonNull(controlUnit.id)

        return ControlUnitResourceEntity(
            id = id,
            base = null,
            baseId = base?.id,
            controlUnitId,
            name = name,
            note = note,
            photo = photo,
            type = type?.let { ControlUnitResourceType.valueOf(it) },
        )
    }
}
