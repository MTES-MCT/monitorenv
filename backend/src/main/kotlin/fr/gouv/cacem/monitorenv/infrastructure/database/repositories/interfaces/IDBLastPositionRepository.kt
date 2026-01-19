package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.LastPositionModel
import org.springframework.data.jpa.repository.JpaRepository

interface IDBLastPositionRepository : JpaRepository<LastPositionModel, Int> {
    fun findAllByShipIdOrderByTimestampDesc(shipId: Int): List<LastPositionModel>
}
