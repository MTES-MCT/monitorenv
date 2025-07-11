package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.station.StationEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IStationRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.station.dtos.FullStationDTO
import fr.gouv.cacem.monitorenv.infrastructure.database.model.StationModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBStationRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaStationRepository(
    private val dbStationRepository: IDBStationRepository,
) : IStationRepository {
    override fun deleteById(stationId: Int) {
        dbStationRepository.deleteById(stationId)
    }

    override fun findAll(): List<FullStationDTO> = dbStationRepository.findAll().map { it.toFullStation() }

    override fun findAllById(stationIds: List<Int>): List<FullStationDTO> =
        dbStationRepository.findAllById(stationIds).map {
            it.toFullStation()
        }

    override fun findById(stationId: Int): FullStationDTO? =
        dbStationRepository.findByIdOrNull(stationId)?.toFullStation()

    @Transactional
    override fun save(station: StationEntity): StationEntity {
        val stationModel = StationModel.fromStation(station)

        return dbStationRepository.save(stationModel).toStation()
    }
}
