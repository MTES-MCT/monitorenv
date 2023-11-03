package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonBackReference
import com.fasterxml.jackson.annotation.JsonIdentityInfo
import com.fasterxml.jackson.annotation.JsonManagedReference
import com.fasterxml.jackson.annotation.ObjectIdGenerators
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.mappers.EnvActionMapper
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import java.time.Instant
import java.time.ZoneOffset.UTC
import java.util.UUID
import org.hibernate.Hibernate
import org.hibernate.annotations.JdbcType
import org.hibernate.annotations.Type
import org.hibernate.type.descriptor.jdbc.UUIDJdbcType
import org.locationtech.jts.geom.Geometry
import org.n52.jackson.datatype.jts.GeometryDeserializer
import org.n52.jackson.datatype.jts.GeometrySerializer

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
        val id: UUID,
        @Column(name = "action_start_datetime_utc") val actionStartDateTime: Instant? = null,
        @Column(name = "action_end_datetime_utc") val actionEndDateTime: Instant? = null,
        @JsonSerialize(using = GeometrySerializer::class)
        @JsonDeserialize(contentUsing = GeometryDeserializer::class)
        @Column(name = "geom")
        val geom: Geometry? = null,
        @Column(name = "action_type") @Enumerated(EnumType.STRING) val actionType: ActionTypeEnum,
        @Type(JsonBinaryType::class)
        @Column(name = "value", columnDefinition = "jsonb")
        val value: String,
        @Column(name = "facade") val facade: String? = null,
        @Column(name = "department") val department: String? = null,
        @ManyToOne(fetch = FetchType.EAGER, optional = false)
        @JoinColumn(name = "mission_id")
        @JsonBackReference
        val mission: MissionModel,
        @Column(name = "is_administrative_control") val isAdministrativeControl: Boolean? = null,
        @Column(name = "is_compliance_with_water_regulations_control")
        val isComplianceWithWaterRegulationsControl: Boolean? = null,
        @Column(name = "is_safety_equipment_and_standards_compliance_control")
        val isSafetyEquipmentAndStandardsComplianceControl: Boolean? = null,
        @Column(name = "is_seafarers_control") val isSeafarersControl: Boolean? = null,
        @OneToMany(
                fetch = FetchType.EAGER,
                mappedBy = "attachedEnvAction",
        )
        @JsonManagedReference
        val attachedReporting: List<ReportingModel>? = listOf(),
) {

    fun toActionEntity(mapper: ObjectMapper): EnvActionEntity {
        return EnvActionMapper.getEnvActionEntityFromJSON(
                mapper = mapper,
                id = id,
                actionStartDateTimeUtc = actionStartDateTime?.atZone(UTC),
                actionEndDateTimeUtc = actionEndDateTime?.atZone(UTC),
                geom = geom,
                actionType = actionType,
                facade = facade,
                department = department,
                value = value,
                isAdministrativeControl = isAdministrativeControl,
                isComplianceWithWaterRegulationsControl = isComplianceWithWaterRegulationsControl,
                isSafetyEquipmentAndStandardsComplianceControl =
                        isSafetyEquipmentAndStandardsComplianceControl,
                isSeafarersControl = isSeafarersControl,
        )
    }
    companion object {
        fun fromEnvActionEntity(
                action: EnvActionEntity,
                mission: MissionModel,
                mapper: ObjectMapper,
        ) =
                EnvActionModel(
                        id = action.id,
                        actionType = action.actionType,
                        actionStartDateTime = action.actionStartDateTimeUtc?.toInstant(),
                        actionEndDateTime = action.actionEndDateTimeUtc?.toInstant(),
                        facade = action.facade,
                        department = action.department,
                        value = EnvActionMapper.envActionEntityToJSON(mapper, action),
                        mission = mission,
                        geom = action.geom,
                        isAdministrativeControl = action.isAdministrativeControl,
                        isComplianceWithWaterRegulationsControl =
                                action.isComplianceWithWaterRegulationsControl,
                        isSafetyEquipmentAndStandardsComplianceControl =
                                action.isSafetyEquipmentAndStandardsComplianceControl,
                        isSeafarersControl = action.isSeafarersControl,
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
        return this::class.simpleName +
                "(id = $id , geom = $geom , actionStartDateTime = $actionStartDateTime, actionEndDateTime = $actionEndDateTime, actionType = $actionType , value = $value, facade = $facade, department = $department, isAdministrativeControl = $isAdministrativeControl, isComplianceWithWaterRegulationsControl = $isComplianceWithWaterRegulationsControl, isSeafarersControl = $isSeafarersControl, isSafetyEquipmentAndStandardsComplianceControl = $isSafetyEquipmentAndStandardsComplianceControl )"
    }
}
