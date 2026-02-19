package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v2

import fr.gouv.cacem.monitorenv.domain.use_cases.natinfs.SaveNatinf
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.natinfs.NatinfInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.natinfs.v2.NatinfOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController("natinfsV2")
@RequestMapping("/bff/v2/natinfs")
@Tag(description = "API Natinf", name = "BFF.Natinf")
class Natinfs(
    private val saveNatinf: SaveNatinf,
) {
    @PutMapping("", consumes = ["application/json"])
    @Operation(summary = "save a natinf")
    fun create(
        @RequestBody natinf: NatinfInput,
    ): NatinfOutput {
        val natinf = saveNatinf.execute(natinf.toNatinfEntity())

        return NatinfOutput.fromNatinf(natinf)
    }
}
