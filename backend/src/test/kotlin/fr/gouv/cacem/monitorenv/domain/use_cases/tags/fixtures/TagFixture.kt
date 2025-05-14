package fr.gouv.cacem.monitorenv.domain.use_cases.tags.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import java.time.ZonedDateTime
import kotlin.random.Random

class TagFixture {
    companion object {
        fun aTag(
            id: Int = Random.nextInt(),
            name: String = "tag",
            startedAt: ZonedDateTime = ZonedDateTime.now(),
            endedAt: ZonedDateTime? = null,
            subTags: List<TagEntity> = listOf(),
        ): TagEntity =
            TagEntity(
                id = id,
                name = name,
                startedAt = startedAt,
                endedAt = endedAt,
                subTags = subTags,
            )
    }
}
