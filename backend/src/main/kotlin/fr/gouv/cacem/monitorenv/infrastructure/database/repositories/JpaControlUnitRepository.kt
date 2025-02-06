package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.NotFoundException
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlUnitModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBAdministrationRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlUnitRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBDepartmentAreaRepository
import fr.gouv.cacem.monitorenv.utils.requirePresent
import org.springframework.cache.annotation.CacheEvict
import org.springframework.cache.annotation.Cacheable
import org.springframework.dao.InvalidDataAccessApiUsageException
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaControlUnitRepository(
    private val dbAdministrationRepository: IDBAdministrationRepository,
    private val dbControlUnitRepository: IDBControlUnitRepository,
    private val dbDepartmentAreaRepository: IDBDepartmentAreaRepository,
) : IControlUnitRepository {
    @CacheEvict(value = ["control_units"], allEntries = true)
    @Transactional
    override fun archiveById(controlUnitId: Int) {
        dbControlUnitRepository.archiveById(controlUnitId)
    }

    @CacheEvict(value = ["control_units"], allEntries = true)
    override fun deleteById(controlUnitId: Int) {
        dbControlUnitRepository.deleteById(controlUnitId)
    }

    @Cacheable(value = ["control_units"])
    @Transactional
    override fun findAll(): List<FullControlUnitDTO> = dbControlUnitRepository.findAll().map { it.toFullControlUnit() }

    @Transactional
    override fun findFullControlUnitById(controlUnitId: Int): FullControlUnitDTO =
        dbControlUnitRepository.findById(controlUnitId).get().toFullControlUnit()

    @CacheEvict(value = ["control_units"], allEntries = true)
    @Transactional
    override fun findById(controlUnitId: Int): ControlUnitEntity =
        dbControlUnitRepository.findById(controlUnitId).get().toControlUnit()

    @Transactional
    override fun save(controlUnit: ControlUnitEntity): ControlUnitEntity =
        try {
            val administrationModel = requirePresent(dbAdministrationRepository.findById(controlUnit.administrationId))
            val departmentAreaModel =
                controlUnit.departmentAreaInseeCode?.let { dbDepartmentAreaRepository.findByInseeCode(it) }
            val controlUnitModel =
                ControlUnitModel.fromControlUnit(controlUnit, administrationModel, departmentAreaModel)

            dbControlUnitRepository.save(controlUnitModel).toControlUnit()
        } catch (e: InvalidDataAccessApiUsageException) {
            throw NotFoundException(
                "Unable to find (and update) control unit with `id` = ${controlUnit.id}.",
                e,
            )
        }
}
