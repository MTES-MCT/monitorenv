package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionType

import com.vladmihalcea.hibernate.type.array.ListArrayType
import com.vladmihalcea.hibernate.type.json.JsonBinaryType
import org.hibernate.annotations.TypeDef
import org.hibernate.annotations.TypeDefs
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
  var missionType: MissionType,
  @Column(name = "mission_status")
  var missionStatus: String? = null,
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
) {

  fun toMission() = MissionEntity(
    id = id,
    missionType = missionType,
    missionStatus = missionStatus,
    observations = observations,
    facade = facade,
    theme = theme,
    inputStartDatetimeUtc = inputStartDatetimeUtc?.atZone(UTC),
    inputEndDatetimeUtc = inputEndDatetimeUtc?.atZone(UTC),
  )

  companion object {
    fun fromMissionEntity(mission: MissionEntity) = MissionModel(
      id = mission.id,
      missionType = mission.missionType,
      missionStatus = mission.missionStatus,
      observations = mission.observations,
      inputStartDatetimeUtc = mission.inputStartDatetimeUtc?.toInstant(),
      inputEndDatetimeUtc = mission.inputEndDatetimeUtc?.toInstant(),
      facade = mission.facade,
      theme = mission.theme
    )
  }
}
