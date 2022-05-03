package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionTypeEnum
import com.vladmihalcea.hibernate.type.array.ListArrayType
import com.vladmihalcea.hibernate.type.json.JsonBinaryType
import org.hibernate.annotations.Type
import org.hibernate.annotations.TypeDef
import org.hibernate.annotations.TypeDefs
import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.missions.ActionEntity
import java.time.Instant
import java.time.ZoneOffset.UTC
import javax.persistence.*


@Entity
@TypeDefs(
  TypeDef(
    name = "jsonb",
    typeClass = JsonBinaryType::class
  ),
  TypeDef(
    name = "integer-array",
    typeClass = ListArrayType::class
  )
)
@Table(name = "missions")
data class MissionModel(
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
    var id: Int,
  @Column(name = "mission_type")
  @Enumerated(EnumType.STRING)
    var missionType: MissionTypeEnum,
  @Column(name = "unit")
    var unit: String? = null,
  @Column(name = "administration")
    var administration: String? = null,
  @Column(name = "mission_status")
    var missionStatus: String? = null,
  @Column(name = "author")
    var author: String? = null,
  @Column(name = "observations")
    var observations: String? = null,
  @Column(name = "facade")
    var facade: String? = null,
  @Column(name = "theme")
    var theme: String? = null,
  @Column(name = "input_start_datetime_utc")
    var inputStartDatetimeUtc: Instant? = null,
  @Column(name = "input_end_datetime_utc")
    var inputEndDatetimeUtc: Instant? = null,
  @Type(type = "jsonb")
  @Column(name = "actions", columnDefinition = "jsonb")
  val actions: String?
) {

  fun toMissionEntity(mapper: ObjectMapper) = MissionEntity(
    id = id,
    missionType = missionType,
    unit = unit,
    administration = administration,
    missionStatus = missionStatus,
    author = author,
    observations = observations,
    facade = facade,
    theme = theme,
    inputStartDatetimeUtc = inputStartDatetimeUtc?.atZone(UTC),
    inputEndDatetimeUtc = inputEndDatetimeUtc?.atZone(UTC),
    actions = if (actions === null) listOf() else mapper.readValue(actions, mapper.typeFactory
      .constructCollectionType(MutableList::class.java, ActionEntity::class.java))
  )

  companion object {
    fun fromMissionEntity(mission: MissionEntity, mapper: ObjectMapper) = MissionModel(
      id = mission.id,
      missionType = mission.missionType,
      unit = mission.unit,
      administration = mission.administration,
      missionStatus = mission.missionStatus,
      author = mission.author,
      observations = mission.observations,
      facade = mission.facade,
      theme = mission.theme,
      inputStartDatetimeUtc = mission.inputStartDatetimeUtc?.toInstant(),
      inputEndDatetimeUtc = mission.inputEndDatetimeUtc?.toInstant(),
      actions = if (mission.actions === null) null else mapper.writeValueAsString(mission.actions)
    )
  }
}
