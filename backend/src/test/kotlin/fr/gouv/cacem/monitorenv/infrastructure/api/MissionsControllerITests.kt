package fr.gouv.cacem.monitorenv.infrastructure.api

import fr.gouv.cacem.monitorenv.MeterRegistryConfiguration
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.MissionsController
import fr.gouv.cacem.monitorenv.domain.entities.missions.*
import fr.gouv.cacem.monitorenv.domain.use_cases.crud.missions.CreateMission
import fr.gouv.cacem.monitorenv.domain.use_cases.crud.missions.GetMissionById
import fr.gouv.cacem.monitorenv.domain.use_cases.crud.missions.GetMissions
import fr.gouv.cacem.monitorenv.domain.use_cases.crud.missions.UpdateMission
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.inputs.CreateOrUpdateMissionDataInput


import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.BDDMockito.any
import org.mockito.BDDMockito.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.ZonedDateTime
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import com.fasterxml.jackson.databind.ObjectMapper


@Import(MeterRegistryConfiguration::class)
@ExtendWith(SpringExtension::class)
@WebMvcTest(value = [(MissionsController::class)])
class MissionsControllerITests {

  @Autowired
  private lateinit var mockMvc: MockMvc

  @MockBean
  private lateinit var createMission: CreateMission

  @MockBean
  private lateinit var getMissions: GetMissions

  @MockBean
  private lateinit var getMissionById: GetMissionById

  @MockBean
  private lateinit var updateMission: UpdateMission

  @Autowired
  private lateinit var objectMapper: ObjectMapper

  @Test
  fun `Should create a new mission`() {
    // Given
    val newMission = MissionEntity(
      id = 10,
      missionType = MissionTypeEnum.LAND,
      missionStatus = "CLOSED",
      facade = "Outre-Mer",
      theme = "CONTROLE",
      observations = null,
      inputStartDatetimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
      inputEndDatetimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z")
    )
    val newMissionRequest = CreateOrUpdateMissionDataInput(
      id = 10,
      missionType = MissionTypeEnum.LAND,
      missionStatus = "CLOSED",
      facade = "Outre-Mer",
      theme = "CONTROLE",
      observations = null,
      inputStartDatetimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
      inputEndDatetimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z")
    )

    // given(this.createMission.execute(any())).willReturn(newMission)
    given(this.createMission.execute(any())).willAnswer {
      println("=======MISSION=============")
      println("request as text")
      println(objectMapper.writeValueAsString(newMissionRequest))
      println("newMissionRequest.toMissionEntity")
      println(newMissionRequest.toMissionEntity())
      println("function called with")
      println(it)
      // Error parsing dates in tests
      // 2022-01-15T04:50:09Z[UTC] (it) instead of 2022-01-15T04:50:09Z (requestBody.toMissionEntity())
      print("====================")
      return@willAnswer newMission
    }
    // When
    mockMvc.perform(
      put("/bff/v1/missions")
      .content(objectMapper.writeValueAsString(newMissionRequest))
      .contentType(MediaType.APPLICATION_JSON)
    )
      // Then
      .andExpect(status().isOk)
  }

  @Test
  fun `Should get all missions`() {
    // Given
    val firstMission = MissionEntity(
      id = 10,
      missionType = MissionTypeEnum.SEA,
      missionStatus = "CLOSED",
      facade = "Outre-Mer",
      theme = "CONTROLE",
      observations = null,
      inputStartDatetimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
      inputEndDatetimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
    )
    given(this.getMissions.execute()).willReturn(listOf(firstMission))

    // When
    mockMvc.perform(get("/bff/v1/missions"))
      // Then
      .andExpect(status().isOk)
      .andExpect(jsonPath("$[0].id", equalTo(firstMission.id)))
      .andExpect(jsonPath("$[0].missionType", equalTo(firstMission.missionType.toString())))
      .andExpect(jsonPath("$[0].missionStatus", equalTo(firstMission.missionStatus)))
      .andExpect(jsonPath("$[0].facade", equalTo(firstMission.facade)))
      .andExpect(jsonPath("$[0].theme", equalTo(firstMission.theme)))
      .andExpect(jsonPath("$[0].inputStartDatetimeUtc", equalTo(firstMission.inputStartDatetimeUtc.toString())))
      .andExpect(jsonPath("$[0].inputEndDatetimeUtc", equalTo(firstMission.inputEndDatetimeUtc.toString())))
  }

  @Test
  fun `Should get specific mission when requested by Id`() {
    // Given
    val firstMission = MissionEntity(
      id = 10,
      missionType = MissionTypeEnum.SEA,
      missionStatus = "CLOSED",
      facade = "Outre-Mer",
      theme = "CONTROLE",
      observations = null,
      inputStartDatetimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
      inputEndDatetimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
    )
    given(this.getMissionById.execute(0)).willReturn(firstMission)

    // When
    mockMvc.perform(get("/bff/v1/missions/0"))
      // Then
      .andExpect(status().isOk)
      .andExpect(jsonPath("$.id", equalTo(firstMission.id)))
      .andExpect(jsonPath("$.missionType", equalTo(firstMission.missionType.toString())))
      .andExpect(jsonPath("$.missionStatus", equalTo(firstMission.missionStatus)))
      .andExpect(jsonPath("$.facade", equalTo(firstMission.facade)))
      .andExpect(jsonPath("$.theme", equalTo(firstMission.theme)))
      .andExpect(jsonPath("$.inputStartDatetimeUtc", equalTo(firstMission.inputStartDatetimeUtc.toString())))
      .andExpect(jsonPath("$.inputEndDatetimeUtc", equalTo(firstMission.inputEndDatetimeUtc.toString())))
  }

  @Test
  fun `Should update mission`() {
    // Given
    val expectedUpdatedMission = MissionEntity(
      id = 10,
      missionType = MissionTypeEnum.LAND,
      missionStatus = "CLOSED",
      facade = "Outre-Mer",
      theme = "CONTROLE",
      observations = null,
      inputStartDatetimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
      inputEndDatetimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z")
    )
    val requestBody = CreateOrUpdateMissionDataInput(
      id = 10,
      missionType = MissionTypeEnum.LAND,
      missionStatus = "CLOSED",
      facade = "Outre-Mer",
      theme = "CONTROLE",
      observations = null,
      inputStartDatetimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
      inputEndDatetimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z")
    )
//    given(this.updateMission.execute(requestBody.toMissionEntity())).willReturn(expectedUpdatedMission)
    given(this.updateMission.execute(any())).willAnswer {
      println("=======MISSION=============")
      println("request as text")
      println(objectMapper.writeValueAsString(requestBody))
      println("requestBody.toMissionEntity")
      println(requestBody.toMissionEntity())
      println("function called with")
      println(it)
      // Error parsing dates in tests
      // 2022-01-15T04:50:09Z[UTC] (it) instead of 2022-01-15T04:50:09Z (requestBody.toMissionEntity())
      print("====================")
       return@willAnswer expectedUpdatedMission
     }
    // When
    mockMvc.perform(
      put("/bff/v1/missions/0")
        .content(objectMapper.writeValueAsString(requestBody))
        .contentType(MediaType.APPLICATION_JSON)
    )
      // Then
      .andExpect(status().isOk)
  }
}
