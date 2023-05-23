package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.use_cases.semaphores.GetSemaphoreById
import fr.gouv.cacem.monitorenv.domain.use_cases.semaphores.GetSemaphores
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs.SemaphoreDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.n52.jackson.datatype.jts.JtsModule
import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/v1/semaphores")
@Tag(description = "API Semaphores", name = "Semaphores")
class SemaphoresController (private val getSemaphores: GetSemaphores, private val getSemaphoreById: GetSemaphoreById) {
  @GetMapping("")
  @Operation(summary = "Get all semaphores")
  fun getSemaphoresController(): String {
    val semaphores = getSemaphores.execute()
    val mapper = ObjectMapper()
    mapper.registerModule(JtsModule())
    return mapper.writeValueAsString(semaphores.map { SemaphoreDataOutput.fromSemaphoreEntity(it) })
  }
  @GetMapping("/{semaphoreId}")
  @Operation(summary = "Get semaphore by Id")
  fun getSemaphoreByIdController(
    @PathParam("semaphore id")
    @PathVariable(name = "semaphoreId")
    semaphoreId: Int
  ): String {
    val semaphore = getSemaphoreById.execute(semaphoreId)
    val mapper = ObjectMapper()
    mapper.registerModule(JtsModule())
    return mapper.writeValueAsString(SemaphoreDataOutput.fromSemaphoreEntity(semaphore))
  }
}