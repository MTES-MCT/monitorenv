package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonBackReference
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitResourceDTO
import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.time.Instant

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
    var base: BaseModel,

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
    var type: String,

    @Column(name = "created_at_utc", nullable = false, updatable = false)
    @CreationTimestamp
    var createdAtUtc: Instant? = null,

    @Column(name = "updated_at_utc", nullable = false)
    @UpdateTimestamp
    var updatedAtUtc: Instant? = null,
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
        if (createdAtUtc != other.createdAtUtc) return false
        if (updatedAtUtc != other.updatedAtUtc) return false

        return true
    }

    companion object {
        fun fromControlUnitResource(
            controlUnitResource: ControlUnitResourceEntity,
            baseModel: BaseModel,
            controlUnitModel: ControlUnitModel,
        ): ControlUnitResourceModel {
            return ControlUnitResourceModel(
                id = controlUnitResource.id,
                base = baseModel,
                controlUnit = controlUnitModel,
                name = controlUnitResource.name,
                note = controlUnitResource.note,
                photo = controlUnitResource.photo,
                type = controlUnitResource.type.name,
            )
        }
    }

    override fun hashCode(): Int {
        var result = id ?: 0
        result = 31 * result + base.hashCode()
        result = 31 * result + controlUnit.hashCode()
        result = 31 * result + name.hashCode()
        result = 31 * result + (note?.hashCode() ?: 0)
        result = 31 * result + (photo?.contentHashCode() ?: 0)
        result = 31 * result + type.hashCode()
        result = 31 * result + (createdAtUtc?.hashCode() ?: 0)
        result = 31 * result + (updatedAtUtc?.hashCode() ?: 0)

        return result
    }

    fun toControlUnitResource(): ControlUnitResourceEntity {
        return ControlUnitResourceEntity(
            id,
            baseId = requireNotNull(base.id),
            controlUnitId = requireNotNull(controlUnit.id),
            name,
            note,
            photo,
            type = ControlUnitResourceType.valueOf(type),
        )
    }

    fun toFullControlUnitResource(): FullControlUnitResourceDTO {
        return FullControlUnitResourceDTO(
            id,
            base = requireNotNull(base).toBase(),
            baseId = requireNotNull(base.id),
            controlUnit = controlUnit.toControlUnit(),
            controlUnitId = requireNotNull(controlUnit.id),
            name,
            note,
            photo,
            type = ControlUnitResourceType.valueOf(type),
        )
    }
}
