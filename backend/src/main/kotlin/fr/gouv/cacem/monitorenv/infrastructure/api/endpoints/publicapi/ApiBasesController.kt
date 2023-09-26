package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import fr.gouv.cacem.monitorenv.domain.use_cases.base.CreateOrUpdateBase
import fr.gouv.cacem.monitorenv.domain.use_cases.base.GetBaseById
import fr.gouv.cacem.monitorenv.domain.use_cases.base.GetBases
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateBaseDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.BaseDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.FullBaseDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/bases")
@Tag(name = "Bases", description = "API bases")
class ApiBasesController(
    private val createOrUpdateBase: CreateOrUpdateBase,
    private val getBases: GetBases,
    private val getBaseById: GetBaseById,
) {
    @PostMapping("", consumes = ["application/json"])
    @Operation(summary = "Create a base")
    @ResponseStatus(HttpStatus.CREATED)
    fun create(
        @RequestBody
        createBaseDataInput: CreateOrUpdateBaseDataInput,
    ): BaseDataOutput {
        val newBase = createBaseDataInput.toBase()
        val createdBase = createOrUpdateBase.execute(newBase)

        return BaseDataOutput.fromBase(createdBase)
    }

    @GetMapping("/{baseId}")
    @Operation(summary = "Get a base by its ID")
    fun get(
        @PathParam("Base ID")
        @PathVariable(name = "baseId")
        baseId: Int,
    ): FullBaseDataOutput {
        val foundFullBase = getBaseById.execute(baseId)

        return FullBaseDataOutput.fromFullBase(foundFullBase)
    }

    @GetMapping("")
    @Operation(summary = "List bases")
    fun getAll(): List<FullBaseDataOutput> {
        val foundFullBases = getBases.execute()

        return foundFullBases.map { FullBaseDataOutput.fromFullBase(it) }
    }

    @PutMapping(value = ["/{baseId}"], consumes = ["application/json"])
    @Operation(summary = "Update a base")
    fun update(
        @PathParam("Base ID")
        @PathVariable(name = "baseId")
        baseId: Int,
        @RequestBody
        updateBaseDataInput: CreateOrUpdateBaseDataInput,
    ): BaseDataOutput {
        requireNotNull(updateBaseDataInput.id) { "`id` can't be null." }
        require(baseId == updateBaseDataInput.id) {
            "Body ID ('${updateBaseDataInput.id}') doesn't match path ID ('${baseId}')."
        }

        val nextBase = updateBaseDataInput.toBase()
        val updatedBase = createOrUpdateBase.execute(nextBase)

        return BaseDataOutput.fromBase(updatedBase)
    }
}
