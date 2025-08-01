package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonIdentityInfo
import com.fasterxml.jackson.annotation.JsonManagedReference
import com.fasterxml.jackson.annotation.ObjectIdGenerators
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.EnvActionAttachedToReportingIds
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDetailsDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionListDTO
import fr.gouv.cacem.monitorenv.infrastructure.database.model.reportings.ReportingModel
import jakarta.persistence.Basic
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.NamedAttributeNode
import jakarta.persistence.NamedEntityGraph
import jakarta.persistence.NamedSubgraph
import jakarta.persistence.OneToMany
import jakarta.persistence.OrderBy
import jakarta.persistence.PrePersist
import jakarta.persistence.PreUpdate
import jakarta.persistence.Table
import org.hibernate.Hibernate
import org.hibernate.annotations.Fetch
import org.hibernate.annotations.FetchMode
import org.hibernate.annotations.JdbcType
import org.hibernate.annotations.UpdateTimestamp
import org.hibernate.dialect.PostgreSQLEnumJdbcType
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
    attributeNodes =
        [
            NamedAttributeNode("envActions", subgraph = "subgraph.envActions"),
            NamedAttributeNode(
                "attachedReportings",
                subgraph = "subgraph.attachedReportings",
            ),
            NamedAttributeNode(
                "controlResources",
                subgraph = "subgraph.missionControlResources",
            ),
            NamedAttributeNode(
                "controlUnits",
                subgraph = "subgraph.missionControlUnits",
            ),
        ],
    subgraphs =
        [
            NamedSubgraph(
                name = "subgraph.envActions",
                attributeNodes =
                    [
                        NamedAttributeNode("attachedReporting"),
                        NamedAttributeNode(
                            "themes",
                            subgraph = "subgraph.themesEnvAction",
                        ),
                        NamedAttributeNode(
                            "tags",
                            subgraph = "subgraph.tagsEnvAction",
                        ),
                    ],
            ),
            NamedSubgraph(
                name = "subgraph.attachedReportings",
                attributeNodes =
                    [
                        NamedAttributeNode("themes", subgraph = "subgraph.themesReportings"),
                        NamedAttributeNode("tags", subgraph = "subgraph.tagsReportings"),
                    ],
            ),
            NamedSubgraph(
                name = "subgraph.themesEnvAction",
                attributeNodes =
                    [
                        NamedAttributeNode("envAction"),
                        NamedAttributeNode("theme", subgraph = "subgraph.themes"),

                    ],
            ),
            NamedSubgraph(
                name = "subgraph.tagsEnvAction",
                attributeNodes =
                    [
                        NamedAttributeNode("envAction"),
                        NamedAttributeNode("tag", subgraph = "subgraph.tags"),
                    ],
            ),
            NamedSubgraph(
                name = "subgraph.themesReportings",
                attributeNodes =
                    [
                        NamedAttributeNode("reporting"),
                        NamedAttributeNode("theme", subgraph = "subgraph.themes"),

                    ],
            ),
            NamedSubgraph(
                name = "subgraph.tagsReportings",
                attributeNodes =
                    [
                        NamedAttributeNode("reporting"),
                        NamedAttributeNode("tag", subgraph = "subgraph.tags"),
                    ],
            ),
            NamedSubgraph(
                name = "subgraph.missionControlResources",
                attributeNodes =
                    [
                        NamedAttributeNode(
                            "resource",
                            subgraph = "subgraph.controlResource",
                        ),
                    ],
            ),
            NamedSubgraph(
                name = "subgraph.missionControlUnits",
                attributeNodes =
                    [
                        NamedAttributeNode(
                            "unit",
                            subgraph = "subgraph.controlUnit",
                        ),
                    ],
            ),
            NamedSubgraph(
                name = "subgraph.controlUnit",
                attributeNodes =
                    [
                        NamedAttributeNode("administration"),
                    ],
            ),
            NamedSubgraph(
                name = "subgraph.controlResource",
                attributeNodes =
                    [
                        NamedAttributeNode("station"),
                    ],
            ),
            NamedSubgraph(
                name = "subgraph.themes",
                attributeNodes =
                    [
                        NamedAttributeNode("parent"),
                    ],
            ),
            NamedSubgraph(
                name = "subgraph.tags",
                attributeNodes =
                    [
                        NamedAttributeNode("parent"),
                    ],
            ),
        ],
)
@Table(name = "missions")
class MissionModel(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id", unique = true, nullable = false)
    val id: Int? = null,
    @OneToMany(mappedBy = "mission", fetch = FetchType.LAZY)
    @JsonManagedReference
    @Fetch(value = FetchMode.SUBSELECT)
    @OrderBy("id")
    val attachedReportings: MutableSet<ReportingModel>? = LinkedHashSet(),
    @OneToMany(
        mappedBy = "mission",
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
        fetch = FetchType.LAZY,
    )
    @JsonManagedReference
    @Fetch(value = FetchMode.SUBSELECT)
    @OrderBy("id")
    val controlResources: MutableSet<MissionControlResourceModel>? = LinkedHashSet(),
    @OneToMany(
        mappedBy = "mission",
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
        fetch = FetchType.LAZY,
    )
    @JsonManagedReference
    @Fetch(value = FetchMode.SUBSELECT)
    @OrderBy("id")
    val controlUnits: MutableSet<MissionControlUnitModel>? = LinkedHashSet(),
    @Column(name = "completed_by") val completedBy: String? = null,
    @Column(name = "created_at_utc", updatable = false) var createdAtUtc: Instant?,
    @OneToMany(
        mappedBy = "mission",
        orphanRemoval = true,
        fetch = FetchType.LAZY,
    )
    @JsonManagedReference
    @Fetch(value = FetchMode.SUBSELECT)
    @OrderBy("id")
    val envActions: MutableSet<EnvActionModel>? = LinkedHashSet(),
    @Column(name = "end_datetime_utc") val endDateTimeUtc: Instant? = null,
    @Column(name = "facade") val facade: String? = null,
    @JsonSerialize(using = GeometrySerializer::class)
    @JsonDeserialize(contentUsing = GeometryDeserializer::class)
    @Column(name = "geom")
    val geom: MultiPolygon? = null,
    @Column(name = "has_mission_order", nullable = false) val hasMissionOrder: Boolean,
    @Column(name = "deleted", nullable = false) val isDeleted: Boolean,
    @Column(name = "is_geometry_computed_from_controls", nullable = false)
    val isGeometryComputedFromControls: Boolean,
    @Column(name = "is_under_jdp", nullable = false) val isUnderJdp: Boolean,
    @Column(name = "mission_source", nullable = false, columnDefinition = "mission_source_type")
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType::class)
    val missionSource: MissionSourceEnum,
    // FIXME (10/06/2024) 'Basic' attribute type should not be a container
    @Column(name = "mission_types", columnDefinition = "text[]")
    @Enumerated(EnumType.STRING)
    val missionTypes: List<MissionTypeEnum>,
    @Column(name = "observations_by_unit") val observationsByUnit: String? = null,
    @Column(name = "observations_cacem") val observationsCacem: String? = null,
    @Column(name = "observations_cnsp") val observationsCnsp: String? = null,
    @Column(name = "open_by") val openBy: String? = null,
    @Column(name = "start_datetime_utc") val startDateTimeUtc: Instant,
    @Column(name = "updated_at_utc") @UpdateTimestamp var updatedAtUtc: Instant?,
) {
    private fun buildMissionEntity(
        mappedControlUnits: List<LegacyControlUnitEntity>? = null,
        objectMapper: ObjectMapper,
    ): MissionEntity =
        MissionEntity(
            id = id,
            completedBy = completedBy,
            controlUnits = mappedControlUnits ?: emptyList(),
            endDateTimeUtc = endDateTimeUtc?.atZone(UTC),
            createdAtUtc = createdAtUtc?.atZone(UTC),
            updatedAtUtc = updatedAtUtc?.atZone(UTC),
            envActions = envActions?.map { it.toActionEntity(objectMapper) },
            facade = facade,
            geom = geom,
            hasMissionOrder = hasMissionOrder,
            isDeleted = isDeleted,
            isGeometryComputedFromControls = isGeometryComputedFromControls,
            isUnderJdp = isUnderJdp,
            missionSource = missionSource,
            missionTypes = missionTypes,
            observationsByUnit = observationsByUnit,
            observationsCacem = observationsCacem,
            observationsCnsp = observationsCnsp,
            openBy = openBy,
            startDateTimeUtc = startDateTimeUtc.atZone(UTC),
        )

    fun toMissionEntity(objectMapper: ObjectMapper): MissionEntity {
        val mappedControlUnits =
            controlUnits?.map { missionControlUnitModel ->
                val mappedControlUnitResources =
                    controlResources?.map { it.toLegacyControlUnitResource() }?.filter {
                        it.controlUnitId == missionControlUnitModel.unit.id
                    }

                missionControlUnitModel
                    .unit
                    .toLegacyControlUnit()
                    .copy(
                        contact = missionControlUnitModel.contact,
                        resources = mappedControlUnitResources?.toList() ?: emptyList(),
                    )
            }

        return buildMissionEntity(mappedControlUnits, objectMapper)
    }

    fun toMissionEntityWithoutControlUnit(objectMapper: ObjectMapper): MissionEntity =
        buildMissionEntity(null, objectMapper)

    fun toMissionDTO(objectMapper: ObjectMapper): MissionDetailsDTO {
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
                        }.toMutableList()
                }

                return@fold listOfActionsAttached
            }
                ?: listOf()
        return MissionDetailsDTO(
            mission = this.toMissionEntity(objectMapper),
            attachedReportingIds =
                this.attachedReportings
                    ?.filter { it.detachedFromMissionAtUtc == null }
                    ?.map { it.id as Int }
                    ?: listOf(),
            attachedReportings =
                this.attachedReportings
                    ?.filter { it.detachedFromMissionAtUtc == null }
                    ?.map { it.toReportingDetailsDTO(objectMapper) }
                    ?: listOf(),
            detachedReportings =
                this.attachedReportings
                    ?.filter { it.detachedFromMissionAtUtc != null }
                    ?.map { it.toReporting() }
                    ?: listOf(),
            detachedReportingIds =
                this.attachedReportings
                    ?.filter { it.detachedFromMissionAtUtc != null }
                    ?.map { it.id as Int }
                    ?: listOf(),
            envActionsAttachedToReportingIds = envActionsAttachedToReportingIds,
        )
    }

    private fun toMissionsEntity(objectMapper: ObjectMapper): MissionEntity {
        val mappedControlUnits =
            controlUnits?.map { missionControlUnitModel ->
                missionControlUnitModel
                    .unit
                    .toLegacyControlUnit()
                    .copy(
                        contact = missionControlUnitModel.contact,
                    )
            }

        return buildMissionEntity(mappedControlUnits, objectMapper)
    }

    fun toMissionListDTO(objectMapper: ObjectMapper): MissionListDTO =
        MissionListDTO(
            mission = this.toMissionsEntity(objectMapper),
            attachedReportingIds =
                this.attachedReportings
                    ?.filter { it.detachedFromMissionAtUtc == null }
                    ?.map { it.id as Int }
                    ?: listOf(),
        )

    companion object {
        fun fromMissionEntity(mission: MissionEntity): MissionModel {
            val missionModel =
                MissionModel(
                    id = mission.id,
                    completedBy = mission.completedBy,
                    endDateTimeUtc = mission.endDateTimeUtc?.toInstant(),
                    facade = mission.facade,
                    geom = mission.geom,
                    hasMissionOrder = mission.hasMissionOrder,
                    isDeleted = false,
                    isGeometryComputedFromControls = mission.isGeometryComputedFromControls,
                    isUnderJdp = mission.isUnderJdp,
                    missionSource = mission.missionSource,
                    missionTypes = mission.missionTypes,
                    observationsByUnit = mission.observationsByUnit,
                    observationsCacem = mission.observationsCacem,
                    observationsCnsp = mission.observationsCnsp,
                    openBy = mission.openBy,
                    startDateTimeUtc = mission.startDateTimeUtc.toInstant(),
                    createdAtUtc = mission.createdAtUtc?.toInstant(),
                    updatedAtUtc = mission.updatedAtUtc?.toInstant(),
                )

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

    @PrePersist
    private fun prePersist() {
        this.createdAtUtc = Instant.now()
    }

    @PreUpdate
    private fun preUpdate() {
        this.updatedAtUtc = Instant.now()
    }
}
