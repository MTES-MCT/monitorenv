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
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import fr.gouv.cacem.monitorenv.utils.mapOrElseEmpty
import io.hypersistence.utils.hibernate.type.array.ListArrayType
import io.hypersistence.utils.hibernate.type.array.internal.AbstractArrayType.SQL_ARRAY_TYPE
import io.hypersistence.utils.hibernate.type.basic.PostgreSQLEnumType
import jakarta.persistence.*
import java.time.Instant
import java.time.ZoneOffset.UTC
import org.hibernate.Hibernate
import org.hibernate.annotations.Fetch
import org.hibernate.annotations.FetchMode
import org.hibernate.annotations.Parameter
import org.hibernate.annotations.Type
import org.locationtech.jts.geom.MultiPolygon
import org.n52.jackson.datatype.jts.GeometryDeserializer
import org.n52.jackson.datatype.jts.GeometrySerializer

@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator::class,
        property = "id",
)
@Entity
@Table(name = "missions")
data class MissionModel(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Basic(optional = false)
        @Column(name = "id", unique = true, nullable = false)
        val id: Int? = null,
        @Type(
                ListArrayType::class,
                parameters = [Parameter(name = SQL_ARRAY_TYPE, value = "text")],
        )
        @Column(name = "mission_types", columnDefinition = "text[]")
        val missionTypes: List<MissionTypeEnum>,
        @Column(name = "open_by") val openBy: String? = null,
        @Column(name = "closed_by") val closedBy: String? = null,
        @Column(name = "observations_cacem") val observationsCacem: String? = null,
        @Column(name = "observations_cnsp") val observationsCnsp: String? = null,
        @Column(name = "facade") val facade: String? = null,
        @JsonSerialize(using = GeometrySerializer::class)
        @JsonDeserialize(contentUsing = GeometryDeserializer::class)
        @Column(name = "geom")
        val geom: MultiPolygon? = null,
        @Column(name = "start_datetime_utc") val startDateTimeUtc: Instant,
        @Column(name = "end_datetime_utc") val endDateTimeUtc: Instant? = null,
        @Column(name = "closed", nullable = false) val isClosed: Boolean,
        @Column(name = "deleted", nullable = false) val isDeleted: Boolean,
        @Column(name = "mission_source", nullable = false, columnDefinition = "mission_source_type")
        @Enumerated(EnumType.STRING)
        @Type(PostgreSQLEnumType::class)
        val missionSource: MissionSourceEnum,
        @Column(name = "has_mission_order", nullable = false) val hasMissionOrder: Boolean,
        @Column(name = "is_geometry_computed_from_controls", nullable = false)
        val isGeometryComputedFromControls: Boolean,
        @Column(name = "is_under_jdp", nullable = false) val isUnderJdp: Boolean,
        @OneToMany(
                mappedBy = "mission",
                cascade = [CascadeType.ALL],
                orphanRemoval = true,
                fetch = FetchType.EAGER,
        )
        @JsonManagedReference
        @Fetch(value = FetchMode.SUBSELECT)
        val envActions: MutableList<EnvActionModel>? = ArrayList(),
        @OneToMany(
                mappedBy = "mission",
                cascade = [CascadeType.ALL],
                orphanRemoval = true,
                fetch = FetchType.EAGER,
        )
        @JsonManagedReference
        @Fetch(value = FetchMode.SUBSELECT)
        val controlResources: MutableList<MissionControlResourceModel>? = ArrayList(),
        @OneToMany(
                mappedBy = "mission",
                cascade = [CascadeType.ALL],
                orphanRemoval = true,
                fetch = FetchType.EAGER,
        )
        @JsonManagedReference
        @Fetch(value = FetchMode.SUBSELECT)
        val controlUnits: MutableList<MissionControlUnitModel>? = ArrayList(),
        @OneToMany(mappedBy = "mission")
        @JsonManagedReference
        @Fetch(value = FetchMode.SUBSELECT)
        val attachedReportings: List<ReportingModel>? = listOf(),
) {
    fun toMissionEntity(objectMapper: ObjectMapper): MissionEntity {
        val controlUnits =
                controlUnits.mapOrElseEmpty { missionControlUnitModel ->
                    val controlUnitResources =
                            controlResources
                                    .mapOrElseEmpty { it.toLegacyControlUnitResource() }
                                    .filter { it.controlUnitId == missionControlUnitModel.unit.id }

                    missionControlUnitModel
                            .unit
                            .toLegacyControlUnit()
                            .copy(
                                    contact = missionControlUnitModel.contact,
                                    resources = controlUnitResources,
                            )
                }

        return MissionEntity(
                id,
                missionTypes,
                controlUnits,
                openBy,
                closedBy,
                observationsCacem,
                observationsCnsp,
                facade,
                geom,
                startDateTimeUtc = startDateTimeUtc.atZone(UTC),
                endDateTimeUtc = endDateTimeUtc?.atZone(UTC),
                envActions = envActions!!.map { it.toActionEntity(objectMapper) },
                isClosed,
                isDeleted,
                isGeometryComputedFromControls,
                missionSource,
                hasMissionOrder,
                isUnderJdp,
        )
    }

    fun toMissionDTO(objectMapper: ObjectMapper): MissionDTO {
        return MissionDTO(
                mission = this.toMissionEntity(objectMapper),
                attachedReportingIds = this.attachedReportings?.map { it.id as Int } ?: listOf(),
                attachedReportings =
                        this.attachedReportings?.map { it.toReportingDTO(objectMapper) }
                                ?: listOf(),
        )
    }

    companion object {
        fun fromMissionEntity(
                mission: MissionEntity,
                mapper: ObjectMapper,
                controlUnitResourceModelMap: Map<Int, ControlUnitResourceModel>,
        ): MissionModel {
            val missionModel =
                    MissionModel(
                            id = mission.id,
                            missionTypes = mission.missionTypes,
                            openBy = mission.openBy,
                            closedBy = mission.closedBy,
                            observationsCacem = mission.observationsCacem,
                            observationsCnsp = mission.observationsCnsp,
                            facade = mission.facade,
                            geom = mission.geom,
                            startDateTimeUtc = mission.startDateTimeUtc.toInstant(),
                            endDateTimeUtc = mission.endDateTimeUtc?.toInstant(),
                            isClosed = mission.isClosed,
                            isDeleted = false,
                            missionSource = mission.missionSource,
                            hasMissionOrder = mission.hasMissionOrder,
                            isUnderJdp = mission.isUnderJdp,
                            isGeometryComputedFromControls = mission.isGeometryComputedFromControls,
                    )

            mission.envActions?.map {
                missionModel.envActions?.add(
                        EnvActionModel.fromEnvActionEntity(it, missionModel, mapper),
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
                                            controlUnitResourceModelMap[controlUnitResource.id]
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

    @Override
    override fun toString(): String {
        return this::class.simpleName +
                "(id = $id , missionTypes = $missionTypes , openBy = $openBy , closedBy = $closedBy , observationsCacem = $observationsCacem, observationsCnsp = $observationsCnsp , facade = $facade , geom = $geom , startDateTimeUtc = $startDateTimeUtc , endDateTimeUtc = $endDateTimeUtc, isClosed = $isClosed, isDeleted = $isDeleted, missionSource = $missionSource )"
    }
}
