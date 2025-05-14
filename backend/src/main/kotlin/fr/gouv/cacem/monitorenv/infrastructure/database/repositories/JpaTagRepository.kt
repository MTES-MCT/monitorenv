package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import fr.gouv.cacem.monitorenv.domain.repositories.ITagRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBTagRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime

@Repository
class JpaTagRepository(
    private val dbTagRepository: IDBTagRepository,
) : ITagRepository {
    @Transactional
    override fun findAllWithin(time: ZonedDateTime): List<TagEntity> =
        dbTagRepository.findAllWithin(time).map { it.toTagEntity() }

    @Transactional
    override fun findAllWithinByRegulatoryAreaIds(
        regulatoryAreaIds: List<Int>,
        time: ZonedDateTime,
    ): List<TagEntity> =
        dbTagRepository.findAllWithinByRegulatoryAreaIds(regulatoryAreaIds, time).map {
            it.toTagEntity()
        }
}
