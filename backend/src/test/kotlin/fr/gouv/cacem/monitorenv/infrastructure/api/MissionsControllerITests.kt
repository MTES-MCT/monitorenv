package fr.gouv.cacem.monitorenv.infrastructure.api

import fr.gouv.cacem.monitorenv.MeterRegistryConfiguration
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.MissionsController
import fr.gouv.cacem.monitorenv.domain.entities.missions.*
import fr.gouv.cacem.monitorenv.domain.use_cases.crud.missions.GetMissionById
import fr.gouv.cacem.monitorenv.domain.use_cases.crud.missions.GetMissions
import fr.gouv.cacem.monitorenv.domain.use_cases.crud.missions.UpdateMission
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.inputs.UpdateMissionDataInput


import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
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
import org.mockito.BDDMockito.any

@Import(MeterRegistryConfiguration::class)
@ExtendWith(SpringExtension::class)
@WebMvcTest(value = [(MissionsController::class)])
class MissionsControllerITests {

  @Autowired
  private lateinit var mockMvc: MockMvc

  @MockBean
  private lateinit var getMissions: GetMissions

  @MockBean
  private lateinit var getMissionById: GetMissionById

  @MockBean
  private lateinit var updateMission: UpdateMission

  @Autowired
  private lateinit var objectMapper: ObjectMapper

  @Test
  fun `Should get all missions`() {
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
    given(this.getMissions.execute()).willReturn(listOf(firstMission))

    // When
    mockMvc.perform(get("/bff/v1/missions"))
      // Then
      .andExpect(status().isOk)
      .andExpect(jsonPath("$[0].id", equalTo(firstMission.id)))
      .andExpect(jsonPath("$[0].typeMission", equalTo(firstMission.typeMission)))
      .andExpect(jsonPath("$[0].statusMission", equalTo(firstMission.statusMission)))
      .andExpect(jsonPath("$[0].facade", equalTo(firstMission.facade)))
      .andExpect(jsonPath("$[0].theme", equalTo(firstMission.theme)))
      .andExpect(jsonPath("$[0].inputStartDatetimeUtc", equalTo(firstMission.inputStartDatetimeUtc.toString())))
      .andExpect(jsonPath("$[0].inputEndDatetimeUtc", equalTo(firstMission.inputEndDatetimeUtc.toString())))
      .andExpect(jsonPath("$[0].latitude", equalTo(firstMission.latitude)))
      .andExpect(jsonPath("$[0].longitude", equalTo(firstMission.longitude)))
  }

  @Test
  fun `Should get specific mission when requested by Id`() {
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
    given(this.getMissionById.execute(0)).willReturn(firstMission)

    // When
    mockMvc.perform(get("/bff/v1/missions/0"))
      // Then
      .andExpect(status().isOk)
      .andExpect(jsonPath("$.id", equalTo(firstMission.id)))
      .andExpect(jsonPath("$.typeMission", equalTo(firstMission.typeMission)))
      .andExpect(jsonPath("$.statusMission", equalTo(firstMission.statusMission)))
      .andExpect(jsonPath("$.facade", equalTo(firstMission.facade)))
      .andExpect(jsonPath("$.theme", equalTo(firstMission.theme)))
      .andExpect(jsonPath("$.inputStartDatetimeUtc", equalTo(firstMission.inputStartDatetimeUtc.toString())))
      .andExpect(jsonPath("$.inputEndDatetimeUtc", equalTo(firstMission.inputEndDatetimeUtc.toString())))
      .andExpect(jsonPath("$.latitude", equalTo(firstMission.latitude)))
      .andExpect(jsonPath("$.longitude", equalTo(firstMission.longitude)))
  }

  @Test
  fun `Should update mission`() {
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
      0,
      "LAND",
      "CLOSED",
      "Outre-Mer",
      "CONTROLE",
      ZonedDateTime.parse("2022-01-15T04:50:09Z"),
      ZonedDateTime.parse("2022-01-23T20:29:03Z"),
      110.126782000000006,
      -50.373736000000001
    )
    val requestBody = UpdateMissionDataInput(
      0,
      "LAND",
      "CLOSED",
      "Outre-Mer",
      "CONTROLE",
      ZonedDateTime.parse("2022-01-15T04:50:09Z"),
      ZonedDateTime.parse("2022-01-23T20:29:03Z"),
      110.126782000000006,
      -50.373736000000001
    )
    given(this.updateMission.execute(any())).willReturn(expectedUpdatedMission)
    println(objectMapper.writeValueAsString(requestBody))
    // When
    mockMvc.perform(
      put("/bff/v1/missions/0")
        .content(objectMapper.writeValueAsString(requestBody))
        .contentType(MediaType.APPLICATION_JSON)
    )
      // Then
      .andExpect(status().isOk)
//             .andExpect(jsonPath("$.id", equalTo(expectedUpdatedMission.id)))
//             .andExpect(jsonPath("$.typeMission", equalTo(expectedUpdatedMission.typeMission)))
//             .andExpect(jsonPath("$.statusMission", equalTo(expectedUpdatedMission.statusMission)))
//             .andExpect(jsonPath("$.facade", equalTo(expectedUpdatedMission.facade)))
//             .andExpect(jsonPath("$.theme", equalTo(expectedUpdatedMission.theme)))
//             .andExpect(jsonPath("$.inputStartDatetimeUtc", equalTo(expectedUpdatedMission.inputStartDatetimeUtc.toString())))
//             .andExpect(jsonPath("$.inputEndDatetimeUtc", equalTo(expectedUpdatedMission.inputEndDatetimeUtc.toString())))
//             .andExpect(jsonPath("$.latitude", equalTo(expectedUpdatedMission.latitude)))
//             .andExpect(jsonPath("$.longitude", equalTo(expectedUpdatedMission.longitude)))
    // Mockito.verify()
  }
}
