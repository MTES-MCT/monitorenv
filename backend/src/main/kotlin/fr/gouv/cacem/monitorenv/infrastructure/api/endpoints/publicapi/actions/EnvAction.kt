package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.actions

import com.fasterxml.jackson.databind.JsonNode
import fr.gouv.cacem.monitorenv.domain.entities.PatchableEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.PatchEnvAction
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.actions.EnvActionDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/v1")
@Tag(description = "Mission's actions", name = "Public.Actions")
class EnvAction(
    private val patchEnvAction: PatchEnvAction,
) {
    @PatchMapping("/actions/{id}")
    @Operation(summary = "patch an existing action", description = "action")
    fun patch(@PathVariable id: UUID, @RequestBody partialEnvActionAsJson: JsonNode): EnvActionDataOutput {
        val envActionEntity = patchEnvAction.execute(id, PatchableEntity(partialEnvActionAsJson))
        return EnvActionDataOutput.fromEnvActionEntity(envActionEntity)
    }
}
