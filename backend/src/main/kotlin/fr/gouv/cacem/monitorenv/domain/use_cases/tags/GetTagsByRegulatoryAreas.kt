package fr.gouv.cacem.monitorenv.domain.use_cases.tags

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.themes.TagEntity
import fr.gouv.cacem.monitorenv.domain.repositories.ITagRepository
import org.slf4j.LoggerFactory

@UseCase
class GetTagsByRegulatoryAreas(
    private val tagsRepository: ITagRepository,
) {
    private val logger = LoggerFactory.getLogger(GetTagsByRegulatoryAreas::class.java)

    fun execute(regulationsIds: List<Int>): List<TagEntity> {
        logger.info("Attempt to GET all tags from regulations $regulationsIds")
        val tags = tagsRepository.findAllWithinByRegulatoryAreaIds(regulationsIds)
        logger.info("Found ${tags.size} tags")

        return tags
    }
}
