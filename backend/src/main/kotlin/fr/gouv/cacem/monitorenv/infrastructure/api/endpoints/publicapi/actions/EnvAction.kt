package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.actions

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ConcreteEnvActionEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.PatchEnvAction
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.EnvActionOutput
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
class EnvAction(private val objectMapper: ObjectMapper, private val patchEnvAction: PatchEnvAction) {

    init {
        objectMapper.configure(DeserializationFeature.FAIL_ON_IGNORED_PROPERTIES, false)
    }

    @PatchMapping("/actions/{id}")
    @Operation(summary = "patch an existing action", description = "action")
    fun patch(@PathVariable id: UUID, @RequestBody partialEnvAction: String): EnvActionOutput {
        val partialConcreteEnvActionEntity =
            objectMapper.readValue(partialEnvAction, ConcreteEnvActionEntity::class.java)
        return EnvActionOutput.fromEntity(patchEnvAction.execute(id, partialConcreteEnvActionEntity))

    }
}
