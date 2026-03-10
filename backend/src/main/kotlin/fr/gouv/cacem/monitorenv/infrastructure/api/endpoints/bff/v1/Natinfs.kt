package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.natinfs.GetAllNatinfs
import fr.gouv.cacem.monitorenv.domain.use_cases.natinfs.GetNatinfsByThemes
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.NatinfDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/v1/natinfs")
@Tag(description = "API Natinf", name = "BFF.Natinf")
class Natinfs(
    private val getAllNatinfs: GetAllNatinfs,
    private val getNatinfsByThemes: GetNatinfsByThemes,
) {
    @GetMapping("")
    @Operation(summary = "Get all natinfs")
    fun getAll(): List<NatinfDataOutput> {
        val natinfs = getAllNatinfs.execute()

        return natinfs.map { NatinfDataOutput.fromNatinfEntity(it) }
    }

    @PostMapping("/themes")
    @Operation(summary = "Get all natinfs by theme ids")
    fun getNatinfsByTheme(
        @RequestBody ids: List<Int>,
    ): List<NatinfDataOutput> {
        val natinfs = getNatinfsByThemes.execute(ids)

        return natinfs.map { NatinfDataOutput.fromNatinfEntity(it) }
    }
}
