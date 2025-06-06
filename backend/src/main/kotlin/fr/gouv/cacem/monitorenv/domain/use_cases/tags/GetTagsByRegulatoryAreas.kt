package fr.gouv.cacem.monitorenv.domain.use_cases.tags

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import fr.gouv.cacem.monitorenv.domain.repositories.ITagRepository
import org.slf4j.LoggerFactory

@UseCase
class GetTagsByRegulatoryAreas(
    private val tagRepository: ITagRepository,
) {
    private val logger = LoggerFactory.getLogger(GetTagsByRegulatoryAreas::class.java)

    fun execute(regulatoryAreaIds: List<Int>): List<TagEntity> {
        logger.info("Attempt to GET all tags from regulatory areas $regulatoryAreaIds")
        val tags = tagRepository.findAllWithinByRegulatoryAreaIds(regulatoryAreaIds)
        logger.info("Found ${tags.size} tags")

        return tags
    }
}
