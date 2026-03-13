package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.mission.ActionCompletionEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionSurveillance.EnvActionSurveillanceEntity
import fr.gouv.cacem.monitorenv.domain.mappers.EnvActionMapper
import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagEnvActionModel.Companion.fromTagEntities
import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagEnvActionModel.Companion.toTagEntities
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeEnvActionModel.Companion.fromThemeEntities
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeEnvActionModel.Companion.toThemeEntities
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany
import jakarta.persistence.OrderBy
import jakarta.persistence.Table
import org.hibernate.Hibernate
import org.hibernate.annotations.JdbcType
import org.hibernate.annotations.Type
import org.hibernate.dialect.type.PostgreSQLEnumJdbcType
import org.hibernate.type.descriptor.jdbc.UUIDJdbcType
import org.locationtech.jts.geom.Geometry
import org.n52.jackson.datatype.jts.GeometryDeserializer
import org.n52.jackson.datatype.jts.GeometrySerializer
import tools.jackson.databind.annotation.JsonDeserialize
import tools.jackson.databind.annotation.JsonSerialize
import tools.jackson.databind.json.JsonMapper
import java.time.Instant
import java.time.ZoneOffset.UTC
import java.util.UUID

@Entity
@Table(name = "env_actions")
class EnvActionModel(
    @Id
    @JdbcType(UUIDJdbcType::class)
    @Column(name = "id", nullable = false, updatable = false, columnDefinition = "uuid")
    val id: UUID,
    @Column(name = "action_start_datetime_utc") val actionStartDateTime: Instant? = null,
    @Column(name = "action_end_datetime_utc") val actionEndDateTime: Instant? = null,
    @Column(name = "completed_by") val completedBy: String? = null,
    @Column(name = "completion", columnDefinition = "mission_action_completion")
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType::class)
    val completion: ActionCompletionEnum? = null,
    @JsonSerialize(using = GeometrySerializer::class)
    @JsonDeserialize(contentUsing = GeometryDeserializer::class)
    @Column(name = "geom")
    val geom: Geometry? = null,
    @Column(name = "action_type")
    @Enumerated(EnumType.STRING)
    val actionType: ActionTypeEnum,
    @Column(name = "value", columnDefinition = "jsonb", nullable = false)
    @Type(JsonBinaryType::class)
    val value: String,
    @Column(name = "facade") val facade: String? = null,
    @Column(name = "department") val department: String? = null,
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mission_id")
    val mission: MissionModel,
    @Column(name = "is_administrative_control") val isAdministrativeControl: Boolean? = null,
    @Column(name = "is_compliance_with_water_regulations_control")
    val isComplianceWithWaterRegulationsControl: Boolean? = null,
    @Column(name = "is_safety_equipment_and_standards_compliance_control")
    val isSafetyEquipmentAndStandardsComplianceControl: Boolean? = null,
    @Column(name = "is_seafarers_control") val isSeafarersControl: Boolean? = null,
    @Column(name = "observations_by_unit") val observationsByUnit: String? = null,
    @Column(name = "open_by") val openBy: String? = null,
    @OneToMany(
        fetch = FetchType.LAZY,
        mappedBy = "attachedEnvAction",
    )
    @OrderBy("id")
    val attachedReporting: List<ReportingModel>? = listOf(),
    @OneToMany(
        mappedBy = "envAction",
        fetch = FetchType.LAZY,
        orphanRemoval = true,
        cascade = [CascadeType.ALL],
    )
    var themes: List<ThemeEnvActionModel>,
    @OneToMany(
        mappedBy = "envAction",
        fetch = FetchType.LAZY,
        orphanRemoval = true,
        cascade = [CascadeType.ALL],
    )
    var tags: List<TagEnvActionModel>,
) {
    fun toActionEntity(mapper: JsonMapper): EnvActionEntity =
        EnvActionMapper.getEnvActionEntityFromJSON(
            mapper = mapper,
            id = id,
            actionEndDateTimeUtc = actionEndDateTime?.atZone(UTC),
            actionType = actionType,
            actionStartDateTimeUtc = actionStartDateTime?.atZone(UTC),
            completedBy = completedBy,
            completion = completion,
            department = department,
            facade = facade,
            geom = geom,
            isAdministrativeControl = isAdministrativeControl,
            isComplianceWithWaterRegulationsControl = isComplianceWithWaterRegulationsControl,
            isSafetyEquipmentAndStandardsComplianceControl =
            isSafetyEquipmentAndStandardsComplianceControl,
            isSeafarersControl = isSeafarersControl,
            observationsByUnit = observationsByUnit,
            openBy = openBy,
            value = value,
            tags = toTagEntities(tags.toList()),
            themes = toThemeEntities(themes.toList()),
        )

    companion object {
        fun fromEnvActionEntity(
            action: EnvActionEntity,
            mission: MissionModel,
            mapper: JsonMapper,
        ): EnvActionModel {
            val envActionModel =
                EnvActionModel(
                    id = action.id,
                    actionEndDateTime = action.actionEndDateTimeUtc?.toInstant(),
                    actionType = action.actionType,
                    actionStartDateTime = action.actionStartDateTimeUtc?.toInstant(),
                    completedBy = action.completedBy,
                    completion = action.completion,
                    department = action.department,
                    facade = action.facade,
                    isAdministrativeControl = action.isAdministrativeControl,
                    isComplianceWithWaterRegulationsControl =
                        action.isComplianceWithWaterRegulationsControl,
                    isSafetyEquipmentAndStandardsComplianceControl =
                        action.isSafetyEquipmentAndStandardsComplianceControl,
                    isSeafarersControl = action.isSeafarersControl,
                    openBy = action.openBy,
                    observationsByUnit = action.observationsByUnit,
                    mission = mission,
                    geom = action.geom,
                    value = EnvActionMapper.envActionEntityToJSON(mapper, action),
                    themes = listOf(),
                    tags = listOf(),
                )
            if (action is EnvActionControlEntity) {
                envActionModel.themes = fromThemeEntities(action.themes, envActionModel)
                envActionModel.tags = fromTagEntities(action.tags, envActionModel)
            }
            if (action is EnvActionSurveillanceEntity) {
                envActionModel.themes = fromThemeEntities(action.themes, envActionModel)
                envActionModel.tags = fromTagEntities(action.tags, envActionModel)
            }

            return envActionModel
        }
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false
        other as EnvActionModel

        return id == other.id
    }

    override fun hashCode(): Int = javaClass.hashCode()
}
