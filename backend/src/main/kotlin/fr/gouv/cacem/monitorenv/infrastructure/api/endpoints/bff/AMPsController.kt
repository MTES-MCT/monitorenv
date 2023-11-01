package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.use_cases.amps.GetAllAMPs
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.AMPDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/v1/amps")
@Tag(name = "AMP", description = "API des Aires Marines Protégées (AMP)")
class AMPsController(
    private val getAllAMPs: GetAllAMPs,
    private val objectMapper: ObjectMapper
) {

    @GetMapping("")
    @Operation(summary = "Get AMPs")
    fun getAMPsController(): List<AMPDataOutput> {
        val amps = getAllAMPs.execute()
        return amps.map { AMPDataOutput.fromAMPEntity(it) }
    }
}
