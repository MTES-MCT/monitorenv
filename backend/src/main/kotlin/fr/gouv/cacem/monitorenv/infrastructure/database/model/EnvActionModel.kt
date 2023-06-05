package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonBackReference
import com.fasterxml.jackson.annotation.JsonIdentityInfo
import com.fasterxml.jackson.annotation.ObjectIdGenerators
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.vladmihalcea.hibernate.type.json.JsonBinaryType
import fr.gouv.cacem.monitorenv.domain.entities.missions.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.missions.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.mappers.EnvActionMapper
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import org.hibernate.Hibernate
import org.hibernate.annotations.JdbcType
import org.hibernate.annotations.Type
import org.hibernate.type.descriptor.jdbc.UUIDJdbcType
import org.locationtech.jts.geom.Geometry
import org.n52.jackson.datatype.jts.GeometryDeserializer
import org.n52.jackson.datatype.jts.GeometrySerializer
import java.time.Instant
import java.time.ZoneOffset.UTC
import java.util.UUID

@JsonIdentityInfo(
    generator = ObjectIdGenerators.PropertyGenerator::class,
    property = "id",
)
@Entity
@Table(name = "env_actions")
data class EnvActionModel(
    @Id
    @JdbcType(UUIDJdbcType::class)
    @Column(name = "id", nullable = false, updatable = false, columnDefinition = "uuid")
    var id: UUID,

    @Column(name = "action_start_datetime_utc")
    var actionStartDateTime: Instant? = null,

    @Column(name = "action_end_datetime_utc")
    var actionEndDateTime: Instant? = null,

    @JsonSerialize(using = GeometrySerializer::class)
    @JsonDeserialize(contentUsing = GeometryDeserializer::class)
    @Column(name = "geom")
    var geom: Geometry? = null,

    @Column(name = "action_type")
    @Enumerated(EnumType.STRING)
    var actionType: ActionTypeEnum,

    @Type(JsonBinaryType::class)
    @Column(name = "value", columnDefinition = "jsonb")
    var value: String,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mission_id")
    @JsonBackReference
    var mission: MissionModel,
) {

    fun toActionEntity(mapper: ObjectMapper): EnvActionEntity {
        return EnvActionMapper.getEnvActionEntityFromJSON(
            mapper,
            id,
            actionStartDateTime?.atZone(UTC),
            actionEndDateTime?.atZone(UTC),
            geom,
            actionType,
            value,
        )
    }
    companion object {
        fun fromEnvActionEntity(action: EnvActionEntity, mission: MissionModel, mapper: ObjectMapper) = EnvActionModel(
            id = action.id,
            actionType = action.actionType,
            actionStartDateTime = action.actionStartDateTimeUtc?.toInstant(),
            actionEndDateTime = action.actionEndDateTimeUtc?.toInstant(),
            value = EnvActionMapper.envActionEntityToJSON(mapper, action),
            mission = mission,
            geom = action.geom,
        )
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false
        other as EnvActionModel

        return id == other.id
    }

    override fun hashCode(): Int = javaClass.hashCode()

    @Override
    override fun toString(): String {
        return this::class.simpleName + "(id = $id , geom = $geom , actionStartDateTime = $actionStartDateTime, actionEndDateTime = $actionEndDateTime, actionType = $actionType , value = $value )"
    }
}
