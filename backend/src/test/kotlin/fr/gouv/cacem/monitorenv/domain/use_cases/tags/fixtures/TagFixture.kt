package fr.gouv.cacem.monitorenv.domain.use_cases.tags.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.themes.SubTagEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.TagEntity
import java.time.ZonedDateTime
import kotlin.random.Random

class TagFixture {
    companion object {
        fun aTag(
            id: Int = Random.nextInt(),
            name: String = "tag",
            startedAt: ZonedDateTime = ZonedDateTime.now(),
            endedAt: ZonedDateTime? = null,
            subThemes: List<SubTagEntity> = listOf(),
        ): TagEntity = TagEntity(id = id, name = name, startedAt = startedAt, endedAt = endedAt, subTags = subThemes)

        fun aSubTag(
            id: Int = Random.nextInt(),
            name: String = "subTag",
            startedAt: ZonedDateTime = ZonedDateTime.now(),
            endedAt: ZonedDateTime? = null,
        ): SubTagEntity = SubTagEntity(id = id, name = name, startedAt = startedAt, endedAt = endedAt)
    }
}
