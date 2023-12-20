package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.semaphores.GetAllSemaphores
import fr.gouv.cacem.monitorenv.domain.use_cases.semaphores.GetSemaphoreById
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.SemaphoreDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/v1/semaphores")
@Tag(description = "API Semaphores", name = "BFF.Semaphores")
class Semaphores(
    private val getAllSemaphores: GetAllSemaphores,
    private val getSemaphoreById: GetSemaphoreById,
) {
    @GetMapping("")
    @Operation(summary = "Get all semaphores")
    fun getAll(): List<SemaphoreDataOutput> {
        val semaphores = getAllSemaphores.execute()
        return semaphores.map { SemaphoreDataOutput.fromSemaphoreEntity(it) }
    }

    @GetMapping("/{semaphoreId}")
    @Operation(summary = "Get semaphore by Id")
    fun get(
        @PathParam("semaphore id")
        @PathVariable(name = "semaphoreId")
        semaphoreId: Int,
    ): SemaphoreDataOutput {
        val semaphore = getSemaphoreById.execute(semaphoreId)
        return SemaphoreDataOutput.fromSemaphoreEntity(semaphore)
    }
}
