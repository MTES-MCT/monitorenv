package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity

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
  @Column(name = "id")
  var id: Int,
  @Column(name = "type_mission")
  var typeMission: String? = null,
  @Column(name = "status_mission")
  var statusMission: String? = null,
  @Column(name = "input_start_datetime_utc")
  var inputStartDatetimeUtc: Instant? = null,
  @Column(name = "input_end_datetime_utc")
  var inputEndDatetimeUtc: Instant? = null,
  @Column(name = "facade")
  var facade: String? = null,
  @Column(name = "longitude")
  var longitude: Double? = null,
  @Column(name = "latitude")
  var latitude: Double? = null,
  @Column(name = "theme")
  var theme: String? = null
) {

  fun toMission() = MissionEntity(
    id = id,
    typeMission = typeMission,
    statusMission = statusMission,
    inputStartDatetimeUtc = inputStartDatetimeUtc?.atZone(UTC),
    inputEndDatetimeUtc = inputEndDatetimeUtc?.atZone(UTC),
    facade = facade,
    longitude = longitude,
    latitude = latitude,
    theme = theme
  )

  companion object {
    fun fromMissionEntity(mission: MissionEntity) = MissionModel(
      id = mission.id,
      typeMission = mission.typeMission,
      statusMission = mission.statusMission,
      inputStartDatetimeUtc = mission.inputStartDatetimeUtc?.toInstant(),
      inputEndDatetimeUtc = mission.inputEndDatetimeUtc?.toInstant(),
      facade = mission.facade,
      longitude = mission.longitude,
      latitude = mission.latitude,
      theme = mission.theme
    )
  }
}
