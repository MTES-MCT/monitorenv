package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.*
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.vladmihalcea.hibernate.type.json.JsonBinaryType
import fr.gouv.cacem.monitorenv.domain.entities.missions.*
import fr.gouv.cacem.monitorenv.domain.mappers.EnvActionMapper
import org.hibernate.Hibernate
import org.hibernate.annotations.NaturalId
import org.hibernate.annotations.Type
import org.hibernate.annotations.TypeDef
import org.hibernate.annotations.TypeDefs
import org.locationtech.jts.geom.MultiPoint
import org.n52.jackson.datatype.jts.GeometryDeserializer
import org.n52.jackson.datatype.jts.GeometrySerializer
import java.time.Instant
import java.time.ZoneOffset.UTC
import java.util.*
import javax.persistence.*

@JsonIdentityInfo(
    generator = ObjectIdGenerators.PropertyGenerator::class,
    property = "id"
)
@Entity
@TypeDefs(
    TypeDef(
        name = "jsonb",
        typeClass = JsonBinaryType::class
    )
)
@Table(name = "env_actions")
data class EnvActionModel(
    @Id
    @NaturalId
    @Column(name = "id")
    var id: UUID,

    @Column(name = "action_start_datetime_utc")
    var actionStartDateTime: Instant? = null,

    @JsonSerialize(using = GeometrySerializer::class)
    @JsonDeserialize(contentUsing = GeometryDeserializer::class)
    @Column(name = "geom")
    var geom: MultiPoint? = null,

    @Column(name = "action_type")
    @Enumerated(EnumType.STRING)
    var actionType: ActionTypeEnum,

    @Type(type = "jsonb")
    @Column(name = "value", columnDefinition = "jsonb")
    var value: String,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mission_id")
    @JsonBackReference
    var mission: MissionModel
) {

    fun toActionEntity(mapper: ObjectMapper): EnvActionEntity {
        return EnvActionMapper.getEnvActionEntityFromJSON(
            mapper,
            id,
            actionStartDateTime?.atZone(UTC),
            geom,
            actionType,
            value
        )
    }
    companion object {
        fun fromEnvActionEntity(action: EnvActionEntity, mission: MissionModel, mapper: ObjectMapper) = EnvActionModel(
            id = action.id,
            actionType = action.actionType,
            actionStartDateTime = action.actionStartDateTimeUtc?.toInstant(),
            value = EnvActionMapper.envActionEntityToJSON(mapper, action),
            mission = mission,
            geom = action.geom
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
        return this::class.simpleName + "(id = $id , geom = $geom , actionStartDateTime = $actionStartDateTime, actionType = $actionType , value = $value )"
    }
}
