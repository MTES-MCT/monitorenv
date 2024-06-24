package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.actions

import fr.gouv.cacem.monitorenv.domain.use_cases.actions.PatchEnvAction
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.PatchableEnvActionDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.MissionEnvActionDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.*
import java.util.*

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
    ): MissionEnvActionDataOutput {
        val envActionEntity = patchEnvAction.execute(id, partialEnvActionDataInput.toPatchableEnvActionEntity())
        return MissionEnvActionDataOutput.fromEnvActionEntity(envActionEntity)
    }
}
