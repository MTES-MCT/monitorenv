package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.*
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.regulatoryArea.RegulatoryAreaByIdsDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.regulatoryArea.RegulatoryAreaDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.regulatoryArea.*
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.*

@RestController("regulatoryAreas")
@RequestMapping("/bff/v1/regulatory-areas")
@Tag(name = "BFF.RegulatoryAreas", description = "API regulatory areas")
class RegulatoryAreas(
    private val getAllRegulatoryAreas: GetAllRegulatoryAreas,
    private val getRegulatoryAreaById: GetRegulatoryAreaById,
    private val getAllLayerNames: GetAllLayerNames,
    private val createOrUpdateRegulatoryArea: CreateOrUpdateRegulatoryArea,
    private val getAllRegulatoryAreasToComplete: GetAllRegulatoryAreasToComplete,
    private val getRegulatoryAreaByIds: GetRegulatoryAreaByIds,
    private val getAllRegulatoryAreasTiles: GetAllRegulatoryAreasTiles,
) {
    @GetMapping("")
    @Operation(summary = "Get regulatory Areas")
    fun getAll(
        @Parameter(description = "Control Plan")
        @RequestParam(name = "controlPlan", required = false)
        controlPlan: String?,
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
        @Parameter(description = "Only recent areas")
        @RequestParam(name = "onlyRecentsAreas", required = false, defaultValue = "false")
        onlyRecentsAreas: Boolean?,
    ): RegulatoryAreasWithTotalDataOutput {
        val (regulatoryAreasGrouped, totalCount) =
            getAllRegulatoryAreas.execute(
                controlPlan = controlPlan,
                searchQuery = searchQuery,
                seaFronts = seaFronts,
                tags = tags,
                themes = themes,
                onlyRecentsAreas = onlyRecentsAreas,
            )

        val groupedDto =
            regulatoryAreasGrouped.map { RegulatoryAreasDataOutput.fromRegulatoryAreaEntity(it) }

        return RegulatoryAreasWithTotalDataOutput(
            totalCount = totalCount,
            regulatoryAreasByLayer = groupedDto,
        )
    }

    @GetMapping(value = ["/tiles/{z}/{x}/{y}"], produces = ["application/x-protobuf"])
    @Operation(summary = "Get regulatory Areas")
    fun getAllTiles(
        @Parameter(description = "Control Plan")
        @RequestParam(name = "controlPlan", required = false)
        controlPlan: String?,
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
        @Parameter(description = "Only recent areas")
        @RequestParam(name = "onlyRecentsAreas", required = false, defaultValue = "false")
        onlyRecentsAreas: Boolean?,
        @PathVariable x: Int,
        @PathVariable y: Int,
        @PathVariable z: Int,
    ): ByteArray =
        getAllRegulatoryAreasTiles.execute(
            controlPlan = controlPlan,
            searchQuery = searchQuery,
            seaFronts = seaFronts,
            tags = tags,
            themes = themes,
            onlyRecentsAreas = onlyRecentsAreas,
            x = x,
            y = y,
            z = z,
        )

    @PostMapping("")
    @Operation(summary = "Get regulatory areas by ids")
    fun getAll(
        @RequestBody
        body: RegulatoryAreaByIdsDataInput,
    ): List<RegulatoryAreaDataOutput> =
        getRegulatoryAreaByIds
            .execute(body.ids, body.axis)
            .map { RegulatoryAreaDataOutput.fromRegulatoryAreaEntity(it) }

    @GetMapping("/{regulatoryAreaId}")
    @Operation(summary = "Get regulatory area by Id")
    fun get(
        @PathParam("regulatoryArea id")
        @PathVariable(name = "regulatoryAreaId")
        regulatoryAreaId: Int,
    ): RegulatoryAreaDataOutput? =
        getRegulatoryAreaById.execute(regulatoryAreaId = regulatoryAreaId)?.let {
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
