package fr.gouv.cacem.monitorenv.domain.use_cases

import com.nhaarman.mockitokotlin2.*
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository

import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.crud.missions.CreateMission
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension
import java.time.ZonedDateTime

@ExtendWith(SpringExtension::class)
class CreateMissionUTests {

  @MockBean
  private lateinit var missionRepository: IMissionRepository

  @Test
  fun `should create and return a new mission`() {
    // Given
    val expectedCreatedMission = MissionEntity(
      id = 0,
      missionType = MissionTypeEnum.LAND,
      missionStatus = "CLOSED",
      facade = "Outre-Mer",
      theme = "CONTROLE",
      inputStartDatetimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
      inputEndDatetimeUtc =  ZonedDateTime.parse("2022-01-23T20:29:03Z")
    )
    given(missionRepository.save(expectedCreatedMission)).willReturn(expectedCreatedMission)
    given(missionRepository.findMissionById(0)).willReturn(expectedCreatedMission)

    // When
    val createdMission = CreateMission(missionRepository).execute(expectedCreatedMission)

    // Then
    verify(missionRepository, times(1)).save(expectedCreatedMission)
    assertThat(createdMission).isEqualTo(expectedCreatedMission)
  }

}