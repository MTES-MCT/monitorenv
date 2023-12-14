package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonBackReference
import com.fasterxml.jackson.annotation.JsonIdentityInfo
import com.fasterxml.jackson.annotation.JsonManagedReference
import com.fasterxml.jackson.annotation.ObjectIdGenerators
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionControlPlanEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.mappers.EnvActionMapper
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
class EnvActionModel(
    @Id
    @JdbcType(UUIDJdbcType::class)
    @Column(name = "id", nullable = false, updatable = false, columnDefinition = "uuid")
    val id: UUID,

    @Column(name = "action_start_datetime_utc")
    val actionStartDateTime: Instant? = null,

    @Column(name = "action_end_datetime_utc")
    val actionEndDateTime: Instant? = null,

    @JsonSerialize(using = GeometrySerializer::class)
    @JsonDeserialize(contentUsing = GeometryDeserializer::class)
    @Column(name = "geom")
    val geom: Geometry? = null,

    @Column(name = "action_type")
    @Enumerated(EnumType.STRING)
    val actionType: ActionTypeEnum,

    @Type(JsonBinaryType::class)
    @Column(name = "value", columnDefinition = "jsonb")
    val value: String,

    @Column(name = "facade")
    val facade: String? = null,

    @Column(name = "department")
    val department: String? = null,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mission_id")
    @JsonBackReference
    val mission: MissionModel,

    @Column(name = "is_administrative_control")
    val isAdministrativeControl: Boolean? = null,

    @Column(name = "is_compliance_with_water_regulations_control")
    val isComplianceWithWaterRegulationsControl: Boolean? = null,

    @Column(name = "is_safety_equipment_and_standards_compliance_control")
    val isSafetyEquipmentAndStandardsComplianceControl: Boolean? = null,

    @Column(name = "is_seafarers_control")
    val isSeafarersControl: Boolean? = null,

    @OneToMany(
        fetch = FetchType.LAZY,
        mappedBy = "attachedEnvAction",
    )
    @JsonManagedReference
    val attachedReporting: List<ReportingModel>? = listOf(),

    @OneToMany(
        fetch = FetchType.EAGER,
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
        mappedBy = "envAction",
    )
    val controlPlanThemes: MutableList<EnvActionsControlPlanThemeModel>? = ArrayList(),

    @OneToMany(
        fetch = FetchType.EAGER,
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
        mappedBy = "envAction",
    )
    val controlPlanSubThemes: MutableList<EnvActionsControlPlanSubThemeModel>? = ArrayList(),

    @OneToMany(
        fetch = FetchType.EAGER,
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
        mappedBy = "envAction",
    )
    val controlPlanTags: MutableList<EnvActionsControlPlanTagModel>? = ArrayList(),
) {

    fun toActionEntity(mapper: ObjectMapper): EnvActionEntity {
        val controlPlans = controlPlanThemes?.map { it ->
            EnvActionControlPlanEntity(
                themeId = it.id.themeId,
                subThemeIds = controlPlanSubThemes?.filter { subTheme -> it.id.themeId == subTheme.controlPlanSubTheme?.controlPlanTheme?.id }?.map { it.id.subthemeId },
                tagIds = controlPlanTags?.filter { tag -> it.id.themeId == tag.controlPlanTag?.controlPlanTheme?.id }?.map { it.id.tagId },
            )
        }

        return EnvActionMapper.getEnvActionEntityFromJSON(
            mapper = mapper,
            id = id,
            actionEndDateTimeUtc = actionEndDateTime?.atZone(UTC),
            actionType = actionType,
            actionStartDateTimeUtc = actionStartDateTime?.atZone(UTC),
            controlPlans = controlPlans,
            department = department,
            facade = facade,
            geom = geom,
            isAdministrativeControl = isAdministrativeControl,
            isComplianceWithWaterRegulationsControl = isComplianceWithWaterRegulationsControl,
            isSafetyEquipmentAndStandardsComplianceControl =
            isSafetyEquipmentAndStandardsComplianceControl,
            isSeafarersControl = isSeafarersControl,
            value = value,
        )
    }
    companion object {
        fun fromEnvActionEntity(
            action: EnvActionEntity,
            mission: MissionModel,
            controlPlanThemesReferenceModelMap: Map<Int, ControlPlanThemeModel>,
            controlPlanSubThemesReferenceModelMap: Map<Int, ControlPlanSubThemeModel>,
            controlPlanTagsReferenceModelMap: Map<Int, ControlPlanTagModel>,
            mapper: ObjectMapper,
        ): EnvActionModel {
            val envActionModel = EnvActionModel(
                id = action.id,
                actionEndDateTime = action.actionEndDateTimeUtc?.toInstant(),
                actionType = action.actionType,
                actionStartDateTime = action.actionStartDateTimeUtc?.toInstant(),
                department = action.department,
                facade = action.facade,
                isAdministrativeControl = action.isAdministrativeControl,
                isComplianceWithWaterRegulationsControl =
                action.isComplianceWithWaterRegulationsControl,
                isSafetyEquipmentAndStandardsComplianceControl =
                action.isSafetyEquipmentAndStandardsComplianceControl,
                isSeafarersControl = action.isSeafarersControl,
                mission = mission,
                geom = action.geom,
                value = EnvActionMapper.envActionEntityToJSON(mapper, action),
            )
            action.controlPlans?.forEach {
                envActionModel.controlPlanThemes?.add(
                    EnvActionsControlPlanThemeModel.fromEnvActionControlPlanThemeEntity(
                        envAction = envActionModel,
                        controlPlanTheme = controlPlanThemesReferenceModelMap[it.themeId]!!,
                    ),
                )
                it.subThemeIds?.forEach { subThemeId ->
                    envActionModel.controlPlanSubThemes?.add(
                        EnvActionsControlPlanSubThemeModel.fromEnvActionControlPlanSubThemeEntity(
                            envAction = envActionModel,
                            controlPlanSubTheme = controlPlanSubThemesReferenceModelMap[subThemeId]!!,
                        ),
                    )
                }
                it.tagIds?.forEach { tagId ->
                    envActionModel.controlPlanTags?.add(
                        EnvActionsControlPlanTagModel.fromEnvActionControlPlanTagEntity(
                            envAction = envActionModel,
                            controlPlanTag = controlPlanTagsReferenceModelMap[tagId]!!,
                        ),
                    )
                }
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
