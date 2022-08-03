package fr.gouv.cacem.monitorenv.domain.use_cases

import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionNatureEnum
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionStatusEnum
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.crud.missions.CreateMission

import com.nhaarman.mockitokotlin2.*
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
      missionType = MissionTypeEnum.LAND,
      missionNature = listOf(MissionNatureEnum.ENV),
      missionStatus = MissionStatusEnum.CLOSED,
      facade = "Outre-Mer",
      inputStartDatetimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
      inputEndDatetimeUtc =  ZonedDateTime.parse("2022-01-23T20:29:03Z")
    )
    given(missionRepository.create(expectedCreatedMission)).willReturn(expectedCreatedMission)

    // When
    val createdMission = CreateMission(missionRepository).execute(expectedCreatedMission)

    // Then
    verify(missionRepository, times(1)).create(expectedCreatedMission)
    assertThat(createdMission).isEqualTo(expectedCreatedMission)
  }

}