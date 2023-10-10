package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import fr.gouv.cacem.monitorenv.domain.use_cases.departmentArea.GetDepartmentAreaByInseeDep
import fr.gouv.cacem.monitorenv.domain.use_cases.departmentArea.GetDepartmentAreas
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.DepartmentAreaDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/department_areas")
@Tag(name = "DepartmentAreas")
class ApiDepartmentAreasController(
    private val getDepartmentAreas: GetDepartmentAreas,
    private val getDepartmentAreaById: GetDepartmentAreaByInseeDep,
) {
    @GetMapping("/{departmentAreaInseeDep}")
    @Operation(summary = "Get an departmentArea by its ID")
    fun get(
        @PathParam("DepartmentArea ID")
        @PathVariable(name = "departmentAreaInseeDep")
        departmentAreaInseeDep: String,
    ): DepartmentAreaDataOutput {
        val foundDepartmentArea = getDepartmentAreaById.execute(departmentAreaInseeDep)

        return DepartmentAreaDataOutput.fromDepartmentArea(foundDepartmentArea)
    }

    @GetMapping("")
    @Operation(summary = "List departmentAreas")
    fun getAll(): List<DepartmentAreaDataOutput> {
        val foundDepartmentAreas = getDepartmentAreas.execute()

        return foundDepartmentAreas.map { DepartmentAreaDataOutput.fromDepartmentArea(it) }
    }
}
