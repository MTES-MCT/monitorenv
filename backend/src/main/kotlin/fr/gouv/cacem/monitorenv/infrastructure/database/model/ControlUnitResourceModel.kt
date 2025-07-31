package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitResourceDTO
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.Fetch
import org.hibernate.annotations.FetchMode
import org.hibernate.annotations.JdbcType
import org.hibernate.annotations.UpdateTimestamp
import org.hibernate.dialect.PostgreSQLEnumJdbcType
import java.time.Instant

@Entity
@Table(name = "control_unit_resources")
data class ControlUnitResourceModel(
    @Id
    @Column(name = "id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int? = null,
    @ManyToOne(fetch = FetchType.LAZY)
    @Fetch(FetchMode.JOIN)
    @JoinColumn(name = "control_unit_id", nullable = false)
    val controlUnit: ControlUnitModel,
    @Column(name = "is_archived", nullable = false)
    val isArchived: Boolean,
    @Column(name = "name", nullable = false)
    val name: String,
    @Column(name = "note")
    val note: String? = null,
    @Column(name = "photo")
    val photo: ByteArray? = byteArrayOf(),
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "base_id", nullable = false)
    val station: StationModel,
    @Column(name = "type", nullable = false, columnDefinition = "control_unit_resource_type")
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType::class)
    val type: ControlUnitResourceType,
    @Column(name = "created_at_utc", nullable = false, updatable = false)
    @CreationTimestamp
    val createdAtUtc: Instant? = null,
    @Column(name = "updated_at_utc", nullable = false)
    @UpdateTimestamp
    val updatedAtUtc: Instant? = null,
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as ControlUnitResourceModel

        if (id != other.id) return false
        if (controlUnit != other.controlUnit) return false
        if (isArchived != other.isArchived) return false
        if (name != other.name) return false
        if (note != other.note) return false
        if (photo != null) {
            if (other.photo == null) return false
            if (!photo.contentEquals(other.photo)) return false
        } else if (other.photo != null) {
            return false
        }
        if (station != other.station) return false
        if (type != other.type) return false
        if (createdAtUtc != other.createdAtUtc) return false
        if (updatedAtUtc != other.updatedAtUtc) return false

        return true
    }

    companion object {
        fun fromControlUnitResource(
            controlUnitResource: ControlUnitResourceEntity,
            controlUnitModel: ControlUnitModel,
            stationModel: StationModel,
        ): ControlUnitResourceModel =
            ControlUnitResourceModel(
                id = controlUnitResource.id,
                controlUnit = controlUnitModel,
                isArchived = controlUnitResource.isArchived,
                name = controlUnitResource.name,
                note = controlUnitResource.note,
                photo = controlUnitResource.photo,
                station = stationModel,
                type = controlUnitResource.type,
            )
    }

    override fun hashCode(): Int {
        var result = id ?: 0
        result = 31 * result + controlUnit.hashCode()
        result = 31 * result + isArchived.hashCode()
        result = 31 * result + name.hashCode()
        result = 31 * result + (note?.hashCode() ?: 0)
        result = 31 * result + (photo?.contentHashCode() ?: 0)
        result = 31 * result + station.hashCode()
        result = 31 * result + type.hashCode()
        result = 31 * result + (createdAtUtc?.hashCode() ?: 0)
        result = 31 * result + (updatedAtUtc?.hashCode() ?: 0)

        return result
    }

    fun toControlUnitResource(): ControlUnitResourceEntity =
        ControlUnitResourceEntity(
            id,
            controlUnitId = requireNotNull(controlUnit.id),
            isArchived,
            name,
            note,
            photo,
            stationId = requireNotNull(station.id),
            type,
        )

    fun toFullControlUnitResource(): FullControlUnitResourceDTO =
        FullControlUnitResourceDTO(
            station = station.toStation(),
            controlUnit = controlUnit.toControlUnit(),
            controlUnitResource = toControlUnitResource(),
        )

    fun toLegacyControlUnitResource(): LegacyControlUnitResourceEntity =
        LegacyControlUnitResourceEntity(
            id = requireNotNull(id),
            controlUnitId = requireNotNull(controlUnit.id),
            name,
        )

    @Override
    override fun toString(): String =
        this::class.simpleName +
            "(id = $id , controlUnitId = ${controlUnit.id} , isArchived = $isArchived , name = $name , note = $note, name = $name , photo = $photo; stationId = ${station.id}, type = $type)"
}
