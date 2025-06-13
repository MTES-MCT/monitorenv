package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.NearbyUnit
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlUnitModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBAdministrationRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlUnitRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBDepartmentAreaRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBMissionRepository
import fr.gouv.cacem.monitorenv.utils.requirePresent
import org.locationtech.jts.geom.Geometry
import org.slf4j.LoggerFactory
import org.springframework.cache.annotation.CacheEvict
import org.springframework.cache.annotation.Cacheable
import org.springframework.dao.InvalidDataAccessApiUsageException
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime

@Repository
class JpaControlUnitRepository(
    private val dbAdministrationRepository: IDBAdministrationRepository,
    private val dbControlUnitRepository: IDBControlUnitRepository,
    private val dbDepartmentAreaRepository: IDBDepartmentAreaRepository,
    private val dbMissionRepository: IDBMissionRepository,
    private val mapper: ObjectMapper,
) : IControlUnitRepository {
    private val logger = LoggerFactory.getLogger(JpaControlUnitRepository::class.java)

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

    @Transactional
    override fun findById(controlUnitId: Int): ControlUnitEntity =
        dbControlUnitRepository.findById(controlUnitId).get().toControlUnit()

    @CacheEvict(value = ["control_units"], allEntries = true)
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
            val errorMessage =
                "Unable to save control unit with `id` = ${controlUnit.id}."
            logger.error(errorMessage, e)
            throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_SAVED, errorMessage)
        }

    @Transactional
    override fun findNearbyUnits(
        geometry: Geometry,
        from: ZonedDateTime?,
        to: ZonedDateTime?,
    ): List<NearbyUnit> {
        val missions =
            dbMissionRepository
                .findAllByGeometryAndDateRange(
                    geometry,
                    from?.toInstant(),
                    to?.toInstant(),
                ).map {
                    it.toMissionEntity(mapper)
                }
        return missions
            .flatMap { mission -> mission.controlUnits.map { controlUnit -> controlUnit to mission } }
            .groupBy({ it.first }, { it.second })
            .map { (controlUnit, missions) -> NearbyUnit(controlUnit = controlUnit, missions = missions) }
    }
}
