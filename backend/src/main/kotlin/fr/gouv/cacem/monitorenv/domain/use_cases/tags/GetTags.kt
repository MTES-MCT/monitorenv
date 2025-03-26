package fr.gouv.cacem.monitorenv.domain.use_cases.tags

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.themes.TagEntity
import fr.gouv.cacem.monitorenv.domain.repositories.ITagRepository
import org.slf4j.LoggerFactory

@UseCase
class GetTags(
    private val tagRepository: ITagRepository,
) {
    private val logger = LoggerFactory.getLogger(GetTags::class.java)

    fun execute(): List<TagEntity> {
        logger.info("Attempt to GET all tags")
        val tags = tagRepository.findAllWithin()
        logger.info("Found ${tags.size} tags")

        return tags
    }
}
