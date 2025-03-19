package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.administration.*
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateAdministrationDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.AdministrationDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.BooleanDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.FullAdministrationDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/administrations")
@Tag(name = "Public.Administrations")
class Administrations(
    private val archiveAdministration: ArchiveAdministration,
    private val canArchiveAdministration: CanArchiveAdministration,
    private val canDeleteAdministration: CanDeleteAdministration,
    private val createOrUpdateAdministration: CreateOrUpdateAdministration,
    private val deleteAdministration: DeleteAdministration,
    private val getAdministrations: GetAdministrations,
    private val getAdministrationById: GetAdministrationById,
) {
    @PutMapping("/{administrationId}/archive")
    @Operation(summary = "Archive an administration")
    fun archive(
        @PathParam("Administration ID")
        @PathVariable(name = "administrationId")
        administrationId: Int,
    ) {
        archiveAdministration.execute(administrationId)
    }

    @GetMapping("/{administrationId}/can_archive")
    @Operation(summary = "Can this administration be archived?")
    fun canArchive(
        @PathParam("Administration ID")
        @PathVariable(name = "administrationId")
        administrationId: Int,
    ): BooleanDataOutput = canArchiveAdministration.execute(administrationId).let { BooleanDataOutput.get(it) }

    @GetMapping("/{administrationId}/can_delete")
    @Operation(summary = "Can this administration be deleted?")
    fun canDelete(
        @PathParam("Administration ID")
        @PathVariable(name = "administrationId")
        administrationId: Int,
    ): BooleanDataOutput = canDeleteAdministration.execute(administrationId).let { BooleanDataOutput.get(it) }

    @PostMapping("", consumes = ["application/json"])
    @Operation(summary = "Create an administration")
    @ResponseStatus(HttpStatus.CREATED)
    fun create(
        @RequestBody
        createAdministrationDataInput: CreateOrUpdateAdministrationDataInput,
    ): AdministrationDataOutput {
        val newAdministration = createAdministrationDataInput.toAdministration()
        val createdAdministration = createOrUpdateAdministration.execute(newAdministration)

        return AdministrationDataOutput.fromAdministration(createdAdministration)
    }

    @DeleteMapping("/{administrationId}")
    @Operation(summary = "Delete an administration")
    fun delete(
        @PathParam("Administration ID")
        @PathVariable(name = "administrationId")
        administrationId: Int,
    ) {
        deleteAdministration.execute(administrationId)
    }

    @GetMapping("/{administrationId}")
    @Operation(summary = "Get an administration by its ID")
    fun get(
        @PathParam("Administration ID")
        @PathVariable(name = "administrationId")
        administrationId: Int,
    ): FullAdministrationDataOutput {
        val foundFullAdministration = getAdministrationById.execute(administrationId)

        return FullAdministrationDataOutput.fromFullAdministration(foundFullAdministration)
    }

    @GetMapping("")
    @Operation(summary = "List administrations")
    fun getAll(): List<FullAdministrationDataOutput> {
        val foundFullAdministrations = getAdministrations.execute()

        return foundFullAdministrations.map { FullAdministrationDataOutput.fromFullAdministration(it) }
    }

    @PutMapping(value = ["/{administrationId}"], consumes = ["application/json"])
    @Operation(summary = "Update an administration")
    fun update(
        @PathParam("Administration ID")
        @PathVariable(name = "administrationId")
        administrationId: Int,
        @RequestBody
        updateAdministrationDataInput: CreateOrUpdateAdministrationDataInput,
    ): AdministrationDataOutput {
        requireNotNull(updateAdministrationDataInput.id) { "`id` can't be null." }
        require(administrationId == updateAdministrationDataInput.id) {
            "Body ID ('${updateAdministrationDataInput.id}') doesn't match path ID ('$administrationId')."
        }

        val nextAdministration = updateAdministrationDataInput.toAdministration()
        val updatedAdministration = createOrUpdateAdministration.execute(nextAdministration)

        return AdministrationDataOutput.fromAdministration(updatedAdministration)
    }
}
