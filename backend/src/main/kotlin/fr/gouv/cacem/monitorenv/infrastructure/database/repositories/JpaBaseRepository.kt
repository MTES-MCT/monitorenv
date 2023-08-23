package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.NotFoundException
import fr.gouv.cacem.monitorenv.domain.repositories.IBaseRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.BaseModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBNextControlUnitResourceRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBBaseRepository
import fr.gouv.cacem.monitorenv.utils.requirePresent
import org.springframework.dao.InvalidDataAccessApiUsageException
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaBaseRepository(
    private val dbNextControlUnitResourceRepository: IDBNextControlUnitResourceRepository,
    private val dbBaseRepository: IDBBaseRepository,
) : IBaseRepository {
    override fun findAll(): List<BaseEntity> {
        return dbBaseRepository.findAll()
            .map { it.toBaseEntity() }
    }

    override fun findById(baseId: Int): BaseEntity {
        return dbBaseRepository.findById(baseId).get()
            .toBaseEntity()
    }

    @Transactional
    override fun save(baseEntity: BaseEntity): BaseEntity {
        return try {
            val controlUnitResourceModels = baseEntity.controlUnitResourceIds.map {
                requirePresent(dbNextControlUnitResourceRepository.findById(it))
            }
            val baseModel = BaseModel.fromBaseEntity(
                baseEntity,
                controlUnitResourceModels,
            )

            dbBaseRepository.save(baseModel)
                .toBaseEntity()
        } catch (e: InvalidDataAccessApiUsageException) {
            throw NotFoundException(
                "Unable to find (and update) base with `id` = ${baseEntity.id}.",
                e
            )
        }
    }
}
