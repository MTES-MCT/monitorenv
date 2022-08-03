package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.missions.*
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime
import java.util.*

class JpaMissionRepositoryITests : AbstractDBTests() {

  @Autowired
  private lateinit var jpaMissionRepository: JpaMissionRepository
  @Test
  @Transactional
  fun `createMission should create a new mission`() {
    val existingMissions = jpaMissionRepository.findMissions()
    assertThat(existingMissions).hasSize(50)
    val newMission = MissionEntity(
      missionType = MissionTypeEnum.SEA
    )
    // When
    val newMissionReturn = jpaMissionRepository.create(newMission)
    val missions = jpaMissionRepository.findMissions()

    assertThat(missions).hasSize(51)
  }
  @Test
  @Transactional
  fun `findMissions Should return all missions`() {
    // When
    val missions = jpaMissionRepository.findMissions()

    assertThat(missions).hasSize(50)
  }

  @Test
  @Transactional
  fun `findMission Should return specified mission`() {
    // When
    val WKTreader = WKTReader()
    val multipolygonString = "MULTIPOLYGON (((-4.53067773779771 48.3613194350883, -4.52983887484088 48.3623972676965, -4.52937220280597 48.3625305872134, -4.52765829191134 48.3614472612989, -4.52765005762466 48.3612944126839, -4.52939721119323 48.3605333284306, -4.53067773779771 48.3613194350883)))"
    val Polygon = WKTreader.read(multipolygonString) as MultiPolygon
    val firstMission = MissionEntity(
      id = 10,
      missionType = MissionTypeEnum.AIR,
      missionNature = listOf(MissionNatureEnum.ENV, MissionNatureEnum.FISH),
      administration = "Gendarmerie nationale",
      unit = "PM 474 Bastia",
      resources = listOf("CALISTO", "ULAM"),
      missionStatus = MissionStatusEnum.CLOSED,
      open_by = "Susan Thornton",
      closed_by = "Marvin Andrews",
      facade = "MEMN",
      observations = "Research final develop world hit hold. Teacher scientist run age.",
      inputStartDatetimeUtc = ZonedDateTime.parse("2022-07-08T15:15:33Z"),
      inputEndDatetimeUtc = ZonedDateTime.parse("2022-07-13T22:27:46Z"),
      geom = Polygon,
      envActions = listOf()
    )
    val mission = jpaMissionRepository.findMissionById(10)

    assertThat(mission).isEqualTo(firstMission)
  }

  @Test
  @Transactional
  fun `findMission Should return specified mission and associated env actions`() {
    // When
    val mission = jpaMissionRepository.findMissionById(14)
    assertThat(mission.id).isEqualTo(14)
    assertThat(mission.envActions).hasSize(3)
  }

  @Test
  @Transactional
  fun `save Should update mission`() {

    // Given
    val WKTreader = WKTReader()
    val multipolygonString =
      "MULTIPOLYGON (((-4.54877816747593 48.305559876971, -4.54997332394943 48.3059760121399, -4.54998501370013 48.3071882334181, -4.54879290083417 48.3067746138142, -4.54877816747593 48.305559876971)))"
    val Polygon = WKTreader.read(multipolygonString) as MultiPolygon

    val expectedUpdatedMission = MissionEntity(
      id = 10,
      missionType= MissionTypeEnum.LAND,
      missionNature = listOf(MissionNatureEnum.FISH, MissionNatureEnum.ENV),
      missionStatus = MissionStatusEnum.CLOSED,
      facade = "MEMN",
      geom = Polygon,
      observations = null,
      inputStartDatetimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
      inputEndDatetimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
      envActions = listOf()
    )
    // When
    val mission = jpaMissionRepository.save(expectedUpdatedMission)
    assertThat(jpaMissionRepository.findMissionById(10)).isEqualTo(expectedUpdatedMission)

  }

  @Test
  @Transactional
  fun `save Should update mission with associated envActions`() {

    // Given
    val wktReader = WKTReader()
    val multipolygonString =
      "MULTIPOLYGON (((-4.54877816747593 48.305559876971, -4.54997332394943 48.3059760121399, -4.54998501370013 48.3071882334181, -4.54879290083417 48.3067746138142, -4.54877816747593 48.305559876971)))"
    val polygon = wktReader.read(multipolygonString) as MultiPolygon

    val envAction = EnvActionControlEntity(
      id = UUID.fromString("bf9f4062-83d3-4a85-b89b-76c0ded6473d"),
      actionTargetType = "VEHICLE",
      vehicleType = "VESSEL",
      actionNumberOfControls= 4
    )
    val expectedUpdatedMission = MissionEntity(
      id = 10,
      missionType= MissionTypeEnum.LAND,
      missionNature = listOf(MissionNatureEnum.FISH, MissionNatureEnum.ENV),
      missionStatus = MissionStatusEnum.CLOSED,
      facade = "NAMO",
      geom = polygon,
      observations = null,
      inputStartDatetimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
      inputEndDatetimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
      envActions = listOf(envAction)
    )
    // When
    val mission = jpaMissionRepository.save(expectedUpdatedMission)
    val updatedMission = jpaMissionRepository.findMissionById(10)
    assertThat(updatedMission).isEqualTo(expectedUpdatedMission)

  }

}
