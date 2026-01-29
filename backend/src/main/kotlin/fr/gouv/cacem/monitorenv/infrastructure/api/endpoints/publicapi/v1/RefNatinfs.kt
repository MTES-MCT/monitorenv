package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.refNatinfs.GetAllRefNatinfs
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.RefNatinfOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.RefNatinfOutput.Companion.fromRefNatinf
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/ref_natinfs")
@Tag(name = "Public.RefNatinfs")
class RefNatinfs(
    private val getAllRefNatinfs: GetAllRefNatinfs,
) {
    @GetMapping("")
    @Operation(summary = "Get all referentials natinfs")
    fun getAll(): List<RefNatinfOutput> = getAllRefNatinfs.execute().map { fromRefNatinf(it) }
}
