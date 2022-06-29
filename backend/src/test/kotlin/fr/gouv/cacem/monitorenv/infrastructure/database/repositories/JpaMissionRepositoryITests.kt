package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionTypeEnum
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime

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
    val firstMission = MissionEntity(
      id = 10,
      missionType = MissionTypeEnum.SEA,
      administration = "ULAM",
      unit = "Aff Mar 01",
      resources = listOf(),
      missionStatus = "OPEN",
      author = "Evan Castro",
      facade = "MEMN",
      theme = "ENV",
      observations = "Air data now. Husband prove born rise his everything order. Range memory control room evidence firm adult.",
      inputStartDatetimeUtc = ZonedDateTime.parse("2022-01-20T07:41:28Z"),
      inputEndDatetimeUtc = ZonedDateTime.parse("2022-02-11T11:18:25Z"),
      actions = listOf()
    )
    val mission = jpaMissionRepository.findMissionById(10)

    assertThat(mission).isEqualTo(firstMission)
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
      missionStatus = "CLOSED",
      facade = "Outre-Mer",
      theme = "CONTROLE",
      geom = Polygon,
      observations = null,
      inputStartDatetimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
      inputEndDatetimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
      actions = listOf()
    )
    // When
    val mission = jpaMissionRepository.save(expectedUpdatedMission)
    assertThat(jpaMissionRepository.findMissionById(10)).isEqualTo(expectedUpdatedMission)

  }

}
