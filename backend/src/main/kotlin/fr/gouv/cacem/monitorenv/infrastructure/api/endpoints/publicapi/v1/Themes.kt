package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.themes.GetThemes
import fr.gouv.cacem.monitorenv.domain.use_cases.themes.GetThemesByRegulatoryAreas
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.themes.ThemeOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/themes")
@Tag(description = "API Themes", name = "Public.Themes")
class Themes(
    private val getThemes: GetThemes,
    private val getThemesByRegulatoryAreas: GetThemesByRegulatoryAreas,
) {
    @GetMapping("")
    @Operation(summary = "Get all current themes with subThemes")
    fun getAll(): List<ThemeOutput> = getThemes.execute().map { ThemeOutput.fromThemeEntity(it) }

    @PostMapping("/regulatoryAreas")
    @Operation(summary = "Get all current themes with subthemes from regulatory area ids")
    fun getAllByRegulatoryAreas(
        @RequestBody
        ids: List<Int>,
    ): List<ThemeOutput> = getThemesByRegulatoryAreas.execute(ids).map { ThemeOutput.fromThemeEntity(it) }
}
