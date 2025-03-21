package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.themes.GetThemes
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.ThemeOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/v1/themes")
@Tag(description = "API Themes", name = "BFF.Themes")
class Themes(private val getThemes: GetThemes) {

    @GetMapping("")
    @Operation(summary = "Get themes with subthemes")
    fun getAll(): List<ThemeOutput> {
        return getThemes.execute().map { ThemeOutput.fromThemeEntity(it) }
    }
}