package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.NotFoundException
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitContactRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlUnitContactModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBNextControlUnitContactRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBNextControlUnitRepository
import fr.gouv.cacem.monitorenv.utils.requirePresent
import org.springframework.dao.InvalidDataAccessApiUsageException
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaControlUnitContactRepository(
    private val dbNextControlUnitRepository: IDBNextControlUnitRepository,
    private val dbNextControlUnitContactRepository: IDBNextControlUnitContactRepository,
) : IControlUnitContactRepository {

    override fun findAll(): List<ControlUnitContactEntity> {
        return dbNextControlUnitContactRepository.findAll()
            .map { it.toNextControlUnitContactEntity() }
    }

    override fun findById(controlUnitContactId: Int): ControlUnitContactEntity {
        return dbNextControlUnitContactRepository.findById(controlUnitContactId).get()
            .toNextControlUnitContactEntity()
    }

    @Transactional
    override fun save(controlUnitContact: ControlUnitContactEntity): ControlUnitContactEntity {
        return try {
            val controlUnitModel =
                requirePresent(dbNextControlUnitRepository.findById(controlUnitContact.controlUnitId))
            val controlUnitContactModel = ControlUnitContactModel.fromNextControlUnitContactEntity(
                controlUnitContact,
                controlUnitModel
            )

            dbNextControlUnitContactRepository.save(controlUnitContactModel)
                .toNextControlUnitContactEntity()
        } catch (e: InvalidDataAccessApiUsageException) {
            throw NotFoundException(
                "Unable to find (and update) control unit contact with `id` = ${controlUnitContact.id}.",
                e
            )
        }
    }
}
