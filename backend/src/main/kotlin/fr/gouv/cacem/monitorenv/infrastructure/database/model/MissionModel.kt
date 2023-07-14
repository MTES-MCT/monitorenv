package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonIdentityInfo
import com.fasterxml.jackson.annotation.JsonManagedReference
import com.fasterxml.jackson.annotation.ObjectIdGenerators
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.vladmihalcea.hibernate.type.array.ListArrayType
import com.vladmihalcea.hibernate.type.array.internal.AbstractArrayType.SQL_ARRAY_TYPE
import com.vladmihalcea.hibernate.type.basic.PostgreSQLEnumType
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionTypeEnum
import jakarta.persistence.Basic
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import org.hibernate.Hibernate
import org.hibernate.annotations.Fetch
import org.hibernate.annotations.FetchMode
import org.hibernate.annotations.Parameter
import org.hibernate.annotations.Type
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
@Table(name = "missions")
data class MissionModel(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id", unique = true, nullable = false)
    var id: Int? = null,
    @Type(
        ListArrayType::class,
        parameters = [Parameter(name = SQL_ARRAY_TYPE, value = "text")],
    )
    @Column(name = "mission_types", columnDefinition = "text[]")
    var missionTypes: List<MissionTypeEnum>,
    @Column(name = "open_by")
    var openBy: String? = null,
    @Column(name = "closed_by")
    var closedBy: String? = null,
    @Column(name = "observations_cacem")
    var observationsCacem: String? = null,
    @Column(name = "observations_cnsp")
    var observationsCnsp: String? = null,
    @Column(name = "facade")
    var facade: String? = null,
    @JsonSerialize(using = GeometrySerializer::class)
    @JsonDeserialize(contentUsing = GeometryDeserializer::class)
    @Column(name = "geom")
    var geom: MultiPolygon? = null,
    @Column(name = "start_datetime_utc")
    var startDateTimeUtc: Instant,
    @Column(name = "end_datetime_utc")
    var endDateTimeUtc: Instant? = null,
    @Column(name = "closed", nullable = false)
    val isClosed: Boolean,
    @Column(name = "deleted", nullable = false)
    val isDeleted: Boolean,
    @Column(name = "mission_source", nullable = false, columnDefinition = "mission_source_type")
    @Enumerated(EnumType.STRING)
    @Type(PostgreSQLEnumType::class)
    val missionSource: MissionSourceEnum,
    @Column(name = "has_mission_order", nullable = false)
    var hasMissionOrder: Boolean,
    @Column(name = "is_geometry_computed_from_controls", nullable = false)
    var isGeometryComputedFromControls: Boolean,
    @Column(name = "is_under_jdp", nullable = false)
    var isUnderJdp: Boolean,
    @OneToMany(
        mappedBy = "mission",
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
    )
    @JsonManagedReference
    @Fetch(value = FetchMode.SUBSELECT)
    var envActions: MutableList<EnvActionModel>? = ArrayList(),
    @OneToMany(
        mappedBy = "mission",
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
    )
    @JsonManagedReference
    @Fetch(value = FetchMode.SUBSELECT)
    var controlResources: MutableList<MissionControlResourceModel>? = ArrayList(),
    @OneToMany(
        mappedBy = "mission",
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
    )
    @JsonManagedReference
    @Fetch(value = FetchMode.SUBSELECT)
    var controlUnits: MutableList<MissionControlUnitModel>? = ArrayList(),
) {

    fun toMissionEntity(mapper: ObjectMapper) = MissionEntity(
        id = id,
        missionTypes = missionTypes,
        openBy = openBy,
        closedBy = closedBy,
        observationsCacem = observationsCacem,
        observationsCnsp = observationsCnsp,
        facade = facade,
        geom = geom,
        startDateTimeUtc = startDateTimeUtc.atZone(UTC),
        endDateTimeUtc = endDateTimeUtc?.atZone(UTC),
        isClosed = isClosed,
        isDeleted = isDeleted,
        missionSource = missionSource,
        hasMissionOrder = hasMissionOrder,
        isUnderJdp = isUnderJdp,
        isGeometryComputedFromControls = isGeometryComputedFromControls,
        envActions = envActions!!.map { it.toActionEntity(mapper) },
        controlUnits = controlUnits?.map { unit ->
            val savedUnitResources = controlResources
                ?.filter { resource ->
                    resource.ressource.controlUnit?.id == unit.unit.id
                }
                ?.map { resource -> resource }

            unit.unit.toControlUnit().copy(
                contact = unit.contact,
                resources = savedUnitResources?.let { safeUnitResources -> safeUnitResources.map { it.ressource.toControlResource() } } ?: listOf(),
            )
        } ?: listOf(),
    )

    companion object {
        fun fromMissionEntity(mission: MissionEntity, mapper: ObjectMapper): MissionModel {
            val missionModel = MissionModel(
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
                isGeometryComputedFromControls = mission.isGeometryComputedFromControls
            )

            mission.envActions?.map {
                missionModel.envActions?.add(EnvActionModel.fromEnvActionEntity(it, missionModel, mapper))
            }

            mission.controlUnits.map {
                val controlUnitModel = MissionControlUnitModel.fromControlUnitEntity(
                    it,
                    missionModel,
                )
                missionModel.controlUnits?.add(controlUnitModel)

                val resources = it.resources.map { resource -> MissionControlResourceModel.fromControlResourceEntity(resource, missionModel, controlUnitModel.unit) }
                missionModel.controlResources?.addAll(resources)
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
        return this::class.simpleName + "(id = $id , missionTypes = $missionTypes , openBy = $openBy , closedBy = $closedBy , observationsCacem = $observationsCacem, observationsCnsp = $observationsCnsp , facade = $facade , geom = $geom , startDateTimeUtc = $startDateTimeUtc , endDateTimeUtc = $endDateTimeUtc, isClosed = $isClosed, isDeleted = $isDeleted, missionSource = $missionSource )"
    }
}
