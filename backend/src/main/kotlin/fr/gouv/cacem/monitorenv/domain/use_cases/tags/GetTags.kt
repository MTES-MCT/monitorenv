package fr.gouv.cacem.monitorenv.domain.use_cases.tags

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import fr.gouv.cacem.monitorenv.domain.repositories.ITagRepository
import org.slf4j.LoggerFactory
import java.time.ZonedDateTime

@UseCase
class GetTags(
    private val tagRepository: ITagRepository,
) {
    private val logger = LoggerFactory.getLogger(GetTags::class.java)

    fun execute(
        startedAt: ZonedDateTime,
        endedAt: ZonedDateTime,
    ): List<TagEntity> {
        logger.info("Attempt to GET all tags")
        val tags = tagRepository.findAllWithin(startedAt, endedAt)
        logger.info("Found ${tags.size} tags")

        return tags
    }
}
