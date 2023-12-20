package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.departmentArea.GetDepartmentAreaByInseeCode
import fr.gouv.cacem.monitorenv.domain.use_cases.departmentArea.GetDepartmentAreas
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.DepartmentAreaDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/v1/department_areas")
@Tag(name = "BFF.DepartmentAreas")
class DepartmentAreas(
    private val getDepartmentAreas: GetDepartmentAreas,
    private val getDepartmentAreaById: GetDepartmentAreaByInseeCode,
) {
    @GetMapping("/{departmentAreaInseeCode}")
    @Operation(summary = "Get an department area by its ID (INSEE code)")
    fun get(
        @PathParam("DepartmentArea ID")
        @PathVariable(name = "departmentAreaInseeCode")
        departmentAreaInseeCode: String,
    ): DepartmentAreaDataOutput {
        val foundDepartmentArea = getDepartmentAreaById.execute(departmentAreaInseeCode)

        return DepartmentAreaDataOutput.fromDepartmentArea(foundDepartmentArea)
    }

    @GetMapping("")
    @Operation(summary = "List department areas")
    fun getAll(): List<DepartmentAreaDataOutput> {
        val foundDepartmentAreas = getDepartmentAreas.execute()

        return foundDepartmentAreas.map { DepartmentAreaDataOutput.fromDepartmentArea(it) }
    }
}
