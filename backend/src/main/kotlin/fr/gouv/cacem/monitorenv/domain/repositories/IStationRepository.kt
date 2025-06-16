package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.station.StationEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.station.dtos.FullStationDTO

interface IStationRepository {
    fun deleteById(stationId: Int)

    fun findAll(): List<FullStationDTO>

    fun findAllById(stationIds: List<Int>): List<FullStationDTO>

    fun findById(stationId: Int): FullStationDTO?

    fun save(station: StationEntity): StationEntity
}
