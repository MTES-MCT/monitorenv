package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.missions.*

import com.fasterxml.jackson.annotation.JsonIdentityInfo
import com.fasterxml.jackson.annotation.JsonManagedReference
import com.fasterxml.jackson.annotation.ObjectIdGenerators
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.vladmihalcea.hibernate.type.array.ListArrayType
import com.vladmihalcea.hibernate.type.array.EnumArrayType
import org.hibernate.annotations.Type
import org.hibernate.annotations.TypeDef
import org.hibernate.annotations.TypeDefs
import org.hibernate.Hibernate
import org.locationtech.jts.geom.MultiPolygon
import org.n52.jackson.datatype.jts.GeometryDeserializer
import org.n52.jackson.datatype.jts.GeometrySerializer
import java.time.Instant
import java.time.ZoneOffset.UTC
import javax.persistence.*

@JsonIdentityInfo(
  generator = ObjectIdGenerators.PropertyGenerator::class,
  property = "id")
@Entity
@TypeDefs(
  TypeDef(
    name = "string-array",
    typeClass = ListArrayType::class
  ),
  TypeDef(
    name = "enum-array",
    typeClass = ListArrayType::class,
    parameters = [org.hibernate.annotations.Parameter(name=EnumArrayType.SQL_ARRAY_TYPE, value="text")]
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
  @Column(name = "unit")
    var unit: String? = null,
  @Column(name = "administration")
    var administration: String? = null,
  @Column(name = "resources", columnDefinition = "text[]")
  @Type(type = "string-array")
    var resources: List<String>? = listOf(),
  @Column(name = "mission_status")
  @Enumerated(EnumType.STRING)
    var missionStatus: MissionStatusEnum? = null,
  @Column(name = "open_by")
    var open_by: String? = null,
  @Column(name = "closed_by")
    var closed_by: String? = null,
  @Column(name = "observations")
    var observations: String? = null,
  @Column(name = "facade")
    var facade: String? = null,
  @JsonSerialize(using = GeometrySerializer::class)
  @JsonDeserialize(contentUsing = GeometryDeserializer::class)
  @Column(name = "geom")
    var geom: MultiPolygon? = null,
  @Column(name = "input_start_datetime_utc")
    var inputStartDatetimeUtc: Instant? = null,
  @Column(name = "input_end_datetime_utc")
    var inputEndDatetimeUtc: Instant? = null,
  @OneToMany(fetch = FetchType.EAGER,
    mappedBy = "mission",
    cascade = [CascadeType.ALL],
    orphanRemoval = true)
  @JsonManagedReference
    var envActions: MutableList<EnvActionModel>? = ArrayList()
) {

  fun toMissionEntity(mapper: ObjectMapper) = MissionEntity(
    id = id,
    missionType = missionType,
    missionNature = if (missionNature === null) listOf() else missionNature,
    administration = administration,
    unit = unit,
    resources = if (resources === null) listOf() else resources,
    missionStatus = missionStatus,
    open_by = open_by,
    closed_by = closed_by,
    observations = observations,
    facade = facade,
    geom = geom,
    inputStartDatetimeUtc = inputStartDatetimeUtc?.atZone(UTC),
    inputEndDatetimeUtc = inputEndDatetimeUtc?.atZone(UTC),
    envActions = envActions!!.map {it.toActionEntity(mapper)}
  )

  companion object {
    fun fromMissionEntity(mission: MissionEntity, mapper: ObjectMapper):MissionModel {
      val missionModel = MissionModel(
        id = mission.id,
        missionType = mission.missionType,
        missionNature = mission.missionNature,
        administration = mission.administration,
        unit = mission.unit,
        resources = mission.resources,
        missionStatus = mission.missionStatus,
        open_by = mission.open_by,
        closed_by = mission.closed_by,
        observations = mission.observations,
        facade = mission.facade,
        geom = mission.geom,
        inputStartDatetimeUtc = mission.inputStartDatetimeUtc?.toInstant(),
        inputEndDatetimeUtc = mission.inputEndDatetimeUtc?.toInstant(),
      )
      mission.envActions?.map {
        missionModel.envActions?.add(EnvActionModel.fromEnvActionEntity(it, missionModel, mapper))
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
    return this::class.simpleName + "(id = $id , missionType = $missionType , missionNature = $missionNature , unit = $unit , administration = $administration , resources = $resources , missionStatus = $missionStatus , open_by = $open_by , closed_by = $closed_by , observations = $observations , facade = $facade , geom = $geom , inputStartDatetimeUtc = $inputStartDatetimeUtc , inputEndDatetimeUtc = $inputEndDatetimeUtc )"
  }
}
