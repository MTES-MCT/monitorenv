package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonIdentityInfo
import com.fasterxml.jackson.annotation.JsonManagedReference
import com.fasterxml.jackson.annotation.ObjectIdGenerators
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.vladmihalcea.hibernate.type.array.EnumArrayType
import com.vladmihalcea.hibernate.type.array.ListArrayType
import com.vladmihalcea.hibernate.type.json.JsonBinaryType
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionNatureEnum
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionTypeEnum
import org.hibernate.Hibernate
import org.hibernate.annotations.*
import org.locationtech.jts.geom.MultiPolygon
import org.n52.jackson.datatype.jts.GeometryDeserializer
import org.n52.jackson.datatype.jts.GeometrySerializer
import java.time.Instant
import java.time.ZoneOffset.UTC
import javax.persistence.*
import javax.persistence.CascadeType
import javax.persistence.Entity
import javax.persistence.Table

@JsonIdentityInfo(
    generator = ObjectIdGenerators.PropertyGenerator::class,
    property = "id"
)
@Entity
@TypeDefs(
    TypeDef(
        name = "enum-array",
        typeClass = ListArrayType::class,
        parameters = [org.hibernate.annotations.Parameter(name = EnumArrayType.SQL_ARRAY_TYPE, value = "text")]
    ),
    TypeDef(
        name = "jsonb",
        typeClass = JsonBinaryType::class
    )
)
@Table(name = "missions")
data class MissionModel(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id", unique = true, nullable = false)
    var id: Int? = null,
    @Column(name = "mission_type")
    @Enumerated(EnumType.STRING)
    var missionType: MissionTypeEnum,
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
    var facade: String? = null,
    @JsonSerialize(using = GeometrySerializer::class)
    @JsonDeserialize(contentUsing = GeometryDeserializer::class)
    @Column(name = "geom")
    var geom: MultiPolygon? = null,
    @Column(name = "input_start_datetime_utc")
    var inputStartDateTimeUtc: Instant,
    @Column(name = "input_end_datetime_utc")
    var inputEndDateTimeUtc: Instant? = null,
    @Column(name = "closed", nullable = false)
    val isClosed: Boolean,
    @Column(name = "deleted", nullable = false)
    val isDeleted: Boolean,
    @Column(name = "mission_source", nullable = false)
    @Enumerated(EnumType.STRING)
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
        missionType = missionType,
        missionNature = if (missionNature === null) listOf() else missionNature,
        openBy = openBy,
        closedBy = closedBy,
        observationsCacem = observationsCacem,
        observationsCnsp = observationsCnsp,
        facade = facade,
        geom = geom,
        inputStartDateTimeUtc = inputStartDateTimeUtc.atZone(UTC),
        inputEndDateTimeUtc = inputEndDateTimeUtc?.atZone(UTC),
        isClosed = isClosed,
        isDeleted = isDeleted,
        missionSource = missionSource,
        envActions = envActions!!.map { it.toActionEntity(mapper) },
        controlUnits = controlUnits?.map { unit ->
            val savedUnitResources = controlResources
                ?.filter { resource ->
                    resource.ressource.controlUnit?.id == unit.unit.id
                }
                ?.map { resource -> resource.ressource }

            unit.unit.toControlUnit().copy(
                contact = unit.contact,
                resources = savedUnitResources?.let { safeUnitResources -> safeUnitResources.map { it.toControlResource() } } ?: listOf()
            )
        } ?: listOf()
    )

    companion object {
        fun fromMissionEntity(mission: MissionEntity, mapper: ObjectMapper): MissionModel {
            val missionModel = MissionModel(
                id = mission.id,
                missionType = mission.missionType,
                missionNature = mission.missionNature,
                openBy = mission.openBy,
                closedBy = mission.closedBy,
                observationsCacem = mission.observationsCacem,
                observationsCnsp = mission.observationsCnsp,
                facade = mission.facade,
                geom = mission.geom,
                inputStartDateTimeUtc = mission.inputStartDateTimeUtc.toInstant(),
                inputEndDateTimeUtc = mission.inputEndDateTimeUtc?.toInstant(),
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
        return this::class.simpleName + "(id = $id , missionType = $missionType , missionNature = $missionNature , openBy = $openBy , closedBy = $closedBy , observationsCacem = $observationsCacem, observationsCnsp = $observationsCnsp , facade = $facade , geom = $geom , inputStartDateTimeUtc = $inputStartDateTimeUtc , inputEndDateTimeUtc = $inputEndDateTimeUtc, isClosed = $isClosed, isDeleted = $isDeleted, missionSource = $missionSource )"
    }
}
