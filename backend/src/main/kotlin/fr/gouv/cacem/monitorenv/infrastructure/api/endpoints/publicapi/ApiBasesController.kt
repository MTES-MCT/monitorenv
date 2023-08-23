package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import fr.gouv.cacem.monitorenv.domain.services.ControlUnitResourceService
import fr.gouv.cacem.monitorenv.domain.use_cases.base.CreateOrUpdateBase
import fr.gouv.cacem.monitorenv.domain.use_cases.base.GetBaseById
import fr.gouv.cacem.monitorenv.domain.use_cases.base.GetBases
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateBaseDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.BaseDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/bases")
@Tag(name = "Bases", description = "API bases")
class ApiBasesController(
    private val createOrUpdateBase: CreateOrUpdateBase,
    private val getBases: GetBases,
    private val getBaseById: GetBaseById,
    private val controlUnitResourceService: ControlUnitResourceService,
) {
    @PostMapping("", consumes = ["application/json"])
    @Operation(summary = "Create a base")
    fun create(
        @RequestBody
        createBaseDataInput: CreateOrUpdateBaseDataInput,
    ): BaseDataOutput {
        val newBaseEntity = createBaseDataInput.toBaseEntity()
        val createdBaseEntity = createOrUpdateBase.execute(newBaseEntity)

        return BaseDataOutput.fromBaseEntity(createdBaseEntity, controlUnitResourceService)
    }

    @GetMapping("/{baseId}")
    @Operation(summary = "Get a base by its ID")
    fun get(
        @PathParam("Base ID")
        @PathVariable(name = "baseId")
        baseId: Int,
    ): BaseDataOutput {
        val foundBaseEntity = getBaseById.execute(baseId)

        return BaseDataOutput.fromBaseEntity(foundBaseEntity, controlUnitResourceService)
    }

    @GetMapping("")
    @Operation(summary = "List bases")
    fun getAll(): List<BaseDataOutput> {
        return getBases.execute().map { BaseDataOutput.fromBaseEntity(it, controlUnitResourceService) }
    }

    @PostMapping(value = ["/{baseId}"], consumes = ["application/json"])
    @Operation(summary = "Update a base")
    fun update(
        @PathParam("Base ID")
        @PathVariable(name = "baseId")
        baseId: Int,
        @RequestBody
        updateBaseDataInput: CreateOrUpdateBaseDataInput,
    ): BaseDataOutput {
        if ((updateBaseDataInput.id == null) || (baseId != updateBaseDataInput.id)) {
            throw java.lang.IllegalArgumentException("Unable to find (and update) base with ID = ${updateBaseDataInput.id}.")
        }

        val nextBaseEntity = updateBaseDataInput.toBaseEntity()
        val updatedBaseEntity = createOrUpdateBase.execute(nextBaseEntity)

        return BaseDataOutput.fromBaseEntity(updatedBaseEntity, controlUnitResourceService)
    }
}
