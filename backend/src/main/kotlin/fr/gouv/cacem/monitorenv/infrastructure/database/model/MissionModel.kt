package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonIdentityInfo
import com.fasterxml.jackson.annotation.JsonManagedReference
import com.fasterxml.jackson.annotation.ObjectIdGenerators
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.EnvActionAttachedToReportingIds
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import io.hypersistence.utils.hibernate.type.array.ListArrayType
import io.hypersistence.utils.hibernate.type.array.internal.AbstractArrayType.SQL_ARRAY_TYPE
import io.hypersistence.utils.hibernate.type.basic.PostgreSQLEnumType
import jakarta.persistence.*
import jakarta.persistence.CascadeType
import jakarta.persistence.OrderBy
import jakarta.persistence.Table
import org.hibernate.Hibernate
import org.hibernate.annotations.*
import org.hibernate.annotations.Parameter
import org.locationtech.jts.geom.MultiPolygon
import org.n52.jackson.datatype.jts.GeometryDeserializer
import org.n52.jackson.datatype.jts.GeometrySerializer
import java.time.Instant
import java.time.ZoneOffset.UTC

@JsonIdentityInfo(
    generator = ObjectIdGenerators.PropertyGenerator::class,
    property = "id",
)
@Entity
@NamedEntityGraph(
    name = "MissionModel.fullLoad",
    attributeNodes = [
        NamedAttributeNode("envActions"),
        NamedAttributeNode("attachedReportings"),
        NamedAttributeNode("controlResources"),
        NamedAttributeNode("controlUnits"),
    ],
)
@Table(name = "missions")
class MissionModel(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id", unique = true, nullable = false)
    val id: Int? = null,

    @OneToMany(mappedBy = "mission", fetch = FetchType.EAGER)
    @JsonManagedReference
    @Fetch(value = FetchMode.SUBSELECT)
    @OrderBy("id")
    val attachedReportings: MutableSet<ReportingModel>? = LinkedHashSet(),

    @OneToMany(
        mappedBy = "mission",
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
        fetch = FetchType.EAGER,
    )
    @JsonManagedReference
    @Fetch(value = FetchMode.SUBSELECT)
    @OrderBy("id")
    val controlResources: MutableSet<MissionControlResourceModel>? = LinkedHashSet(),

    @OneToMany(
        mappedBy = "mission",
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
        fetch = FetchType.EAGER,
    )
    @JsonManagedReference
    @Fetch(value = FetchMode.SUBSELECT)
    @OrderBy("id")
    val controlUnits: MutableSet<MissionControlUnitModel>? = LinkedHashSet(),

    @Column(name = "closed_by")
    val closedBy: String? = null,

    @Column(name = "created_at_utc", updatable = false)
    @CreationTimestamp
    val createdAtUtc: Instant? = null,

    @OneToMany(
        mappedBy = "mission",
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
        fetch = FetchType.LAZY,
    )
    @JsonManagedReference
    @Fetch(value = FetchMode.SUBSELECT)
    @OrderBy("id")
    val envActions: MutableSet<EnvActionModel>? = LinkedHashSet(),

    @Column(name = "end_datetime_utc")
    val endDateTimeUtc: Instant? = null,

    @Column(name = "facade")
    val facade: String? = null,

    @JsonSerialize(using = GeometrySerializer::class)
    @JsonDeserialize(contentUsing = GeometryDeserializer::class)
    @Column(name = "geom")
    val geom: MultiPolygon? = null,

    @Column(name = "has_mission_order", nullable = false)
    val hasMissionOrder: Boolean,

    @Column(name = "closed", nullable = false)
    val isClosed: Boolean,

    @Column(name = "deleted", nullable = false)
    val isDeleted: Boolean,

    @Column(name = "is_geometry_computed_from_controls", nullable = false)
    val isGeometryComputedFromControls: Boolean,

    @Column(name = "is_under_jdp", nullable = false)
    val isUnderJdp: Boolean,

    @Column(name = "mission_source", nullable = false, columnDefinition = "mission_source_type")
    @Enumerated(EnumType.STRING)
    @Type(PostgreSQLEnumType::class)
    val missionSource: MissionSourceEnum,

    @Type(
        ListArrayType::class,
        parameters = [Parameter(name = SQL_ARRAY_TYPE, value = "text")],
    )
    @Column(name = "mission_types", columnDefinition = "text[]")
    val missionTypes: List<MissionTypeEnum>,

    @Column(name = "observations_cacem")
    val observationsCacem: String? = null,

    @Column(name = "observations_cnsp")
    val observationsCnsp: String? = null,

    @Column(name = "open_by")
    val openBy: String? = null,

    @Column(name = "start_datetime_utc")
    val startDateTimeUtc: Instant,

    @Column(name = "updated_at_utc")
    @UpdateTimestamp
    val updatedAtUtc: Instant? = null,

) {
    fun toMissionEntity(objectMapper: ObjectMapper): MissionEntity {
        val mappedControlUnits =
            controlUnits?.map { missionControlUnitModel ->
                val mappedControlUnitResources =
                    controlResources
                        ?.map { it.toLegacyControlUnitResource() }
                        ?.filter { it.controlUnitId == missionControlUnitModel.unit.id }

                missionControlUnitModel
                    .unit
                    .toLegacyControlUnit()
                    .copy(
                        contact = missionControlUnitModel.contact,
                        resources = mappedControlUnitResources?.toList() ?: emptyList(),
                    )
            }

        return MissionEntity(
            id = id,
            closedBy = closedBy,
            controlUnits = mappedControlUnits ?: emptyList(),
            endDateTimeUtc = endDateTimeUtc?.atZone(UTC),
            createdAtUtc = createdAtUtc?.atZone(UTC),
            updatedAtUtc = updatedAtUtc?.atZone(UTC),
            envActions = envActions!!.map { it.toActionEntity(objectMapper) },
            facade = facade,
            geom = geom,
            hasMissionOrder = hasMissionOrder,
            isClosed = isClosed,
            isDeleted = isDeleted,
            isGeometryComputedFromControls = isGeometryComputedFromControls,
            isUnderJdp = isUnderJdp,
            missionSource = missionSource,
            missionTypes = missionTypes,
            observationsCacem = observationsCacem,
            observationsCnsp = observationsCnsp,
            openBy = openBy,
            startDateTimeUtc = startDateTimeUtc.atZone(UTC),
        )
    }

    fun toMissionDTO(objectMapper: ObjectMapper): MissionDTO {
        val envActionsAttachedToReportingIds =
            attachedReportings?.filter { it.attachedEnvAction != null }?.fold(
                mutableListOf<EnvActionAttachedToReportingIds>(),
            ) { listOfActionsAttached, attachedReporting ->
                require(attachedReporting.id != null)

                val actionId = attachedReporting.attachedEnvAction?.id
                if (actionId == null) {
                    return@fold listOfActionsAttached
                }

                val hasActionAlreadyAttachedToReporting =
                    listOfActionsAttached.find { it.first == actionId } != null

                if (!hasActionAlreadyAttachedToReporting) {
                    val newPair = Pair(actionId, mutableListOf(attachedReporting.id))
                    listOfActionsAttached.add(newPair)
                } else {
                    return@fold listOfActionsAttached
                        .map { actionWithReportings ->
                            if (actionWithReportings.first == actionId) {
                                val updatedReportingIds =
                                    actionWithReportings.second.plus(
                                        attachedReporting.id,
                                    )
                                val updatedAction = Pair(actionId, updatedReportingIds)

                                return@map updatedAction
                            } else {
                                return@map actionWithReportings
                            }
                        }
                        .toMutableList()
                }

                return@fold listOfActionsAttached
            }
                ?: listOf()
        return MissionDTO(
            mission = this.toMissionEntity(objectMapper),
            attachedReportingIds =
            this.attachedReportings
                ?.filter { it.detachedFromMissionAtUtc == null }
                ?.map { it.id as Int }
                ?: listOf(),
            attachedReportings =
            this.attachedReportings
                ?.filter { it.detachedFromMissionAtUtc == null }
                ?.map { it.toReportingDTO(objectMapper) }
                ?: listOf(),
            detachedReportings =
            this.attachedReportings
                ?.filter { it.detachedFromMissionAtUtc != null }
                ?.map { it.toReportingDTO(objectMapper) }
                ?: listOf(),
            detachedReportingIds =
            this.attachedReportings
                ?.filter { it.detachedFromMissionAtUtc != null }
                ?.map { it.id as Int }
                ?: listOf(),
            envActionsAttachedToReportingIds = envActionsAttachedToReportingIds,
        )
    }

    companion object {
        fun fromMissionEntity(
            mission: MissionEntity,
            controlUnitResourceModelMap: Map<Int, ControlUnitResourceModel>,
            controlPlanThemesReferenceModelMap: Map<Int, ControlPlanThemeModel>,
            controlPlanSubThemesReferenceModelMap: Map<Int, ControlPlanSubThemeModel>,
            controlPlanTagsReferenceModelMap: Map<Int, ControlPlanTagModel>,
            mapper: ObjectMapper,
        ): MissionModel {
            val missionModel =
                MissionModel(
                    id = mission.id,
                    closedBy = mission.closedBy,
                    endDateTimeUtc = mission.endDateTimeUtc?.toInstant(),
                    facade = mission.facade,
                    geom = mission.geom,
                    hasMissionOrder = mission.hasMissionOrder,
                    isClosed = mission.isClosed,
                    isDeleted = false,
                    isGeometryComputedFromControls = mission.isGeometryComputedFromControls,
                    isUnderJdp = mission.isUnderJdp,
                    missionSource = mission.missionSource,
                    missionTypes = mission.missionTypes,
                    observationsCacem = mission.observationsCacem,
                    observationsCnsp = mission.observationsCnsp,
                    openBy = mission.openBy,
                    startDateTimeUtc = mission.startDateTimeUtc.toInstant(),
                )

            mission.envActions?.map {
                missionModel.envActions?.add(
                    EnvActionModel.fromEnvActionEntity(
                        action = it,
                        mission = missionModel,
                        controlPlanThemesReferenceModelMap = controlPlanThemesReferenceModelMap,
                        controlPlanSubThemesReferenceModelMap = controlPlanSubThemesReferenceModelMap,
                        controlPlanTagsReferenceModelMap = controlPlanTagsReferenceModelMap,
                        mapper = mapper,
                    ),
                )
            }

            mission.controlUnits.map { controlUnit ->
                val missionControlUnitModel =
                    MissionControlUnitModel.fromLegacyControlUnit(
                        controlUnit,
                        missionModel,
                    )
                missionModel.controlUnits?.add(missionControlUnitModel)

                val missionControlUnitResourceModels =
                    controlUnit.resources.map { controlUnitResource ->
                        val controlUnitResourceModel =
                            requireNotNull(
                                controlUnitResourceModelMap[controlUnitResource.id],
                            )

                        MissionControlResourceModel(
                            resource = controlUnitResourceModel,
                            mission = missionModel,
                        )

                        MissionControlResourceModel(
                            resource = controlUnitResourceModel,
                            mission = missionModel,
                        )
                    }
                missionModel.controlResources?.addAll(missionControlUnitResourceModels)
            }

            return missionModel
        }
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false
        other as MissionModel

        return id != null && id == other.id
    }

    override fun hashCode(): Int = javaClass.hashCode()
}
