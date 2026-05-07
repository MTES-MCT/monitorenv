package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import fr.gouv.cacem.monitorenv.domain.repositories.ITagRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBTagRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime

@Repository
class JpaTagRepository(
    private val dbTagRepository: IDBTagRepository,
) : ITagRepository {
    @Transactional
    override fun findAllWithin(
        startedAt: ZonedDateTime,
        endedAt: ZonedDateTime,
    ): List<TagEntity> = dbTagRepository.findAllWithin(startedAt, endedAt).map { it.toTagEntity() }

    @Transactional
    override fun findAllWithinByRegulatoryAreaIds(
        regulatoryAreaIds: List<Int>,
        time: ZonedDateTime,
    ): List<TagEntity> =
        dbTagRepository.findAllWithinByRegulatoryAreaIds(regulatoryAreaIds, time).map {
            it.toTagEntity()
        }

    @Transactional
    override fun findAllWithinByVigilanceAreasIds(
        vigilanceAreasIds: List<Int>,
        time: ZonedDateTime,
    ): List<TagEntity> =
        dbTagRepository.findAllWithinByVigilanceAreasIds(vigilanceAreasIds, time).map {
            it.toTagEntity()
        }

    override fun save(
        tag: TagEntity,
        parentId: Int?,
    ): TagEntity {
        val parent = if (parentId !== null) dbTagRepository.findByIdOrNull(parentId) else null
        return dbTagRepository.save(TagModel.fromTagEntity(tagEntity = tag, parent)).toTagEntity()
    }
}
