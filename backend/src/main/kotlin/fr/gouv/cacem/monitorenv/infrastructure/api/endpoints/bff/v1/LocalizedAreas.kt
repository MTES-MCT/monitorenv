package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.localizedArea.GetAllLocalizedAreas
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.LocalizedAreasDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/v1/localized_areas")
@Tag(name = "BFF.LocalizedAreas")
class LocalizedAreas(
    private val getAllLocalizedAreas: GetAllLocalizedAreas,
) {
    @GetMapping("")
    @Operation(summary = "Get localized Areas")
    fun getAll(): List<LocalizedAreasDataOutput> {
        val localizedAreas = getAllLocalizedAreas.execute()
        return localizedAreas.map { LocalizedAreasDataOutput.fromLocalizedAreaEntity(it) }
    }
}
