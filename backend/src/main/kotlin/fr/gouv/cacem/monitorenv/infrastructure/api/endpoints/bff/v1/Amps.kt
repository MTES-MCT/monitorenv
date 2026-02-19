package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.amps.GetAllAMPs
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.AMPDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/v1/amps")
@Tag(name = "BFF.AMP", description = "API des Aires Marines Protégées (AMP)")
class Amps(
    private val getAllAMPs: GetAllAMPs,
) {
    @GetMapping("")
    @Operation(summary = "Get AMPs")
    fun getAll(): List<AMPDataOutput> {
        val amps = getAllAMPs.execute()
        return amps.map { AMPDataOutput.fromAMPEntity(it) }
    }
}
