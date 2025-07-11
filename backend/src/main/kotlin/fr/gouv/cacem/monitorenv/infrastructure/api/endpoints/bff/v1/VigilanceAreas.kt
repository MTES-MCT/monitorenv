package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea.*
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.vigilanceArea.VigilanceAreaDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.vigilanceArea.VigilanceAreaDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.vigilanceArea.VigilanceAreasDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController("VigilanceAreas")
@RequestMapping("/bff/v1/vigilance_areas")
@Tag(description = "API Vigilance Areas", name = "BFF.VigilanceAreas")
class VigilanceAreas(
    private val getVigilanceAreas: GetVigilanceAreas,
    private val createOrUpdateVigilanceArea: CreateOrUpdateVigilanceArea,
    private val getVigilanceAreaById: GetVigilanceAreaById,
    private val deleteVigilanceArea: DeleteVigilanceArea,
    private val getTrigrams: GetTrigrams,
    private val getVigilanceAreasByIds: GetVigilanceAreasByIds,
) {
    @PutMapping("", consumes = ["application/json"])
    @Operation(summary = "Create a new vigilance area")
    fun create(
        @RequestBody createVigilanceAreaInput: VigilanceAreaDataInput,
    ): VigilanceAreaDataOutput {
        val vigilanceAreaEntity = createVigilanceAreaInput.toVigilanceAreaEntity()
        val createdVigilanceArea = createOrUpdateVigilanceArea.execute(vigilanceAreaEntity)

        return VigilanceAreaDataOutput.fromVigilanceArea(vigilanceArea = createdVigilanceArea)
    }

    @GetMapping("")
    @Operation(summary = "List vigilance areas")
    fun getAll(): List<VigilanceAreasDataOutput> {
        val vigilanceAreas = getVigilanceAreas.execute()

        return vigilanceAreas.map { VigilanceAreasDataOutput.fromVigilanceArea(it) }
    }

    @PostMapping("")
    @Operation(summary = "List vigilance areas by ids")
    fun getAll(
        @RequestBody
        ids: List<Int>,
    ): List<VigilanceAreaDataOutput> {
        val vigilanceAreas = getVigilanceAreasByIds.execute(ids)
        if (vigilanceAreas.isNullOrEmpty()) {
            return emptyList()
        }
        return vigilanceAreas.map { VigilanceAreaDataOutput.fromVigilanceArea(it) }
    }

    @GetMapping("/{vigilanceAreaId}")
    @Operation(summary = "Get vigilance area by Id")
    fun get(
        @PathParam("Vigilance Area Id")
        @PathVariable(name = "vigilanceAreaId")
        vigilanceAreaId: Int,
    ): VigilanceAreaDataOutput? {
        val vigilanceArea = getVigilanceAreaById.execute(vigilanceAreaId = vigilanceAreaId)

        return vigilanceArea?.let { VigilanceAreaDataOutput.fromVigilanceArea(it) }
    }

    @PutMapping(value = ["/{vigilanceAreaId}"], consumes = ["application/json"])
    @Operation(summary = "Update a mission")
    fun update(
        @PathParam("Vigilance Area Id")
        @PathVariable(name = "vigilanceAreaId")
        vigilanceAreaId: Int,
        @RequestBody updateVigilanceAreaDataInput: VigilanceAreaDataInput,
    ): VigilanceAreaDataOutput {
        val vigilanceAreaEntity = updateVigilanceAreaDataInput.toVigilanceAreaEntity()
        val updatedVigilanceArea = createOrUpdateVigilanceArea.execute(vigilanceAreaEntity)

        return VigilanceAreaDataOutput.fromVigilanceArea(vigilanceArea = updatedVigilanceArea)
    }

    @DeleteMapping(value = ["/{id}"])
    @Operation(summary = "Delete a vigilance area")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(
        @PathParam("Id")
        @PathVariable(name = "id")
        id: Int,
    ) {
        deleteVigilanceArea.execute(id = id)
    }

    @GetMapping("/trigrams")
    @Operation(summary = "List vigilance areas trigrams")
    fun getTrigrams(): List<String> = getTrigrams.execute()
}
