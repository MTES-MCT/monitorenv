package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitContactRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitContactDTO
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlUnitContactModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlUnitContactRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlUnitRepository
import fr.gouv.cacem.monitorenv.utils.requirePresent
import org.slf4j.LoggerFactory
import org.springframework.cache.annotation.CacheEvict
import org.springframework.dao.InvalidDataAccessApiUsageException
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaControlUnitContactRepository(
    private val dbControlUnitRepository: IDBControlUnitRepository,
    private val dbControlUnitContactRepository: IDBControlUnitContactRepository,
) : IControlUnitContactRepository {
    private val logger = LoggerFactory.getLogger(JpaControlUnitContactRepository::class.java)

    @Transactional
    override fun deleteById(controlUnitContactId: Int) {
        dbControlUnitContactRepository.deleteById(controlUnitContactId)
    }

    @Transactional
    override fun findAll(): List<FullControlUnitContactDTO> =
        dbControlUnitContactRepository.findAll().map {
            it.toFullControlUnitContact()
        }

    @Transactional
    override fun findById(controlUnitContactId: Int): FullControlUnitContactDTO =
        dbControlUnitContactRepository.findById(controlUnitContactId).get().toFullControlUnitContact()

    @CacheEvict(value = ["control_units"], allEntries = true)
    @Transactional
    override fun save(controlUnitContact: ControlUnitContactEntity): ControlUnitContactEntity =
        try {
            val controlUnitModel = requirePresent(dbControlUnitRepository.findById(controlUnitContact.controlUnitId))
            val controlUnitContactModel =
                ControlUnitContactModel.fromControlUnitContact(controlUnitContact, controlUnitModel)

            dbControlUnitContactRepository.save(controlUnitContactModel).toControlUnitContact()
        } catch (e: InvalidDataAccessApiUsageException) {
            val errorMessage =
                "Unable to save control unit contact with `id` = ${controlUnitContact.id}."
            logger.error(errorMessage, e)
            throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_SAVED, errorMessage)
        }
}
