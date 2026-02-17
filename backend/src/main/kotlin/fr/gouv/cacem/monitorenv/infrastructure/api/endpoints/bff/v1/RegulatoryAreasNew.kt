package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.CreateOrUpdateRegulatoryArea
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetAllLayerNames
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetAllNewRegulatoryAreas
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetAllRegulatoryAreasToComplete
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetNewRegulatoryAreaById
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.regulatoryArea.RegulatoryAreaDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.regulatoryArea.LayerNamesDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.regulatoryArea.RegulatoryAreaDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.regulatoryArea.RegulatoryAreaToCompleteDataOuput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.regulatoryArea.RegulatoryAreasDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/regulatory-areas")
@Tag(name = "BFF.RegulatoryAreas", description = "API regulatory areas")
class RegulatoryAreasNew(
    private val getAllNewRegulatoryAreas: GetAllNewRegulatoryAreas,
    private val getNewRegulatoryAreaById: GetNewRegulatoryAreaById,
    private val getAllLayerNames: GetAllLayerNames,
    private val createOrUpdateRegulatoryArea: CreateOrUpdateRegulatoryArea,
    private val getAllRegulatoryAreasToComplete: GetAllRegulatoryAreasToComplete,
) {
    @GetMapping("")
    @Operation(summary = "Get regulatory Areas")
    fun getAll(
        @Parameter(description = "Themes")
        @RequestParam(name = "themes", required = false)
        themes: List<Int>?,
        @Parameter(description = "Tags")
        @RequestParam(name = "tags", required = false)
        tags: List<Int>?,
        @Parameter(description = "Search query")
        @RequestParam(name = "searchQuery", required = false)
        searchQuery: String?,
        @Parameter(description = "Façades")
        @RequestParam(name = "seaFronts", required = false)
        seaFronts: List<String>?,
    ): List<RegulatoryAreasDataOutput> {
        val regulatoryAreas =
            getAllNewRegulatoryAreas.execute(
                searchQuery = searchQuery,
                seaFronts = seaFronts,
                tags = tags,
                themes = themes,
            )
        return regulatoryAreas.map { RegulatoryAreasDataOutput.fromRegulatoryAreaEntity(it) }
    }

    @GetMapping("/{regulatoryAreaId}")
    @Operation(summary = "Get regulatory area by Id")
    fun get(
        @PathParam("regulatoryArea id")
        @PathVariable(name = "regulatoryAreaId")
        regulatoryAreaId: Int,
    ): RegulatoryAreaDataOutput? =
        getNewRegulatoryAreaById.execute(regulatoryAreaId = regulatoryAreaId)?.let {
            RegulatoryAreaDataOutput.fromRegulatoryAreaEntity(it)
        }

    @PutMapping("", consumes = ["application/json"])
    @Operation(summary = "create or update the given regulatory area")
    fun put(
        @RequestBody regulatoryAreaDataInput: RegulatoryAreaDataInput,
    ): RegulatoryAreaDataOutput =
        RegulatoryAreaDataOutput.fromRegulatoryAreaEntity(
            createOrUpdateRegulatoryArea.execute(regulatoryAreaDataInput.toRegulatoryAreaEntity()),
        )

    @GetMapping("/layer-names")
    @Operation(summary = "Get all regulatory areas group names")
    fun getLayerNames(): LayerNamesDataOutput? =
        getAllLayerNames.execute().let {
            LayerNamesDataOutput.fromGroupNames(it)
        }

    @GetMapping("/to-complete")
    @Operation(summary = "Get all regulatory areas to complete")
    fun getRegulatoryAreasToComplete(): List<RegulatoryAreaToCompleteDataOuput> =
        getAllRegulatoryAreasToComplete.execute().map {
            RegulatoryAreaToCompleteDataOuput.fromRegulatoryAreaToCompleteEntity(it)
        }
}
