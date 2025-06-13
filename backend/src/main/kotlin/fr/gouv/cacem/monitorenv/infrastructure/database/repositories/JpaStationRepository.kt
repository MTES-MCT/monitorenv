package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.station.StationEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IStationRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.station.dtos.FullStationDTO
import fr.gouv.cacem.monitorenv.infrastructure.database.model.StationModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBStationRepository
import org.slf4j.LoggerFactory
import org.springframework.dao.InvalidDataAccessApiUsageException
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaStationRepository(
    private val dbStationRepository: IDBStationRepository,
) : IStationRepository {
    private val logger = LoggerFactory.getLogger(JpaStationRepository::class.java)

    override fun deleteById(stationId: Int) {
        dbStationRepository.deleteById(stationId)
    }

    override fun findAll(): List<FullStationDTO> = dbStationRepository.findAll().map { it.toFullStation() }

    override fun findAllById(stationIds: List<Int>): List<FullStationDTO> =
        dbStationRepository.findAllById(stationIds).map {
            it.toFullStation()
        }

    override fun findById(stationId: Int): FullStationDTO =
        dbStationRepository.findById(stationId).get().toFullStation()

    @Transactional
    override fun save(station: StationEntity): StationEntity =
        try {
            val stationModel = StationModel.fromStation(station)

            dbStationRepository.save(stationModel).toStation()
        } catch (e: InvalidDataAccessApiUsageException) {
            val errorMessage =
                "Unable to save station with `id` = ${station.id}."
            logger.error(errorMessage, e)
            throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_SAVED, errorMessage)
        }
}
