package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.actions

import fr.gouv.cacem.monitorenv.domain.use_cases.actions.PatchEnvAction
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.actions.EnvActionDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.PatchableEnvActionDataInput
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
    @Operation(
        summary = "patch an existing action",
        description = "Retrieve the action with given id and patch it with input data",
    )
    fun patch(
        @PathVariable id: UUID,
        @RequestBody partialEnvActionDataInput: PatchableEnvActionDataInput,
    ): EnvActionDataOutput {
        val envActionEntity = patchEnvAction.execute(id, partialEnvActionDataInput.toPatchableEnvActionEntity())
        return EnvActionDataOutput.fromEnvActionEntity(envActionEntity)
    }
}
