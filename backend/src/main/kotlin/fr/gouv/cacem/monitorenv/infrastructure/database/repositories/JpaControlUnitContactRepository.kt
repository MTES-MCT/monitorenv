package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitContactRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitContactDTO
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlUnitContactModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlUnitContactRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlUnitRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBVigilanceAreaSourceRepository
import org.slf4j.LoggerFactory
import org.springframework.cache.annotation.CacheEvict
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaControlUnitContactRepository(
    private val dbControlUnitRepository: IDBControlUnitRepository,
    private val dbControlUnitContactRepository: IDBControlUnitContactRepository,
    private val dbVigilanceAreaSourceRepository: IDBVigilanceAreaSourceRepository,
) : IControlUnitContactRepository {
    private val logger = LoggerFactory.getLogger(JpaControlUnitContactRepository::class.java)

    @Transactional
    @CacheEvict(value = ["control_units"], allEntries = true)
    override fun deleteById(controlUnitContactId: Int) {
        dbVigilanceAreaSourceRepository.deleteAllByControlUnitContactId(controlUnitContactId)
        dbControlUnitContactRepository.deleteById(controlUnitContactId)
    }

    @Transactional
    override fun findAll(): List<FullControlUnitContactDTO> =
        dbControlUnitContactRepository.findAll().map {
            it.toFullControlUnitContact()
        }

    @Transactional
    override fun findById(controlUnitContactId: Int): FullControlUnitContactDTO? =
        dbControlUnitContactRepository.findByIdOrNull(controlUnitContactId)?.toFullControlUnitContact()

    @CacheEvict(value = ["control_units"], allEntries = true)
    @Transactional
    override fun save(controlUnitContact: ControlUnitContactEntity): ControlUnitContactEntity {
        val controlUnit = dbControlUnitRepository.getReferenceById(controlUnitContact.controlUnitId)
        val controlUnitContactModel =
            ControlUnitContactModel.fromControlUnitContact(controlUnitContact, controlUnit)

        return dbControlUnitContactRepository.save(controlUnitContactModel).toControlUnitContact()
    }
}
