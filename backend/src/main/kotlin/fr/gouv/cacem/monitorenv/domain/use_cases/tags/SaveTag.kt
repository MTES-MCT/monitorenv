package fr.gouv.cacem.monitorenv.domain.use_cases.tags

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import fr.gouv.cacem.monitorenv.domain.repositories.ITagRepository
import org.slf4j.LoggerFactory

@UseCase
class SaveTag(
    private val tagRepository: ITagRepository,
) {
    private val logger = LoggerFactory.getLogger(SaveTag::class.java)

    fun execute(
        tag: TagEntity,
        parentId: Int?,
    ): TagEntity {
        logger.info("Attempt to ${if (tag.id === null) "create a tag" else "update with id ${tag.id}"}")
        val savedTag = tagRepository.save(tag, parentId)
        logger.info("Tag ${tag.id} saved")

        return savedTag
    }
}
