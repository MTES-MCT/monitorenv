package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.NotFoundException
import fr.gouv.cacem.monitorenv.domain.repositories.INextControlUnitContactRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlUnitContactModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBNextControlUnitContactRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBNextControlUnitRepository
import fr.gouv.cacem.monitorenv.utils.requirePresent
import org.springframework.dao.InvalidDataAccessApiUsageException
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaNextControlUnitContactRepository(
    private val dbNextControlUnitRepository: IDBNextControlUnitRepository,
    private val dbNextControlUnitContactRepository: IDBNextControlUnitContactRepository,
) : INextControlUnitContactRepository {

    override fun findAll(): List<NextControlUnitContactEntity> {
        return dbNextControlUnitContactRepository.findAll()
            .map { it.toNextControlUnitContactEntity() }
    }

    override fun findById(nextControlUnitContactId: Int): NextControlUnitContactEntity {
        return dbNextControlUnitContactRepository.findById(nextControlUnitContactId).get()
            .toNextControlUnitContactEntity()
    }

    @Transactional
    override fun save(nextControlUnitContactEntity: NextControlUnitContactEntity): NextControlUnitContactEntity {
        return try {
            val controlUnitModel =
                requirePresent(dbNextControlUnitRepository.findById(nextControlUnitContactEntity.controlUnitId))
            val controlUnitContactModel = ControlUnitContactModel.fromNextControlUnitContactEntity(
                nextControlUnitContactEntity,
                controlUnitModel
            )

            dbNextControlUnitContactRepository.save(controlUnitContactModel)
                .toNextControlUnitContactEntity()
        } catch (e: InvalidDataAccessApiUsageException) {
            throw NotFoundException(
                "Unable to find (and update) control unit contact with `id` = ${nextControlUnitContactEntity.id}.",
                e
            )
        }
    }
}
