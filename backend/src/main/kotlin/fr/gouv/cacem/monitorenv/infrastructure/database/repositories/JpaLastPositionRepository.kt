package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.lastPositions.LastPositionEntity
import fr.gouv.cacem.monitorenv.domain.repositories.ILastPositionRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBLastPositionRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Repository

@Repository
class JpaLastPositionRepository(
    private val dbLastPositionRepository: IDBLastPositionRepository,
) : ILastPositionRepository {
    private val logger: Logger = LoggerFactory.getLogger(JpaLastPositionRepository::class.java)

    override fun findAll(shipId: Int): List<LastPositionEntity> =
        dbLastPositionRepository.findAllByShipIdOrderByTimestampDesc(shipId = shipId).map { it.toLastPosition() }
}
