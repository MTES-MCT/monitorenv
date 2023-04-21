package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonIdentityInfo
import com.fasterxml.jackson.annotation.JsonManagedReference
import com.fasterxml.jackson.annotation.ObjectIdGenerators
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.vladmihalcea.hibernate.type.array.EnumArrayType
import com.vladmihalcea.hibernate.type.array.ListArrayType
import com.vladmihalcea.hibernate.type.basic.PostgreSQLEnumType
import com.vladmihalcea.hibernate.type.json.JsonBinaryType
import fr.gouv.cacem.monitorenv.domain.entities.missions.*
import org.hibernate.Hibernate
import org.hibernate.annotations.Parameter
import org.hibernate.annotations.Type
import org.hibernate.annotations.TypeDef
import org.hibernate.annotations.TypeDefs
import org.hibernate.annotations.Fetch
import org.hibernate.annotations.FetchMode
import org.locationtech.jts.geom.MultiPolygon
import org.n52.jackson.datatype.jts.GeometryDeserializer
import org.n52.jackson.datatype.jts.GeometrySerializer
import java.time.Instant
import java.time.ZoneOffset.UTC
import javax.persistence.CascadeType
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table
import javax.persistence.GeneratedValue
import javax.persistence.Basic
import javax.persistence.Column
import javax.persistence.Enumerated
import javax.persistence.GenerationType
import javax.persistence.EnumType
import javax.persistence.OneToMany


@JsonIdentityInfo(
    generator = ObjectIdGenerators.PropertyGenerator::class,
    property = "id"
)
@Entity
@TypeDefs(
    TypeDef(
        name = "enum-array",
        typeClass = ListArrayType::class,
        parameters = [Parameter(name = EnumArrayType.SQL_ARRAY_TYPE, value = "text")]
    ),
    TypeDef(
        name = "pgsql_enum",
        typeClass = PostgreSQLEnumType::class
        ),
    TypeDef(
        name = "jsonb",
        typeClass = JsonBinaryType::class
    ),

)
@Table(name = "missions")
data class MissionModel(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id", unique = true, nullable = false)
    var id: Int? = null,
    @Column(name = "mission_types")
    @Type(type = "enum-array")
    var missionTypes: List<MissionTypeEnum>,
    @Column(name = "missionNature")
    @Type(type = "enum-array")
    var missionNature: List<MissionNatureEnum>? = listOf(),
    @Column(name = "open_by")
    var openBy: String? = null,
    @Column(name = "closed_by")
    var closedBy: String? = null,
    @Column(name = "observations_cacem")
    var observationsCacem: String? = null,
    @Column(name = "observations_cnsp")
    var observationsCnsp: String? = null,
    @Column(name = "facade")
    @Enumerated(EnumType.STRING)
    var facade: MissionSeaFrontEnum? = null,
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
    @Type(type = "pgsql_enum")
    val missionSource: MissionSourceEnum,
    @OneToMany(
        mappedBy = "mission",
        cascade = [CascadeType.ALL],
        orphanRemoval = true
    )
    @JsonManagedReference
    @Fetch(value = FetchMode.SUBSELECT)
    var envActions: MutableList<EnvActionModel>? = ArrayList(),
    @OneToMany(
            mappedBy = "mission",
            cascade = [CascadeType.ALL],
            orphanRemoval = true
    )
    @JsonManagedReference
    @Fetch(value = FetchMode.SUBSELECT)
    var controlResources: MutableList<MissionControlResourceModel>? = ArrayList(),
    @OneToMany(
        mappedBy = "mission",
        cascade = [CascadeType.ALL],
        orphanRemoval = true
    )
    @JsonManagedReference
    @Fetch(value = FetchMode.SUBSELECT)
    var controlUnits: MutableList<MissionControlUnitModel>? = ArrayList()
) {

    fun toMissionEntity(mapper: ObjectMapper) = MissionEntity(
        id = id,
        missionTypes = missionTypes,
        missionNature = if (missionNature === null) listOf() else missionNature,
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
        envActions = envActions!!.map { it.toActionEntity(mapper) },
        controlUnits = controlUnits?.map { unit ->
            val savedUnitResources = controlResources
                ?.filter { resource ->
                    resource.ressource.controlUnit?.id == unit.unit.id
                }
                ?.map { resource -> resource }

            unit.unit.toControlUnit().copy(
                contact = unit.contact,
                resources = savedUnitResources?.let { safeUnitResources -> safeUnitResources.map { it.ressource.toControlResource() } } ?: listOf()
            )
        } ?: listOf()
    )

    companion object {
        fun fromMissionEntity(mission: MissionEntity, mapper: ObjectMapper): MissionModel {
            val missionModel = MissionModel(
                id = mission.id,
                missionTypes = mission.missionTypes,
                missionNature = mission.missionNature,
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
                missionSource = mission.missionSource
            )

            mission.envActions?.map {
                missionModel.envActions?.add(EnvActionModel.fromEnvActionEntity(it, missionModel, mapper))
            }

            mission.controlUnits.map {
                val controlUnitModel = MissionControlUnitModel.fromControlUnitEntity(
                    it,
                    missionModel
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
        return this::class.simpleName + "(id = $id , missionTypes = $missionTypes , missionNature = $missionNature , openBy = $openBy , closedBy = $closedBy , observationsCacem = $observationsCacem, observationsCnsp = $observationsCnsp , facade = $facade , geom = $geom , startDateTimeUtc = $startDateTimeUtc , endDateTimeUtc = $endDateTimeUtc, isClosed = $isClosed, isDeleted = $isDeleted, missionSource = $missionSource )"
    }
}
