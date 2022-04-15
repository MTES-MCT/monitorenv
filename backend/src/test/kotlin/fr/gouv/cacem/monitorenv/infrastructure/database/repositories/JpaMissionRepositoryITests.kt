package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity
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
  fun `save Should update mission`() {

    // Given
    val firstMission = MissionEntity(
      0,
      "SEA",
      "CLOSED",
      "Outre-Mer",
      "CONTROLE",
      ZonedDateTime.parse("2022-01-15T04:50:09Z"),
      ZonedDateTime.parse("2022-01-23T20:29:03Z"),
      110.126782000000006,
      -50.373736000000001
    )
    val expectedUpdatedMission = MissionEntity(
      0, "LAND", "CLOSED", "Outre-Mer", "CONTROLE", ZonedDateTime.parse("2022-01-15T04:50:09Z"),
      ZonedDateTime.parse("2022-01-23T20:29:03Z"), 110.126782000000006, -50.373736000000001
    )
    // When
//        assertThat(jpaMissionRepository.findMissionById(0)).isEqualTo(firstMission)
    val mission = jpaMissionRepository.save(expectedUpdatedMission)
    assertThat(jpaMissionRepository.findMissionById(0)).isEqualTo(expectedUpdatedMission)

  }

}
