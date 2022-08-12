package fr.gouv.cacem.monitorenv.infrastructure.api

import fr.gouv.cacem.monitorenv.MeterRegistryConfiguration
import fr.gouv.cacem.monitorenv.domain.entities.controlTopics.ControlTopicEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.crud.controlTopics.*
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.ControlTopicsController

import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.BDDMockito.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.context.annotation.Import
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import com.fasterxml.jackson.databind.ObjectMapper

@Import(MeterRegistryConfiguration::class)
@ExtendWith(SpringExtension::class)
@WebMvcTest(value = [(ControlTopicsController::class)])
class ControlTopicsControllerITests {

  @Autowired
  private lateinit var mockMvc: MockMvc

  @MockBean
  private lateinit var getControlTopics: GetControlTopics

  @MockBean
  private lateinit var getControlTopicById: GetControlTopicById

  @Autowired
  private lateinit var objectMapper: ObjectMapper

  @Test
  fun `Should get all control topics`() {
    // Given

    val controlTopic = ControlTopicEntity(
      id = 1,
      topic_level_1 = "Police des mouillages",
      topic_level_2 = "Mouillage individuel"
    )
    given(this.getControlTopics.execute()).willReturn(listOf(controlTopic))

    // When
    mockMvc.perform(get("/bff/v1/controltopics"))
      // Then
      .andExpect(status().isOk)
      .andExpect(jsonPath("$[0].id", equalTo(controlTopic.id)))
      .andExpect(jsonPath("$[0].topic_level_1", equalTo(controlTopic.topic_level_1)))
      .andExpect(jsonPath("$[0].topic_level_2", equalTo(controlTopic.topic_level_2)))
  }

  @Test
  fun `Should get specific control topic when requested by Id`() {
    // Given

    val controlTopic = ControlTopicEntity(
      id = 1,
      topic_level_1 = "Police des mouillages",
      topic_level_2 = "Mouillage individuel"
    )

    given(this.getControlTopicById.execute(3)).willReturn(controlTopic)

    // When
    mockMvc.perform(get("/bff/v1/controltopics/3"))
      // Then
      .andExpect(status().isOk)
      .andExpect(jsonPath("$.id", equalTo(controlTopic.id)))
      .andExpect(jsonPath("$.topic_level_1", equalTo(controlTopic.topic_level_1)))
      .andExpect(jsonPath("$.topic_level_2", equalTo(controlTopic.topic_level_2)))
  }
}
