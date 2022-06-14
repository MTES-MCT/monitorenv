package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.use_cases.crud.controlTopics.GetControlTopics
import fr.gouv.cacem.monitorenv.domain.use_cases.crud.controlTopics.GetControlTopicById
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs.*


import io.micrometer.core.instrument.MeterRegistry
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.n52.jackson.datatype.jts.JtsModule
import org.springframework.web.bind.annotation.*
import javax.websocket.server.PathParam

@RestController
@RequestMapping("/bff/v1/controltopics")
@Tag(name = "Control Topics", description = "API control topics")
class ControlTopicsController(
  private val getControlTopics: GetControlTopics,
  private val getControlTopicById: GetControlTopicById,
  meterRegistry: MeterRegistry
) {

  @GetMapping("")
  @Operation(summary = "Get control topics")
  fun getControlTopicsController(): String {
    val controlTopics = getControlTopics.execute()
    val controlTopicEntities = controlTopics.map { ControlTopicDataOutput.fromControlTopicEntity(it) }
    val mapper = ObjectMapper()
    mapper.registerModule(JtsModule())
    return mapper.writeValueAsString(controlTopicEntities)
  }

  @GetMapping("/{controlTopicId}")
  @Operation(summary = "Get regulatory area by Id")
  fun getControlTopicByIdController(
    @PathParam("controlTopic id")
    @PathVariable(name = "controlTopicId")
    controlTopicId: Int
  ): String {
    val controlTopic = getControlTopicById.execute(controlTopicId = controlTopicId)
    val mapper = ObjectMapper()
    mapper.registerModule(JtsModule())
    return mapper.writeValueAsString(controlTopic)
  }
}
