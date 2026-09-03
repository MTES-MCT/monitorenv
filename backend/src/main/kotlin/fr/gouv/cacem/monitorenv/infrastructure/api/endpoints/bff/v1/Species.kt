package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.species.GetSpecies
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.species.SpecyDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/v1/species")
@Tag(description = "API Species", name = "BFF.Species")
class Species(
    private val getSpecies: GetSpecies,
) {
    @GetMapping("")
    @Operation(summary = "Get all species")
    fun getAll(): List<SpecyDataOutput> = getSpecies.execute().map { SpecyDataOutput.fromSpecyEntity(it) }
}
