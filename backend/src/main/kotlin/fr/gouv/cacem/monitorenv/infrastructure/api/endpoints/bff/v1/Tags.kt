package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.tags.GetTags
import fr.gouv.cacem.monitorenv.domain.use_cases.tags.GetTagsByRegulatoryAreas
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.tags.TagOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/v1/tags")
@Tag(description = "API Tags", name = "BFF.Tags")
class Tags(
    private val getTags: GetTags,
    private val getTagsByRegulatoryAreas: GetTagsByRegulatoryAreas,
) {
    @GetMapping("")
    @Operation(summary = "Get all current tags with subtags")
    fun getAll(): List<TagOutput> = getTags.execute().map { TagOutput.fromTagEntity(it) }

    @PostMapping("/regulatoryAreas")
    @Operation(summary = "Get all current tags with subtags from regulatory area ids")
    fun getAllByRegulatoryAreas(
        @RequestBody
        ids: List<Int>,
    ): List<TagOutput> = getTagsByRegulatoryAreas.execute(ids).map { TagOutput.fromTagEntity(it) }
}
