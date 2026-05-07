package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.tags.GetTags
import fr.gouv.cacem.monitorenv.domain.use_cases.tags.GetTagsByRegulatoryAreas
import fr.gouv.cacem.monitorenv.domain.use_cases.tags.SaveTag
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.tags.CreaterOrUpdateTagInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.tags.TagOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.ZonedDateTime

@RestController
@RequestMapping("/bff/v1/tags")
@Tag(description = "API Tags", name = "BFF.Tags")
class Tags(
    private val getTags: GetTags,
    private val saveTag: SaveTag,
    private val getTagsByRegulatoryAreas: GetTagsByRegulatoryAreas,
) {
    @GetMapping("")
    @Operation(summary = "Get all current tags with subtags")
    fun getAll(
        @RequestParam(required = false) startedAt: ZonedDateTime = ZonedDateTime.now(),
        @RequestParam(required = false) endedAt: ZonedDateTime = ZonedDateTime.now(),
    ): List<TagOutput> = getTags.execute(startedAt, endedAt).map { TagOutput.fromTagEntity(it) }

    @PostMapping("/regulatoryAreas")
    @Operation(summary = "Get all current tags with subtags from regulatory area ids")
    fun getAllByRegulatoryAreas(
        @RequestBody
        ids: List<Int>,
    ): List<TagOutput> = getTagsByRegulatoryAreas.execute(ids).map { TagOutput.fromTagEntity(it) }

    @PutMapping("", consumes = ["application/json"])
    @Operation(summary = "create or update the given dashboard")
    fun put(
        @RequestBody tagInput: CreaterOrUpdateTagInput,
    ): TagOutput = TagOutput.fromTagEntity(saveTag.execute(tagInput.toTagEntity(), tagInput.parentId))
}
