package fr.gouv.cacem.monitorenv.infrastructure.api

import fr.gouv.cacem.monitorenv.MeterRegistryConfiguration
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.OperationsController
import fr.gouv.cacem.monitorenv.domain.entities.operations.*
import fr.gouv.cacem.monitorenv.domain.use_cases.crud.operations.GetOperationById
import fr.gouv.cacem.monitorenv.domain.use_cases.crud.operations.GetOperations
import fr.gouv.cacem.monitorenv.domain.use_cases.crud.operations.UpdateOperation
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.inputs.UpdateOperationDataInput


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
@WebMvcTest(value = [(OperationsController::class)])
class OperationsControllerITests {

  @Autowired
  private lateinit var mockMvc: MockMvc

  @MockBean
  private lateinit var getOperations: GetOperations

  @MockBean
  private lateinit var getOperationById: GetOperationById

  @MockBean
  private lateinit var updateOperation: UpdateOperation

  @Autowired
  private lateinit var objectMapper: ObjectMapper

  @Test
  fun `Should get all operations`() {
    // Given
    val firstOperation = OperationEntity(
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
    given(this.getOperations.execute()).willReturn(listOf(firstOperation))

    // When
    mockMvc.perform(get("/bff/v1/operations"))
      // Then
      .andExpect(status().isOk)
      .andExpect(jsonPath("$[0].id", equalTo(firstOperation.id)))
      .andExpect(jsonPath("$[0].typeOperation", equalTo(firstOperation.typeOperation)))
      .andExpect(jsonPath("$[0].statusOperation", equalTo(firstOperation.statusOperation)))
      .andExpect(jsonPath("$[0].facade", equalTo(firstOperation.facade)))
      .andExpect(jsonPath("$[0].theme", equalTo(firstOperation.theme)))
      .andExpect(jsonPath("$[0].inputStartDatetimeUtc", equalTo(firstOperation.inputStartDatetimeUtc.toString())))
      .andExpect(jsonPath("$[0].inputEndDatetimeUtc", equalTo(firstOperation.inputEndDatetimeUtc.toString())))
      .andExpect(jsonPath("$[0].latitude", equalTo(firstOperation.latitude)))
      .andExpect(jsonPath("$[0].longitude", equalTo(firstOperation.longitude)))
  }

  @Test
  fun `Should get specific operation when requested by Id`() {
    // Given
    val firstOperation = OperationEntity(
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
    given(this.getOperationById.execute(0)).willReturn(firstOperation)

    // When
    mockMvc.perform(get("/bff/v1/operations/0"))
      // Then
      .andExpect(status().isOk)
      .andExpect(jsonPath("$.id", equalTo(firstOperation.id)))
      .andExpect(jsonPath("$.typeOperation", equalTo(firstOperation.typeOperation)))
      .andExpect(jsonPath("$.statusOperation", equalTo(firstOperation.statusOperation)))
      .andExpect(jsonPath("$.facade", equalTo(firstOperation.facade)))
      .andExpect(jsonPath("$.theme", equalTo(firstOperation.theme)))
      .andExpect(jsonPath("$.inputStartDatetimeUtc", equalTo(firstOperation.inputStartDatetimeUtc.toString())))
      .andExpect(jsonPath("$.inputEndDatetimeUtc", equalTo(firstOperation.inputEndDatetimeUtc.toString())))
      .andExpect(jsonPath("$.latitude", equalTo(firstOperation.latitude)))
      .andExpect(jsonPath("$.longitude", equalTo(firstOperation.longitude)))
  }

  @Test
  fun `Should update operation`() {
    // Given
    val firstOperation = OperationEntity(
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
    val expectedUpdatedOperation = OperationEntity(
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
    val requestBody = UpdateOperationDataInput(
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
    given(this.updateOperation.execute(any())).willReturn(expectedUpdatedOperation)
    println(objectMapper.writeValueAsString(requestBody))
    // When
    mockMvc.perform(
      put("/bff/v1/operations/0")
        .content(objectMapper.writeValueAsString(requestBody))
        .contentType(MediaType.APPLICATION_JSON)
    )
      // Then
      .andExpect(status().isOk)
//             .andExpect(jsonPath("$.id", equalTo(expectedUpdatedOperation.id)))
//             .andExpect(jsonPath("$.typeOperation", equalTo(expectedUpdatedOperation.typeOperation)))
//             .andExpect(jsonPath("$.statusOperation", equalTo(expectedUpdatedOperation.statusOperation)))
//             .andExpect(jsonPath("$.facade", equalTo(expectedUpdatedOperation.facade)))
//             .andExpect(jsonPath("$.theme", equalTo(expectedUpdatedOperation.theme)))
//             .andExpect(jsonPath("$.inputStartDatetimeUtc", equalTo(expectedUpdatedOperation.inputStartDatetimeUtc.toString())))
//             .andExpect(jsonPath("$.inputEndDatetimeUtc", equalTo(expectedUpdatedOperation.inputEndDatetimeUtc.toString())))
//             .andExpect(jsonPath("$.latitude", equalTo(expectedUpdatedOperation.latitude)))
//             .andExpect(jsonPath("$.longitude", equalTo(expectedUpdatedOperation.longitude)))
    // Mockito.verify()
  }
}
