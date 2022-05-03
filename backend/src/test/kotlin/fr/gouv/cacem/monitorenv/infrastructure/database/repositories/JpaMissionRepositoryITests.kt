package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionTypeEnum
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime

class JpaMissionRepositoryITests : AbstractDBTests() {

  @Autowired
  private lateinit var jpaMissionRepository: JpaMissionRepository

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
      missionType= MissionTypeEnum.SEA,
      missionStatus = "OPEN",
      facade = "MED",
      theme = "CONTROLE",
      observations = "Offer watch bank activity. During response letter. Indeed allow bill animal.",
      inputStartDatetimeUtc = ZonedDateTime.parse("2022-03-05T01:34:39Z"),
      inputEndDatetimeUtc = ZonedDateTime.parse("2022-04-26T22:11:17Z"),
      actions = listOf()
    )
    val mission = jpaMissionRepository.findMissionById(10)

    assertThat(mission).isEqualTo(firstMission)
  }

  @Test
  @Transactional
  fun `save Should update mission`() {

    // Given
    val expectedUpdatedMission = MissionEntity(
      id = 10,
      missionType= MissionTypeEnum.LAND,
      missionStatus = "CLOSED",
      facade = "Outre-Mer",
      theme = "CONTROLE",
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
